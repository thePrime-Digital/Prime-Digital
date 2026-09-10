import {
  ObjectId,
  type Document,
  type Filter,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const STATUSES = [
  "new",
  "under_review",
  "shortlisted",
  "interview",
  "hired",
  "rejected",
] as const;

type ApplicationStatus =
  (typeof STATUSES)[number];

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof Date
  ) {
    return value.toISOString();
  }

  return typeof value ===
    "string"
    ? value
    : null;
}

function serialise(
  document: Document,
) {
  const jobId =
    document.jobId instanceof
    ObjectId
      ? document.jobId.toHexString()
      : String(
          document.jobId ||
            "",
        );

  return {
    id:
      document._id.toHexString(),

    reference:
      String(
        document.reference ||
          "",
      ),

    jobId,

    jobTitle:
      String(
        document.jobTitle ||
          "",
      ),

    department:
      String(
        document.department ||
          "",
      ),

    fullName:
      String(
        document.fullName ||
          "",
      ),

    email:
      String(
        document.email ||
          "",
      ),

    phone:
      String(
        document.phone ||
          "",
      ),

    city:
      String(
        document.city ||
          "",
      ),

    experience:
      String(
        document.experience ||
          "",
      ),

    linkedin:
      String(
        document.linkedin ||
          "",
      ),

    portfolio:
      String(
        document.portfolio ||
          "",
      ),

    coverLetter:
      String(
        document.coverLetter ||
          "",
      ),

    cvFileName:
      String(
        document.cvFileName ||
          "Resume",
      ),

    status:
      String(
        document.status ||
          "new",
      ),

    internalNotes:
      String(
        document.internalNotes ||
          "",
      ),

    createdAt:
      dateValue(
        document.createdAt,
      ),

    updatedAt:
      dateValue(
        document.updatedAt,
      ),
  };
}

export async function GET(
  request: Request,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  try {
    const url =
      new URL(
        request.url,
      );

    const search =
      url.searchParams
        .get("search")
        ?.trim() ||
      "";

    const status =
      url.searchParams
        .get("status")
        ?.trim() ||
      "";

    const jobId =
      url.searchParams
        .get("jobId")
        ?.trim() ||
      "";

    const filter:
      Filter<Document> = {};

    if (
      STATUSES.includes(
        status as ApplicationStatus,
      )
    ) {
      filter.status =
        status;
    }

    if (
      jobId &&
      ObjectId.isValid(
        jobId,
      )
    ) {
      filter.jobId = {
        $in: [
          new ObjectId(
            jobId,
          ),
          jobId,
        ],
      };
    }

    if (search) {
      const escaped =
        escapeRegex(
          search,
        );

      filter.$or = [
        {
          fullName: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
        {
          email: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
        {
          phone: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
        {
          jobTitle: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
        {
          reference: {
            $regex:
              escaped,
            $options:
              "i",
          },
        },
      ];
    }

    const database =
      await getDatabase();

    const applications =
      database.collection<Document>(
        "career_applications",
      );

    const jobs =
      database.collection<Document>(
        "career_jobs",
      );

    const [
      records,
      total,
      newCount,
      underReview,
      shortlisted,
      interview,
      hired,
      rejected,
      jobRecords,
    ] =
      await Promise.all([
        applications
          .find(
            filter,
          )
          .sort({
            createdAt:
              -1,
            _id:
              -1,
          })
          .limit(
            300,
          )
          .toArray(),

        applications.countDocuments(),

        applications.countDocuments({
          status:
            "new",
        }),

        applications.countDocuments({
          status:
            "under_review",
        }),

        applications.countDocuments({
          status:
            "shortlisted",
        }),

        applications.countDocuments({
          status:
            "interview",
        }),

        applications.countDocuments({
          status:
            "hired",
        }),

        applications.countDocuments({
          status:
            "rejected",
        }),

        jobs
          .find(
            {},
            {
              projection: {
                title:
                  1,
                status:
                  1,
              },
            },
          )
          .sort({
            createdAt:
              -1,
          })
          .toArray(),
      ]);

    return NextResponse.json(
      {
        applications:
          records.map(
            serialise,
          ),

        counts: {
          total,
          new:
            newCount,
          under_review:
            underReview,
          shortlisted,
          interview,
          hired,
          rejected,
        },

        jobs:
          jobRecords.map(
            (
              job,
            ) => ({
              id:
                job._id.toHexString(),

              title:
                String(
                  job.title ||
                    "",
                ),

              status:
                String(
                  job.status ||
                    "draft",
                ),
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
      "Admin career applications GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load career applications.",
      },
      {
        status: 500,
      },
    );
  }
}