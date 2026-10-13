import { ObjectId, type Document } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getDatabase } from "@/lib/mongodb";
import { getAdminResourceConfig } from "@/lib/admin/admin-resource-registry";
import { getFeesCollection } from "@/lib/data/fees";
import { getUsersCollection } from "@/lib/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

const collections: Record<string, string> = {
  tasks: "staff_tasks",
  leads: "staff_leads",
  demos: "staff_demos",
  counselling: "staff_counselling",
  attendance: "staff_attendance",
  profile: "staff_profiles",
};

const writableFields: Record<string, string[]> = {
  tasks: ["title", "dueDate", "status", "details"],
  leads: ["name", "phone", "email", "course", "source", "stage", "nextFollowUp", "note"],
  demos: ["name", "course", "date", "time", "mode", "status", "note"],
  counselling: ["name", "phone", "studentClass", "session", "reportStatus", "note"],
  profile: ["phone", "designation", "location", "alertLeads", "alertFollowups", "alertFees"],
};

const readOnly = new Set(["students", "fees", "admissions"]);

const allowedStatuses: Record<string, Record<string, readonly string[]>> = {
  tasks: {
    status: ["pending", "done"],
  },
  leads: {
    stage: [
      "New",
      "Contacted",
      "Counselled",
      "Demo booked",
      "Applied",
      "Closed",
    ],
  },
  demos: {
    status: ["Booked", "Came", "No-show"],
  },
  counselling: {
    reportStatus: [
      "Not started",
      "Draft",
      "To approve",
    ],
  },
};

function validateWorkflowFields(
  resource: string,
  fields: Record<string, string | boolean>,
): string | null {
  const rules = allowedStatuses[resource] || {};

  for (const [field, allowed] of Object.entries(rules)) {
    if (!(field in fields)) continue;

    const value = fields[field];

    if (typeof value !== "string" || !allowed.includes(value)) {
      return `Invalid ${field} for ${resource}.`;
    }
  }

  return null;
}

function stringValue(value: unknown, max = 200) {
  return typeof value === "string"
    ? value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max)
    : "";
}

function safeFields(resource: string, body: Record<string, unknown>) {
  const output: Record<string, string | boolean> = {};

  for (const field of writableFields[resource] || []) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) continue;

    if (field.startsWith("alert")) {
      if (typeof body[field] === "boolean") {
        output[field] = body[field] as boolean;
      } else if (body[field] === "true") {
        output[field] = true;
      } else if (body[field] === "false") {
        output[field] = false;
      }
    } else {
      output[field] = stringValue(body[field], field === "note" || field === "details" ? 1200 : 200);
    }
  }

  return output;
}

function serialize(doc: Document) {
  return {
    ...doc,
    id: doc._id?.toString() ?? "",
    _id: undefined,
    staffId: undefined,
    createdBy: undefined,
  };
}

async function requireStaff() {
  const user = await getCurrentUser();
  return user?.role === "staff" && user.status === "active" ? user : null;
}

function denied() {
  return NextResponse.json(
    { error: "Staff authentication required." },
    { status: 403 }
  );
}

function invalid() {
  return NextResponse.json(
    { error: "Unknown Staff resource." },
    { status: 404 }
  );
}

function dateKey() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export async function GET(_request: Request, context: Ctx) {
  const user = await requireStaff();
  if (!user) return denied();

  const { resource } = await context.params;

  try {
    if (resource === "students") {
      const users = await getUsersCollection();
      const rows = await users.find(
        { role: "student", status: "active" },
        {
          projection: {
            name: 1,
            enrollmentNo: 1,
            currentClass: 1,
            program: 1,
          },
        }
      ).sort({ name: 1 }).limit(250).toArray();

      return NextResponse.json({
        records: rows.map((row) => ({
          id: row._id.toString(),
          name: row.name,
          enrollmentNo: row.enrollmentNo || "",
          currentClass: row.currentClass || "",
          program: row.program || "",
        })),
      });
    }

    if (resource === "fees") {
      const fees = await getFeesCollection();
      const rows = await fees.find(
        {},
        {
          projection: {
            studentName: 1,
            invoiceId: 1,
            amount: 1,
            paid: 1,
            balance: 1,
            dueDate: 1,
            status: 1,
          },
        }
      ).sort({ dueDate: 1 }).limit(250).toArray();

      return NextResponse.json({
        records: rows.map((row) => ({
          id: row._id.toString(),
          studentName: row.studentName,
          invoiceId: row.invoiceId,
          amount: row.amount,
          paid: row.paid,
          balance: row.balance,
          dueDate: row.dueDate,
          status: row.status,
        })),
      });
    }

    if (resource === "admissions") {
      const config = getAdminResourceConfig("admissions");
      if (!config) return invalid();

      const db = await getDatabase();
      const rows = await db.collection<Document>(config.collection)
        .find(
          {},
          {
            projection: {
              studentName: 1,
              name: 1,
              program: 1,
              grade: 1,
              status: 1,
              reference: 1,
              createdAt: 1,
            },
          }
        )
        .sort({ createdAt: -1 })
        .limit(250)
        .toArray();

      return NextResponse.json({
        records: rows.map((row) => ({
          id: row._id.toString(),
          studentName: row.studentName || row.name || "",
          program: row.program || "",
          grade: row.grade || "",
          status: row.status || "pending",
          reference: row.reference || "",
          createdAt: row.createdAt,
        })),
      });
    }

    if (!(resource in collections)) return invalid();

    const db = await getDatabase();
    const collection = db.collection<Document>(collections[resource]);

    if (resource === "profile") {
      const row = await collection.findOne({ staffId: user._id });
      return NextResponse.json({
        record: row ? serialize(row) : null,
        user: { name: user.name, email: user.email, phone: user.phone || "" },
      });
    }

    const rows = await collection
      .find({ staffId: user._id })
      .sort({ createdAt: -1 })
      .limit(250)
      .toArray();

    return NextResponse.json({
      records: rows.map(serialize),
      ...(resource === "attendance" ? { today: dateKey() } : {}),
    });
  } catch (error) {
    console.error("Staff GET failed:", resource, error);
    return NextResponse.json({ error: "Unable to load records." }, { status: 500 });
  }
}

export async function POST(request: Request, context: Ctx) {
  const user = await requireStaff();
  if (!user) return denied();

  const { resource } = await context.params;
  if (readOnly.has(resource) || !(resource in collections)) return invalid();

  let body: Record<string, unknown>;
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Invalid body");
    }
    body = value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<Document>(collections[resource]);
    const now = new Date();

    if (resource === "attendance") {
      try {
        await collection.createIndex(
          { staffId: 1, dateKey: 1 },
          {
            unique: true,
            name: "staff_attendance_staff_day_unique",
          },
        );
      } catch (indexError) {
        console.error("Staff attendance index setup failed:", indexError);

        return NextResponse.json(
          {
            error:
              "Attendance uniqueness check failed. Ask an administrator to inspect duplicate attendance records.",
          },
          { status: 503 },
        );
      }

      const action = stringValue(body.action);
      if (action !== "checkin" && action !== "checkout") {
        return NextResponse.json({ error: "Invalid attendance action." }, { status: 400 });
      }

      const day = dateKey();
      const existing = await collection.findOne({ staffId: user._id, dateKey: day });

      if (action === "checkin") {
        if (existing?.checkInAt) {
          return NextResponse.json({ error: "Already checked in today." }, { status: 409 });
        }

        await collection.updateOne(
          { staffId: user._id, dateKey: day },
          {
            $setOnInsert: { staffId: user._id, dateKey: day, createdAt: now },
            $set: { checkInAt: now, updatedAt: now },
          },
          { upsert: true }
        );
      } else {
        if (!existing?.checkInAt || existing.checkOutAt) {
          return NextResponse.json(
            { error: "Check in first, or you have already checked out." },
            { status: 409 }
          );
        }

        await collection.updateOne(
          { _id: existing._id, staffId: user._id },
          { $set: { checkOutAt: now, updatedAt: now } }
        );
      }

      return NextResponse.json({ message: "Attendance updated." });
    }

    const fields = safeFields(resource, body);

    const workflowError = validateWorkflowFields(resource, fields);

    if (workflowError) {
      return NextResponse.json(
        { error: workflowError },
        { status: 400 },
      );
    }

    if (resource === "profile") {
      await collection.updateOne(
        { staffId: user._id },
        {
          $set: { ...fields, updatedAt: now },
          $setOnInsert: { staffId: user._id, createdAt: now },
        },
        { upsert: true }
      );

      return NextResponse.json({ message: "Profile preferences saved." });
    }

    if (!stringValue(fields.title ?? fields.name)) {
      return NextResponse.json(
        { error: resource === "tasks" ? "Task title is required." : "Name is required." },
        { status: 400 }
      );
    }

    const result = await collection.insertOne({
      ...fields,
      staffId: user._id,
      status: fields.status || (resource === "tasks" ? "pending" : undefined),
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { message: "Record created.", id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    if (
      resource === "attendance" &&
      error instanceof Error &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        { error: "Attendance already exists for today. Refresh the page." },
        { status: 409 },
      );
    }

    console.error("Staff POST failed:", resource, error);
    return NextResponse.json({ error: "Unable to save record." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: Ctx) {
  const user = await requireStaff();
  if (!user) return denied();

  const { resource } = await context.params;

  if (!["tasks", "leads", "demos", "counselling"].includes(resource)) {
    return invalid();
  }

  let body: Record<string, unknown>;
  try {
    const value: unknown = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("Invalid body");
    }
    body = value as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const id = stringValue(body.id, 50);
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid record ID." }, { status: 400 });
  }

  const updates = safeFields(resource, body);

  const workflowError = validateWorkflowFields(resource, updates);

  if (workflowError) {
    return NextResponse.json(
      { error: workflowError },
      { status: 400 },
    );
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No changes supplied." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const result = await db.collection<Document>(collections[resource]).updateOne(
      { _id: new ObjectId(id), staffId: user._id },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    if (!result.matchedCount) {
      return NextResponse.json({ error: "Record not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Record updated." });
  } catch (error) {
    console.error("Staff PATCH failed:", resource, error);
    return NextResponse.json({ error: "Unable to update record." }, { status: 500 });
  }
}