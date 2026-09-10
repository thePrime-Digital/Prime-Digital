import {
  ObjectId,
  type Document,
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type PatchBody =
  Record<
    string,
    unknown
  >;

function text(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

export async function PATCH(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const {
    id,
  } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid career job ID.",
      },
      {
        status: 400,
      },
    );
  }

  let body:
    PatchBody;

  try {
    body =
      (await request.json()) as
        PatchBody;
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

  try {
    const database =
      await getDatabase();

    const collection =
      database.collection<Document>(
        "career_jobs",
      );

    const objectId =
      new ObjectId(
        id,
      );

    const existing =
      await collection.findOne({
        _id:
          objectId,
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Career job not found.",
        },
        {
          status: 404,
        },
      );
    }

    const updates:
      Record<
        string,
        unknown
      > = {};

    if (
      "title" in
      body
    ) {
      const value =
        text(
          body.title,
        );

      if (
        value.length <
          2 ||
        value.length >
          120
      ) {
        return NextResponse.json(
          {
            error:
              "Job title must be between 2 and 120 characters.",
          },
          {
            status: 400,
          },
        );
      }

      updates.title =
        value;
    }

    if (
      "department" in
      body
    ) {
      const value =
        text(
          body.department,
        );

      if (
        value.length <
          2 ||
        value.length >
          100
      ) {
        return NextResponse.json(
          {
            error:
              "Department is required.",
          },
          {
            status: 400,
          },
        );
      }

      updates.department =
        value;
    }

    if (
      "location" in
      body
    ) {
      const value =
        text(
          body.location,
        );

      if (
        value.length <
          2 ||
        value.length >
          150
      ) {
        return NextResponse.json(
          {
            error:
              "Location is required.",
          },
          {
            status: 400,
          },
        );
      }

      updates.location =
        value;
    }

    if (
      "employmentType" in
      body
    ) {
      const value =
        text(
          body.employmentType,
        );

      if (
        !EMPLOYMENT_TYPES.includes(
          value as
            (typeof EMPLOYMENT_TYPES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid employment type.",
          },
          {
            status: 400,
          },
        );
      }

      updates.employmentType =
        value;
    }

    if (
      "workMode" in
      body
    ) {
      const value =
        text(
          body.workMode,
        );

      if (
        !WORK_MODES.includes(
          value as
            (typeof WORK_MODES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid work mode.",
          },
          {
            status: 400,
          },
        );
      }

      updates.workMode =
        value;
    }

    if (
      "experience" in
      body
    ) {
      updates.experience =
        text(
          body.experience,
        );
    }

    if (
      "salary" in
      body
    ) {
      updates.salary =
        text(
          body.salary,
        );
    }

    if (
      "description" in
      body
    ) {
      const value =
        text(
          body.description,
        );

      if (
        value.length <
          10 ||
        value.length >
          5000
      ) {
        return NextResponse.json(
          {
            error:
              "Job description must be between 10 and 5000 characters.",
          },
          {
            status: 400,
          },
        );
      }

      updates.description =
        value;
    }

    if (
      "responsibilities" in
      body
    ) {
      updates.responsibilities =
        text(
          body.responsibilities,
        );
    }

    if (
      "requirements" in
      body
    ) {
      updates.requirements =
        text(
          body.requirements,
        );
    }

    if (
      "vacancies" in
      body
    ) {
      const value =
        Number(
          body.vacancies,
        );

      if (
        !Number.isInteger(
          value,
        ) ||
        value <
          1 ||
        value >
          999
      ) {
        return NextResponse.json(
          {
            error:
              "Vacancies must be between 1 and 999.",
          },
          {
            status: 400,
          },
        );
      }

      updates.vacancies =
        value;
    }

    if (
      "featured" in
      body
    ) {
      if (
        typeof body.featured !==
        "boolean"
      ) {
        return NextResponse.json(
          {
            error:
              "Featured must be true or false.",
          },
          {
            status: 400,
          },
        );
      }

      updates.featured =
        body.featured;
    }

    if (
      "deadline" in
      body
    ) {
      const value =
        text(
          body.deadline,
        );

      if (!value) {
        updates.deadline =
          null;
      } else {
        const parsed =
          new Date(
            `${value}T23:59:59.999Z`,
          );

        if (
          Number.isNaN(
            parsed.getTime(),
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid application deadline.",
            },
            {
              status: 400,
            },
          );
        }

        updates.deadline =
          parsed;
      }
    }

    if (
      "status" in
      body
    ) {
      const status =
        text(
          body.status,
        );

      if (
        !JOB_STATUSES.includes(
          status as
            (typeof JOB_STATUSES)[number],
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid job status.",
          },
          {
            status: 400,
          },
        );
      }

      updates.status =
        status;

      if (
        status ===
        "published"
      ) {
        updates.publishedAt =
          existing.publishedAt instanceof
          Date
            ? existing.publishedAt
            : new Date();

        updates.closedAt =
          null;
      }

      if (
        status ===
        "closed"
      ) {
        updates.closedAt =
          new Date();
      }

      if (
        status ===
        "draft"
      ) {
        updates.closedAt =
          null;
      }
    }

    const editableKeys =
      Object.keys(
        updates,
      );

    if (
      editableKeys.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        },
      );
    }

    updates.updatedAt =
      new Date();

    await collection.updateOne(
      {
        _id:
          objectId,
      },
      {
        $set:
          updates,
      },
    );

    const updated =
      await collection.findOne({
        _id:
          objectId,
      });

    if (!updated) {
      return NextResponse.json(
        {
          error:
            "Career job could not be reloaded.",
        },
        {
          status: 500,
        },
      );
    }

    const changes =
      editableKeys.map(
        (
          key,
        ) => ({
          field:
            key,

          from:
            existing[key] ??
            null,

          to:
            updates[key] ??
            null,
        }),
      );

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CAREER_JOB_UPDATED",

      targetUserId:
        id,

      changes,
    });

    return NextResponse.json({
      message:
        "Career job updated successfully.",

      job: {
        id:
          updated._id.toHexString(),

        status:
          updated.status,

        title:
          updated.title,
      },
    });
  } catch (error) {
    console.error(
      "Admin career job PATCH error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to update career job.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const authorization =
    await requireAdminApi();

  if (
    "response" in
    authorization
  ) {
    return authorization.response;
  }

  const {
    id,
  } =
    await context.params;

  if (
    !ObjectId.isValid(
      id,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid career job ID.",
      },
      {
        status: 400,
      },
    );
  }

  try {
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

    const objectId =
      new ObjectId(
        id,
      );

    const existing =
      await jobsCollection.findOne({
        _id:
          objectId,
      });

    if (!existing) {
      return NextResponse.json(
        {
          error:
            "Career job not found.",
        },
        {
          status: 404,
        },
      );
    }

    const applicationCount =
      await applicationsCollection.countDocuments({
        jobId: {
          $in: [
            objectId,
            id,
          ],
        },
      });

    /*
     * Once people have applied, we preserve
     * the job and its recruitment history.
     */
    if (
      applicationCount >
      0
    ) {
      return NextResponse.json(
        {
          error:
            "This job already has applications. Close the job instead of deleting it.",
        },
        {
          status: 409,
        },
      );
    }

    await jobsCollection.deleteOne({
      _id:
        objectId,
    });

    await createAdminAuditLog({
      actorId:
        authorization.user._id.toHexString(),

      actorEmail:
        authorization.user.email,

      action:
        "CAREER_JOB_DELETED",

      targetUserId:
        id,

      changes: [
        {
          field:
            "title",

          from:
            existing.title,
        },

        {
          field:
            "status",

          from:
            existing.status,
        },
      ],
    });

    return NextResponse.json({
      message:
        "Career job deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Admin career job DELETE error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to delete career job.",
      },
      {
        status: 500,
      },
    );
  }
}