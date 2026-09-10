import { MongoServerError } from "mongodb";
import { NextResponse } from "next/server";
import { signup as selfIamSignup, type ContactKitConfig } from "self-iam";
import {
  getDatabase,
} from "@/lib/mongodb";

import { getPasswordValidationError, hashPassword } from "@/lib/auth/password";

import {
  isValidEmail,
  isValidName,
  isValidPhone,
  normaliseEmail,
  normaliseName,
  normalisePhone,
} from "@/lib/auth/validation";

import { createUser, findUserByEmail, toSafeUser } from "@/lib/data/users";

import {
  ADVANCED_CLASSES,
  COLLEGE_YEARS,
  FOUNDATION_CLASSES,
  isPublicSignupRole,
  isStudentLevel,
  isStudentProgram,
  type UserDocument,
  type UserStatus,
} from "@/types/user";

export const runtime = "nodejs";

const selfIamConfig: ContactKitConfig | null =
  process.env.NEXT_PUBLIC_SELFIAM_API_URL && process.env.SELFIAM_PUBLISHABLE_KEY
    ? {
        apiUrl: process.env.NEXT_PUBLIC_SELFIAM_API_URL,
        publishableKey: process.env.SELFIAM_PUBLISHABLE_KEY,
      }
    : null;

interface SignupRequestBody {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  password?: unknown;
  role?: unknown;

  // Student fields
  studentLevel?: unknown;
  currentClass?: unknown;
  degreeName?: unknown;
  program?: unknown;
  parentPhone?: unknown;

  // Faculty fields
  subjectExpertise?: unknown;
  experience?: unknown;
}

function normaliseText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidStudentClass(
  studentLevel: string,
  currentClass: string,
): boolean {
  if (studentLevel === "foundation") {
    return (FOUNDATION_CLASSES as readonly string[]).includes(currentClass);
  }

  if (studentLevel === "advanced") {
    return (ADVANCED_CLASSES as readonly string[]).includes(currentClass);
  }

  if (studentLevel === "college") {
    return (COLLEGE_YEARS as readonly string[]).includes(currentClass);
  }

  return false;
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: SignupRequestBody;

  try {
    body = (await request.json()) as SignupRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  /* =========================================
     BASIC USER FIELDS
  ========================================= */

  const name = normaliseName(body.name);

  const email = normaliseEmail(body.email);

  const phone = normalisePhone(body.phone);

  const password = typeof body.password === "string" ? body.password : "";

  const requestedRole =
    typeof body.role === "string" ? body.role.trim().toLowerCase() : "";

  /* =========================================
     STUDENT FIELDS
  ========================================= */

  const studentLevel = normaliseText(body.studentLevel).toLowerCase();

  const currentClass = normaliseText(body.currentClass);

  const degreeName = normaliseText(body.degreeName);

  const program = normaliseText(body.program);

  const parentPhone = normalisePhone(body.parentPhone);

  /* =========================================
     FACULTY FIELDS
  ========================================= */

  const subjectExpertise = normaliseText(body.subjectExpertise);

  const experience = normaliseText(body.experience);

  /* =========================================
     BASIC VALIDATION
  ========================================= */

  if (!isValidName(name)) {
    return NextResponse.json(
      {
        error: "Please enter a valid name between 2 and 100 characters.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        error: "Please enter a valid email address.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      {
        error: "Please enter a valid phone number.",
      },
      {
        status: 400,
      },
    );
  }

  const passwordError = getPasswordValidationError(password);

  if (passwordError) {
    return NextResponse.json(
      {
        error: passwordError,
      },
      {
        status: 400,
      },
    );
  }

  if (!isPublicSignupRole(requestedRole)) {
    return NextResponse.json(
      {
        error:
          "Invalid signup role. Public signup is available only for students and faculty.",
      },
      {
        status: 400,
      },
    );
  }
  /*
 * Respect the Admin platform setting
 * for public faculty registration.
 */
if (requestedRole === "faculty") {
  try {
    const database =
      await getDatabase();

    const platformSettings =
      await database
        .collection(
          "platform_settings",
        )
        .findOne({
          key: "main",
        });

    if (
      platformSettings?.facultySignupOpen ===
      false
    ) {
      return NextResponse.json(
        {
          error:
            "Faculty registration is currently closed.",
        },
        {
          status: 403,
        },
      );
    }
  } catch (error) {
    console.error(
      "Faculty signup settings check error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to verify faculty registration availability.",
      },
      {
        status: 500,
      },
    );
  }
}

  /* =========================================
     STUDENT VALIDATION
  ========================================= */

  if (requestedRole === "student") {
    if (!isStudentLevel(studentLevel)) {
      return NextResponse.json(
        {
          error: "Please select a valid student program level.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isValidStudentClass(studentLevel, currentClass)) {
      return NextResponse.json(
        {
          error: "Please select a valid standard or college year.",
        },
        {
          status: 400,
        },
      );
    }

    if (!isStudentProgram(program)) {
      return NextResponse.json(
        {
          error: "Please select a valid program.",
        },
        {
          status: 400,
        },
      );
    }

    if (studentLevel === "college" && !degreeName) {
      return NextResponse.json(
        {
          error: "Please enter your degree or course name.",
        },
        {
          status: 400,
        },
      );
    }

    if (studentLevel !== "college" && !isValidPhone(parentPhone)) {
      return NextResponse.json(
        {
          error: "Please enter a valid parent phone number.",
        },
        {
          status: 400,
        },
      );
    }
  }

  /* =========================================
     FACULTY VALIDATION
  ========================================= */

  if (requestedRole === "faculty") {
    if (!subjectExpertise) {
      return NextResponse.json(
        {
          error: "Please enter your subject expertise.",
        },
        {
          status: 400,
        },
      );
    }

    if (!experience) {
      return NextResponse.json(
        {
          error: "Please select your teaching experience.",
        },
        {
          status: 400,
        },
      );
    }
  }

  try {
    /* =========================================
       DUPLICATE USER CHECK
    ========================================= */

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    /* =========================================
       SELF-IAM ACCOUNT
    ========================================= */

    if (selfIamConfig) {
      try {
        await selfIamSignup(
          {
            username: email.split("@")[0],
            email,
            password,
            phoneNumber: phone || undefined,
          },
          selfIamConfig,
        );
      } catch (error: unknown) {
        const status = (
          error as {
            status?: number;
          }
        ).status;

        /*
         * 409 means the Self-IAM account
         * already exists. We can continue
         * creating our local MongoDB record.
         */
        if (status !== 409) {
          console.error("self-IAM signup error:", error);

          return NextResponse.json(
            {
              error: "Unable to create your account right now.",
            },
            {
              status: 500,
            },
          );
        }
      }
    }

    /* =========================================
       PASSWORD
    ========================================= */

    const passwordHash = await hashPassword(password);

    /* =========================================
       ACCOUNT STATUS
    ========================================= */

    const status: UserStatus =
      requestedRole === "faculty" ? "pending" : "active";

    const now = new Date();

    /* =========================================
       USER DOCUMENT
    ========================================= */

    const userData: UserDocument = {
      name,
      email,
      phone,
      passwordHash,

      role: requestedRole,
      status,

      /*
       * Student information is stored only
       * when this account is a student.
       */

      ...(requestedRole === "student" &&
      isStudentLevel(studentLevel) &&
      isStudentProgram(program)
        ? {
            studentLevel,

            currentClass,

            program,

            ...(studentLevel === "college"
              ? {
                  degreeName,
                }
              : {
                  parentPhone,
                }),
          }
        : {}),

      /*
       * Faculty information
       */

      ...(requestedRole === "faculty"
        ? {
            subjectExpertise,
            experience,
          }
        : {}),

      createdAt: now,
      updatedAt: now,
    };

    /* =========================================
       CREATE USER
    ========================================= */

    const createdUser = await createUser(userData);

    const requiresApproval = createdUser.status === "pending";

    return NextResponse.json(
      {
        message: requiresApproval
          ? "Your faculty application has been submitted for approval."
          : "Your account has been created successfully. You can now log in.",

        user: toSafeUser(createdUser),

        requiresApproval,

        canLogin: createdUser.status === "active",
      },
      {
        status: 201,
      },
    );
  } catch (error: unknown) {
    /*
     * Mongo duplicate-key error.
     */

    if (error instanceof MongoServerError && error.code === 11000) {
      return NextResponse.json(
        {
          error: "An account with this email already exists.",
        },
        {
          status: 409,
        },
      );
    }

    console.error("Signup API error:", error);

    return NextResponse.json(
      {
        error: "Unable to create your account right now.",
      },
      {
        status: 500,
      },
    );
  }
}
