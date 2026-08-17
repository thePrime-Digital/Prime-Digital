import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

import {
  getUsersCollection,
} from "@/lib/data/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET():
  Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const database =
      await getDatabase();

    const users =
      await getUsersCollection();

    const admissions =
      database.collection(
        "admission_applications",
      );

    const contacts =
      database.collection(
        "contact_submissions",
      );

    const careers =
      database.collection(
        "career_applications",
      );

    const leads =
      database.collection(
        "service_leads",
      );

    const programs =
      database.collection(
        "programs",
      );

    const classes =
      database.collection(
        "classes",
      );

    const auditLogs =
      database.collection(
        "admin_audit_logs",
      );

    const thirtyDaysAgo =
      new Date();

    thirtyDaysAgo.setDate(
      thirtyDaysAgo.getDate() -
        30,
    );

    const [
      totalUsers,
      students,
      faculty,
      clients,
      admins,
      activeUsers,
      pendingUsers,
      blockedUsers,

      admissionCount,
      contactCount,
      careerCount,
      leadCount,

      programCount,
      activePrograms,

      classCount,
      activeClasses,

      newUsers30Days,
      auditCount,

      recentUsers,
    ] =
      await Promise.all([
        users.countDocuments(),

        users.countDocuments({
          role: "student",
        }),

        users.countDocuments({
          role: "faculty",
        }),

        users.countDocuments({
          role: "client",
        }),

        users.countDocuments({
          role: "admin",
        }),

        users.countDocuments({
          status: "active",
        }),

        users.countDocuments({
          status: "pending",
        }),

        users.countDocuments({
          status: "blocked",
        }),

        admissions.countDocuments(),

        contacts.countDocuments(),

        careers.countDocuments(),

        leads.countDocuments(),

        programs.countDocuments(),

        programs.countDocuments({
          status: "active",
        }),

        classes.countDocuments(),

        classes.countDocuments({
          status: "active",
        }),

        users.countDocuments({
          createdAt: {
            $gte:
              thirtyDaysAgo,
          },
        }),

        auditLogs.countDocuments(),

        users
          .find(
            {},
            {
              projection: {
                passwordHash:
                  0,
              },
            },
          )
          .sort({
            createdAt: -1,
          })
          .limit(8)
          .toArray(),
      ]);

    return NextResponse.json(
      {
        users: {
          total:
            totalUsers,
          students,
          faculty,
          clients,
          admins,

          active:
            activeUsers,
          pending:
            pendingUsers,
          blocked:
            blockedUsers,

          newLast30Days:
            newUsers30Days,
        },

        submissions: {
          admissions:
            admissionCount,

          contacts:
            contactCount,

          careers:
            careerCount,

          serviceLeads:
            leadCount,

          total:
            admissionCount +
            contactCount +
            careerCount +
            leadCount,
        },

        academic: {
          programs:
            programCount,

          activePrograms,

          classes:
            classCount,

          activeClasses,
        },

        activity: {
          adminActions:
            auditCount,
        },

        recentUsers:
          recentUsers.map(
            (user) => ({
              id:
                user._id.toHexString(),

              name:
                user.name,

              email:
                user.email,

              role:
                user.role,

              status:
                user.status,

              createdAt:
                user.createdAt instanceof Date
                  ? user.createdAt.toISOString()
                  : user.createdAt,
            }),
          ),
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error(
      "Admin reports error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load reports.",
      },
      {
        status: 500,
      },
    );
  }
}
