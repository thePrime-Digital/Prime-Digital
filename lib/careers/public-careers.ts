import {
  type Document,
} from "mongodb";

import {
  getDatabase,
} from "@/lib/mongodb";

export type PublicCareerJob = {
  id: string;
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
  deadline: string | null;
  featured: boolean;
};

function dateValue(
  value: unknown,
): string | null {
  if (
    value instanceof Date
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

export async function getPublishedCareerJobs():
  Promise<PublicCareerJob[]> {
  const database =
    await getDatabase();

  const now =
    new Date();

  const jobs =
    await database
      .collection<Document>(
        "career_jobs",
      )
      .find({
        status:
          "published",

        $or: [
          {
            deadline:
              null,
          },

          {
            deadline: {
              $exists:
                false,
            },
          },

          {
            deadline: {
              $gte:
                now,
            },
          },
        ],
      })
      .sort({
        featured:
          -1,

        createdAt:
          -1,

        _id:
          -1,
      })
      .toArray();

  return jobs.map(
    (
      job,
    ) => ({
      id:
        job._id.toHexString(),

      title:
        String(
          job.title ||
            "Career Opportunity",
        ),

      department:
        String(
          job.department ||
            "",
        ),

      location:
        String(
          job.location ||
            "",
        ),

      employmentType:
        String(
          job.employmentType ||
            "",
        ),

      workMode:
        String(
          job.workMode ||
            "",
        ),

      experience:
        String(
          job.experience ||
            "",
        ),

      vacancies:
        typeof job.vacancies ===
        "number"
          ? job.vacancies
          : 1,

      salary:
        String(
          job.salary ||
            "",
        ),

      description:
        String(
          job.description ||
            "",
        ),

      responsibilities:
        String(
          job.responsibilities ||
            "",
        ),

      requirements:
        String(
          job.requirements ||
            "",
        ),

      deadline:
        dateValue(
          job.deadline,
        ),

      featured:
        job.featured ===
        true,
    }),
  );
}