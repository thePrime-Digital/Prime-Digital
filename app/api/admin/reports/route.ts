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

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

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

const pdsRoles: (
  | "student"
  | "faculty"
  | "admin"
)[] = [
  "student",
  "faculty",
  "admin",
];

    const pdsUserFilter = {
      role: {
        $in: pdsRoles,
      },
    };

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
      admins,

      activeUsers,
      activeStudents,
      pendingUsers,
      blockedUsers,

      admissionCount,
      contactCount,
      careerCount,

      programCount,
      activePrograms,

      classCount,
      activeClasses,

      newUsers30Days,
      auditCount,

      recentUsers,
    ] =
      await Promise.all([
        users.countDocuments(
          pdsUserFilter,
        ),

        users.countDocuments({
          role: "student",
        }),

        users.countDocuments({
          role: "faculty",
        }),

        users.countDocuments({
          role: "admin",
        }),

        users.countDocuments({
          ...pdsUserFilter,
          status: "active",
        }),

        users.countDocuments({
          role: "student",
          status: "active",
        }),

        users.countDocuments({
          ...pdsUserFilter,
          status: "pending",
        }),

        users.countDocuments({
          ...pdsUserFilter,
          status: "blocked",
        }),

        admissions.countDocuments(),

        contacts.countDocuments(),

        careers.countDocuments(),

        programs.countDocuments(),

        programs.countDocuments({
          status: "active",
        }),

        classes.countDocuments(),

        classes.countDocuments({
          status: "active",
        }),

        users.countDocuments({
          ...pdsUserFilter,

          createdAt: {
            $gte:
              thirtyDaysAgo,
          },
        }),

        auditLogs.countDocuments(),

        users
          .find(
            pdsUserFilter,
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
          admins,

          active:
            activeUsers,

          activeStudents,

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

          total:
            admissionCount +
            contactCount +
            careerCount,
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
                user.createdAt instanceof
                Date
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