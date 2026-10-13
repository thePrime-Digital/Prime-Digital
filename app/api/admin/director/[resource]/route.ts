import { NextResponse } from "next/server";
import { ObjectId, type Document } from "mongodb";

import { requireAdminApi } from "@/lib/auth/api-authorization";
import { getDatabase } from "@/lib/mongodb";
import { getUsersCollection } from "@/lib/data/users";
import { getFeesCollection } from "@/lib/data/fees";
import { getAdminResourceConfig } from "@/lib/admin/admin-resource-registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{ resource: string }>;
};

const collectionNames: Record<string, string> = {
  tests: "admin_test_calendar",
  placement: "admin_placement_drives",
  notices: "admin_director_notice_drafts",
};

const allowedFields: Record<string, string[]> = {
  tests: ["title", "course", "batch", "examDate", "faculty", "notes"],
  placement: ["company", "roles", "driveDate", "status", "notes"],
  notices: ["title", "message", "audience", "pinToTop"],
};

function value(raw: unknown, limit = 300): string {
  return typeof raw === "string"
    ? raw.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, limit)
    : "";
}

function toISO(raw: unknown): string | null {
  if (raw instanceof Date) return raw.toISOString();
  return typeof raw === "string" ? raw : null;
}

function serialize(row: Document) {
  return {
    id: row._id.toString(),
    title: value(row.title),
    course: value(row.course),
    batch: value(row.batch),
    examDate: value(row.examDate),
    faculty: value(row.faculty),
    company: value(row.company),
    roles: value(row.roles),
    driveDate: value(row.driveDate),
    status: value(row.status),
    notes: value(row.notes, 1000),
    message: value(row.message, 2000),
    audience: value(row.audience),
    pinToTop: row.pinToTop === true,
    createdAt: toISO(row.createdAt),
  };
}

export async function GET(_request: Request, context: Context) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource } = await context.params;

  try {
    const db = await getDatabase();

    if (resource === "overview") {
      const users = await getUsersCollection();
      const fees = await getFeesCollection();
      const admissionsConfig = getAdminResourceConfig("admissions");
      const admissions = admissionsConfig
        ? db.collection<Document>(admissionsConfig.collection)
        : null;

      const [
        studentCount,
        facultyCount,
        staffCount,
        pendingFaculty,
        activeClasses,
        applicationCount,
        feeRows,
        leadCount,
        demoCount,
      ] = await Promise.all([
        users.countDocuments({ role: "student", status: "active" }),
        users.countDocuments({ role: "faculty", status: "active" }),
        users.countDocuments({ role: "staff", status: "active" }),
        users.countDocuments({ role: "faculty", status: "pending" }),
        db.collection("classes").countDocuments({ status: { $ne: "archived" } }),
        admissions ? admissions.countDocuments() : Promise.resolve(0),
        fees.find({}, {
          projection: { amount: 1, paid: 1, balance: 1, dueDate: 1, status: 1 },
        }).limit(5000).toArray(),
        db.collection("staff_leads").countDocuments(),
        db.collection("staff_demos").countDocuments(),
      ]);

      const totalPaid = feeRows.reduce(
        (sum, row) => sum + Number(row.paid || 0),
        0
      );
      const outstanding = feeRows.reduce(
        (sum, row) => sum + Number(row.balance || 0),
        0
      );

      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

      const overdue15 = feeRows.filter(
        (row) =>
          Number(row.balance || 0) > 0 &&
          row.dueDate instanceof Date &&
          row.dueDate < fifteenDaysAgo
      );

      const overdueAmount = overdue15.reduce(
        (sum, row) => sum + Number(row.balance || 0),
        0
      );

      const pipeline = admissions
        ? await admissions.aggregate<{ _id: string; count: number }>([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]).toArray()
        : [];

      return NextResponse.json({
        stats: {
          students: studentCount,
          faculty: facultyCount,
          staff: staffCount,
          pendingFaculty,
          classes: activeClasses,
          admissions: applicationCount,
          leads: leadCount,
          demos: demoCount,
          collected: totalPaid,
          outstanding,
          overdue15: overdueAmount,
          overdueStudents: overdue15.length,
        },
        pipeline: pipeline.map((row) => ({
          stage: row._id || "Unspecified",
          count: row.count,
        })),
      });
    }

    if (resource === "leads") {
      const rows = await db.collection<Document>("staff_leads")
        .find({}, {
          projection: {
            name: 1,
            course: 1,
            source: 1,
            stage: 1,
            nextFollowUp: 1,
            createdAt: 1,
          },
        })
        .sort({ createdAt: -1 })
        .limit(300)
        .toArray();

      return NextResponse.json({
        records: rows.map((row) => ({
          id: row._id.toString(),
          name: value(row.name),
          course: value(row.course),
          source: value(row.source),
          stage: value(row.stage),
          nextFollowUp: value(row.nextFollowUp),
          createdAt: toISO(row.createdAt),
        })),
      });
    }

    if (resource === "payroll") {
      const people = await db.collection<Document>("users")
        .find(
          { role: { $in: ["faculty", "staff"] }, status: "active" },
          { projection: { name: 1, role: 1, email: 1 } }
        )
        .sort({ name: 1 })
        .limit(300)
        .toArray();

      return NextResponse.json({
        records: people.map((person) => ({
          id: person._id.toString(),
          name: value(person.name),
          role: value(person.role),
          email: value(person.email),
        })),
      });
    }

    if (!(resource in collectionNames)) {
      return NextResponse.json({ error: "Unknown resource." }, { status: 404 });
    }

    const rows = await db.collection<Document>(collectionNames[resource])
      .find({})
      .sort({ createdAt: -1 })
      .limit(300)
      .toArray();

    return NextResponse.json({ records: rows.map(serialize) });
  } catch (error) {
    console.error("Admin Director GET failed:", resource, error);
    return NextResponse.json(
      { error: "Unable to load Admin records." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request, context: Context) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource } = await context.params;

  if (!(resource in collectionNames)) {
    return NextResponse.json(
      { error: "This resource is read-only." },
      { status: 405 }
    );
  }

  let body: Record<string, unknown>;

  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Invalid JSON");
    }
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const clean: Record<string, string | boolean> = {};

  for (const field of allowedFields[resource]) {
    if (field === "pinToTop") {
      clean[field] = body[field] === true;
    } else {
      clean[field] = value(
        body[field],
        field === "message" || field === "notes" ? 2000 : 300
      );
    }
  }

  const required =
    resource === "tests"
      ? ["title", "examDate"]
      : resource === "placement"
        ? ["company", "roles", "driveDate"]
        : ["title", "message"];

  if (required.some((field) => !clean[field])) {
    return NextResponse.json(
      { error: `Required fields: ${required.join(", ")}` },
      { status: 400 }
    );
  }

  for (const dateField of ["examDate", "driveDate"]) {
    if (typeof clean[dateField] === "string" && clean[dateField]) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(clean[dateField] as string)) {
        return NextResponse.json(
          { error: "Invalid date." },
          { status: 400 }
        );
      }
    }
  }

  try {
    const db = await getDatabase();
    const now = new Date();

    const result = await db.collection(collectionNames[resource]).insertOne({
      ...clean,
      status: resource === "placement" ? "open" : undefined,
      deliveryStatus: resource === "notices" ? "draft" : undefined,
      createdBy: auth.user._id,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      {
        message: resource === "notices"
          ? "Notice draft saved. No messages have been sent."
          : "Record saved successfully.",
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin Director POST failed:", resource, error);
    return NextResponse.json(
      { error: "Unable to save record." },
      { status: 500 }
    );
  }
}