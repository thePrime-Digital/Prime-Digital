import { ObjectId, type Document } from "mongodb";
import { NextResponse } from "next/server";

import { requireStudentApi } from "@/lib/auth/api-student-authorization";
import { getDatabase } from "@/lib/mongodb";
import {
  objectIdString,
  studentReferenceValues,
} from "@/lib/student/data";

import { getStoredMumbaiJobs } from "@/lib/mumbai-jobs-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Job = Awaited<ReturnType<typeof getStoredMumbaiJobs>>[number];

const COURSE_RULES = [
  {
    name: "Digital Marketing",
    courses: /digital[\s-]*marketing|performance[\s-]*marketing|seo[\s-]*marketing/i,
    jobs: /\b(?:seo|sem|ppc|paid search|paid media|google ads|meta ads|social media|social media marketing|digital marketing|performance marketing|content marketing|email marketing|growth marketing|search engine optimization|search engine marketing)\b/i,
  },
  {
    name: "Data Analytics",
    courses: /data[\s-]*analy|business[\s-]*intelligence|power[\s-]*bi/i,
    jobs: /\b(?:data analyst|business analyst|business intelligence|power bi|tableau|reporting analyst|mis analyst|analytics analyst|sql analyst|bi developer|data analytics)\b/i,
  },
  {
    name: "Web Development",
    courses: /web[\s-]*develop|frontend|front[\s-]*end|full[\s-]*stack|react[\s-]*develop/i,
    jobs: /\b(?:web developer|frontend|front.end|full.stack|react developer|next\.?js|javascript developer|web application developer)\b/i,
  },
  {
    name: "AI & Machine Learning",
    courses: /artificial intelligence|machine learning|ai[\s/&-]*ml|data science/i,
    jobs: /\b(?:machine learning|ai engineer|artificial intelligence|data scientist|ml engineer|nlp engineer|computer vision|generative ai|llm engineer)\b/i,
  },
  {
    name: "Cybersecurity",
    courses: /cyber[\s-]*security|information security|ethical hacking/i,
    jobs: /\b(?:cybersecurity|cyber security|security analyst|soc analyst|penetration test|information security|cloud security|application security|threat intelligence)\b/i,
  },
  {
    name: "Cloud & DevOps",
    courses: /devops|cloud[\s-]*(?:computing|engineering)|aws|azure/i,
    jobs: /\b(?:devops|cloud engineer|cloud architect|aws engineer|azure engineer|site reliability|sre engineer|platform engineer|kubernetes engineer)\b/i,
  },
] as const;

function programValue(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isInternship(job: Job): boolean {
  return (
    job.type === "Internship" ||
    /\b(?:intern|internship|trainee)\b/i.test(job.title)
  );
}

export async function GET() {
  const auth = await requireStudentApi();

  if ("response" in auth) {
    return auth.response;
  }

  try {
    const db = await getDatabase();

    const enrollments = await db
      .collection<Document>("class_enrollments")
      .find({
        studentId: {
          $in: studentReferenceValues(auth.user),
        },
        status: {
          $nin: ["removed", "cancelled", "inactive"],
        },
      })
      .toArray();

    const ids = [...new Set(
      enrollments
        .map((item) => objectIdString(item.classId))
        .filter((id) => ObjectId.isValid(id))
    )];

    const classes = ids.length
      ? await db
          .collection<Document>("classes")
          .find({
            _id: { $in: ids.map((id) => new ObjectId(id)) },
          })
          .toArray()
      : [];

    // Inspect all course-related fields from actual enrolled classes.
    // Do not infer a course from the student's name or unrelated data.
    const courseNames = [...new Set(
      classes
        .map((item) =>
          [
            programValue(item.program),
            programValue(item.courseName),
            programValue(item.name),
          ]
            .filter(Boolean)
            .join(" ")
            .trim()
        )
        .filter(Boolean)
    )];

    // Only explicitly recognized course specializations are eligible.
    // Unknown or general courses receive no job recommendations.
    const rules = COURSE_RULES.filter((rule) =>
      courseNames.some((course) => rule.courses.test(course))
    );
    if (!courseNames.length || !rules.length) {
      return NextResponse.json(
        {
          courses: courseNames,
          matchingCourses: [],
          jobs: [],
          internships: [],
          total: 0,
          message: !courseNames.length
            ? "No enrolled course is available for placement matching."
            : "Your enrolled course does not yet have a configured job-matching category.",
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const allJobs = await getStoredMumbaiJobs();

    const matched = allJobs.filter((job) =>
      rules.some((rule) => rule.jobs.test(job.title))
    );

    const seen = new Set<string>();

    const unique = matched.filter((job) => {
      const key = `${job.companyKey}|${job.officialUrl}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const serialize = (job: Job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      category: job.category,
      officialUrl: job.officialUrl,
      postedDate: job.postedDate || null,
    });

    return NextResponse.json(
      {
        courses: courseNames,
        matchingCourses: rules.map((rule) => rule.name),
        jobs: unique.filter((job) => !isInternship(job)).map(serialize),
        internships: unique.filter(isInternship).map(serialize),
        total: unique.length,
        message: "",
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Student placement matching error:", error);

    return NextResponse.json(
      { error: "Unable to load course-matched job listings." },
      { status: 500 }
    );
  }
}