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
  createAdminAuditLog,
} from "@/lib/data/admin-audit";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const JOB_STATUSES = [
  "draft",
  "published",
  "closed",
] as const;

const EMPLOYMENT_TYPES = [
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
  "Freelance",
] as const;

const WORK_MODES = [
  "On-site",
  "Hybrid",
  "Remote",
] as const;

type JobStatus =
  (typeof JOB_STATUSES)[number];

type CreateJobBody = {
  title?: unknown;
  department?: unknown;
  location?: unknown;
  employmentType?: unknown;
  workMode?: unknown;
  experience?: unknown;
  vacancies?: unknown;
  salary?: unknown;
  description?: unknown;
  responsibilities?: unknown;
  requirements?: unknown;
  deadline?: unknown;
  status?: unknown;
  featured?: unknown;
};

function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function stringValue(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof
    Date
  ) {
    return value.toISOString();
  }

  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return null;
}

function serialiseJob(
  document: Document,
  applicationCount = 0,
) {
  return {
    id:
      document._id.toHexString(),

    title:
      String(
        document.title ||
          "",
      ),

    department:
      String(
        document.department ||
          "",
      ),

    location:
      String(
        document.location ||
          "",
      ),

    employmentType:
      String(
        document.employmentType ||
          "",
      ),

    workMode:
      String(
        document.workMode ||
          "",
      ),

    experience:
      String(
        document.experience ||
          "",
      ),

    vacancies:
      typeof document.vacancies ===
      "number"
        ? document.vacancies
        : 1,

    salary:
      String(
        document.salary ||
          "",
      ),

    description:
      String(
        document.description ||
          "",
      ),

    responsibilities:
      String(
        document.responsibilities ||
          "",
      ),

    requirements:
      String(
        document.requirements ||
          "",
      ),

    deadline:
      dateValue(
        document.deadline,
      ),

    status:
      String(
        document.status ||
          "draft",
      ),

    featured:
      document.featured ===
      true,

    applicationCount,

    publishedAt:
      dateValue(
        document.publishedAt,
      ),

    closedAt:
      dateValue(
        document.closedAt,
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

function validateCreateBody(
  body: CreateJobBody,
):
  | {
      ok: true;

      data: {
        title: string;
        department: string;
        location: string;
        employmentType: string;
        workMode: string;
        experience: string;
        vacancies: number;
        salary: string;
        description: string;
        responsibilities: string;
        requirements: string;
        deadline: Date | null;
        status: JobStatus;
        featured: boolean;
      };
    }
  | {
      ok: false;
      error: string;
    } {
  const title =
    stringValue(
      body.title,
    );

  const department =
    stringValue(
      body.department,
    );

  const location =
    stringValue(
      body.location,
    );

  const employmentType =
    stringValue(
      body.employmentType,
    );

  const workMode =
    stringValue(
      body.workMode,
    );

  const experience =
    stringValue(
      body.experience,
    );

  const salary =
    stringValue(
      body.salary,
    );

  const description =
    stringValue(
      body.description,
    );

  const responsibilities =
    stringValue(
      body.responsibilities,
    );

  const requirements =
    stringValue(
      body.requirements,
    );

  if (
    title.length <
      2 ||
    title.length >
      120
  ) {
    return {
      ok: false,

      error:
        "Job title must be between 2 and 120 characters.",
    };
  }

  if (
    department.length <
      2 ||
    department.length >
      100
  ) {
    return {
      ok: false,

      error:
        "Department is required.",
    };
  }

  if (
    location.length <
      2 ||
    location.length >
      150
  ) {
    return {
      ok: false,

      error:
        "Location is required.",
    };
  }

  if (
    !EMPLOYMENT_TYPES.includes(
      employmentType as
        (typeof EMPLOYMENT_TYPES)[number],
    )
  ) {
    return {
      ok: false,

      error:
        "Invalid employment type.",
    };
  }

  if (
    !WORK_MODES.includes(
      workMode as
        (typeof WORK_MODES)[number],
    )
  ) {
    return {
      ok: false,

      error:
        "Invalid work mode.",
    };
  }

  if (
    description.length <
      10 ||
    description.length >
      5000
  ) {
    return {
      ok: false,

      error:
        "Job description must be between 10 and 5000 characters.",
    };
  }

  const vacancies =
    Number(
      body.vacancies ??
        1,
    );

  if (
    !Number.isInteger(
      vacancies,
    ) ||
    vacancies <
      1 ||
    vacancies >
      999
  ) {
    return {
      ok: false,

      error:
        "Vacancies must be between 1 and 999.",
    };
  }

  let deadline:
    Date | null =
    null;

  const deadlineString =
    stringValue(
      body.deadline,
    );

  if (
    deadlineString
  ) {
    const parsed =
      new Date(
        `${deadlineString}T23:59:59.999Z`,
      );

    if (
      Number.isNaN(
        parsed.getTime(),
      )
    ) {
      return {
        ok: false,

        error:
          "Invalid application deadline.",
      };
    }

    deadline =
      parsed;
  }

  let status:
    JobStatus =
    "draft";

  if (
    typeof body.status ===
      "string" &&
    JOB_STATUSES.includes(
      body.status as
        JobStatus,
    )
  ) {
    status =
      body.status as
        JobStatus;
  }

  return {
    ok: true,

    data: {
      title,
      department,
      location,
      employmentType,
      workMode,
      experience,
      vacancies,
      salary,
      description,
      responsibilities,
      requirements,
      deadline,
      status,

      featured:
        body.featured ===
        true,
    },
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
        .get(
          "search",
        )
        ?.trim() ||
      "";

    const status =
      url.searchParams
        .get(
          "status",
        )
        ?.trim() ||
      "";

    const filter:
      Filter<Document> = {};

    if (
      JOB_STATUSES.includes(
        status as
          JobStatus,
      )
    ) {
      filter.status =
        status;
    }

    if (search) {
      const escaped =
        escapeRegex(
          search,
        );

      filter.$or = [
        {
          title: {
            $regex:
              escaped,

            $options:
              "i",
          },
        },

        {
          department: {
            $regex:
              escaped,

            $options:
              "i",
          },
        },

        {
          location: {
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

    const jobsCollection =
      database.collection<Document>(
        "career_jobs",
      );

    const applicationsCollection =
      database.collection<Document>(
        "career_applications",
      );

    const [
      jobs,
      total,
      draft,
      published,
      closed,
      applications,
      newApplications,
    ] =
      await Promise.all([
        jobsCollection
          .find(
            filter,
          )
          .sort({
            featured:
              -1,

            createdAt:
              -1,

            _id:
              -1,
          })
          .limit(
            200,
          )
          .toArray(),

        jobsCollection.countDocuments(),

        jobsCollection.countDocuments({
          status:
            "draft",
        }),

        jobsCollection.countDocuments({
          status:
            "published",
        }),

        jobsCollection.countDocuments({
          status:
            "closed",
        }),

        applicationsCollection.countDocuments(),

        applicationsCollection.countDocuments({
          status:
            "new",
        }),
      ]);

    const jobReferenceValues =
      jobs.flatMap(
        (
          job,
        ) => [
          job._id,

          job._id.toHexString(),
        ],
      );

    const applicationRows =
      jobReferenceValues.length >
      0
        ? await applicationsCollection
            .aggregate<{
              _id: unknown;
              count: number;
            }>([
              {
                $match: {
                  jobId: {
                    $in:
                      jobReferenceValues,
                  },
                },
              },

              {
                $group: {
                  _id:
                    "$jobId",

                  count: {
                    $sum:
                      1,
                  },
                },
              },
            ])
            .toArray()
        : [];

    const applicationCountMap =
      new Map<
        string,
        number
      >();

    for (
      const row
      of applicationRows
    ) {
      const key =
        String(
          row._id,
        );

      applicationCountMap.set(
        key,

        (
          applicationCountMap.get(
            key,
          ) ||
          0
        ) +
          Number(
            row.count ||
              0,
          ),
      );
    }

    return NextResponse.json(
      {
        jobs:
          jobs.map(
            (
              job,
            ) =>
              serialiseJob(
                job,

                applicationCountMap.get(
                  job._id.toHexString(),
                ) ||
                  0,
              ),
          ),

        counts: {
          total,
          draft,
          published,
          closed,
          applications,
          newApplications,
        },
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
      "Admin careers GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load career jobs.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
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

  let body:
    CreateJobBody;

  try {
    body =
      (await request.json()) as
        CreateJobBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const clean =
    validateCreateBody(
      body,
    );

  if (clean.ok === false) {
    return NextResponse.json(
      {
        error:
          clean.error,
      },
      {
        status: 400,
      },
    );
  }

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "career_jobs",
      );

    const now =
      new Date();

    const result =
      await collection.insertOne({
        ...clean.data,

        publishedAt:
          clean.data.status ===
          "published"
            ? now
            : null,

        closedAt:
          clean.data.status ===
          "closed"
            ? now
            : null,

        createdBy:
          authorization.user._id,

        createdByEmail:
          authorization.user.email,

        createdAt:
          now,

        updatedAt:
          now,
      });

    const created =
      await collection.findOne({
        _id:
          result.insertedId,
      });

    if (!created) {
      return NextResponse.json(
        {
          error:
            "Job could not be reloaded.",
        },
        {
          status: 500,
        },
      );
    }

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CAREER_JOB_CREATED",

      targetUserId:
        result.insertedId.toHexString(),

      changes: [
        {
          field:
            "title",

          to:
            clean.data.title,
        },

        {
          field:
            "status",

          to:
            clean.data.status,
        },
      ],
    });

    return NextResponse.json(
      {
        message:
          clean.data.status ===
          "published"
            ? "Job published successfully."
            : "Career job created successfully.",

        job:
          serialiseJob(
            created,
            0,
          ),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Admin careers POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create career job.",
      },
      {
        status: 500,
      },
    );
  }
}