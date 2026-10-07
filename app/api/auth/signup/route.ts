import {
  MongoServerError,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  signup as selfIamSignup,
  type ContactKitConfig,
} from "self-iam";

import {
  getDatabase,
} from "@/lib/mongodb";

import {
  getPasswordValidationError,
  hashPassword,
} from "@/lib/auth/password";

import {
  isValidEmail,
  isValidName,
  isValidPhone,
  normaliseEmail,
  normaliseName,
  normalisePhone,
} from "@/lib/auth/validation";

import {
  createUser,
  findUserByEmail,
  toSafeUser,
} from "@/lib/data/users";

import {
  isPublicSignupRole,
  type UserDocument,
  type UserStatus,
} from "@/types/user";

export const runtime =
  "nodejs";

const selfIamConfig:
  ContactKitConfig | null =
  process.env
    .NEXT_PUBLIC_SELFIAM_API_URL &&
  process.env
    .SELFIAM_PUBLISHABLE_KEY
    ? {
        apiUrl:
          process.env
            .NEXT_PUBLIC_SELFIAM_API_URL,

        publishableKey:
          process.env
            .SELFIAM_PUBLISHABLE_KEY,
      }
    : null;

interface SignupRequestBody {
  name?: unknown;

  email?: unknown;

  phone?: unknown;

  password?: unknown;

  role?: unknown;

  // Student
  studentLevel?: unknown;

  currentClass?: unknown;

  degreeName?: unknown;

  program?: unknown;

  parentPhone?: unknown;

  // Faculty
  subjectExpertise?: unknown;

  experience?: unknown;
}

/* =========================================
   STUDENT LEVELS / CLASSES
========================================= */

const FOUNDATION_CLASSES = [
  "6th Standard",
  "7th Standard",
  "8th Standard",
  "9th Standard",
  "10th Standard",
  "11th Standard",
  "12th Standard",
] as const;

const ADVANCED_CLASSES = [
  "11th Standard",
  "12th Standard",
] as const;

const COLLEGE_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

type SignupStudentLevel =
  | "foundation"
  | "profession"
  | "advanced"
  | "college";

/* =========================================
   HELPERS
========================================= */

function normaliseText(
  value: unknown,
): string {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

function isSignupStudentLevel(
  value: string,
): value is SignupStudentLevel {
  return (
    value ===
      "foundation" ||
    value ===
      "profession" ||
    value ===
      "advanced" ||
    value ===
      "college"
  );
}

function isValidStudentClass(
  studentLevel: string,
  currentClass: string,
): boolean {
  if (
    studentLevel ===
    "foundation"
  ) {
    return (
      FOUNDATION_CLASSES as readonly string[]
    ).includes(
      currentClass,
    );
  }

  /*
   * Professional students don't need
   * a school standard.
   */
  if (
    studentLevel ===
    "profession"
  ) {
    return (
      currentClass ===
      "working"
    );
  }

  /*
   * Kept for compatibility with
   * older signup/user records.
   */
  if (
    studentLevel ===
    "advanced"
  ) {
    return (
      ADVANCED_CLASSES as readonly string[]
    ).includes(
      currentClass,
    );
  }

  if (
    studentLevel ===
    "college"
  ) {
    return (
      COLLEGE_YEARS as readonly string[]
    ).includes(
      currentClass,
    );
  }

  return false;
}

/* =========================================
   POST
========================================= */

export async function POST(
  request: Request,
): Promise<NextResponse> {
  let body:
    SignupRequestBody;

  try {
    body =
      (await request.json()) as
        SignupRequestBody;
  } catch {
    return NextResponse.json(
      {
        error:
          "Invalid request body.",
      },
      {
        status:
          400,
      },
    );
  }

  /* =========================================
     BASIC USER FIELDS
  ========================================= */

  const name =
    normaliseName(
      body.name,
    );

  const email =
    normaliseEmail(
      body.email,
    );

  const phone =
    normalisePhone(
      body.phone,
    );

  const password =
    typeof body.password ===
    "string"
      ? body.password
      : "";

  const requestedRole =
    typeof body.role ===
    "string"
      ? body.role
          .trim()
          .toLowerCase()
      : "";

  /* =========================================
     STUDENT FIELDS
  ========================================= */

  const studentLevel =
    normaliseText(
      body.studentLevel,
    ).toLowerCase();

  const currentClass =
    normaliseText(
      body.currentClass,
    );

  const degreeName =
    normaliseText(
      body.degreeName,
    );

  /*
   * IMPORTANT:
   *
   * program can now be one of the listed
   * programs OR a custom program entered
   * after choosing "Others".
   */
  const program =
    normaliseText(
      body.program,
    );

  const parentPhone =
    normalisePhone(
      body.parentPhone,
    );

  /* =========================================
     FACULTY FIELDS
  ========================================= */

  const subjectExpertise =
    normaliseText(
      body.subjectExpertise,
    );

  const experience =
    normaliseText(
      body.experience,
    );

  /* =========================================
     BASIC VALIDATION
  ========================================= */

  if (
    !isValidName(
      name,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid name between 2 and 100 characters.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !isValidEmail(
      email,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid email address.",
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !isValidPhone(
      phone,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid phone number.",
      },
      {
        status:
          400,
      },
    );
  }

  const passwordError =
    getPasswordValidationError(
      password,
    );

  if (
    passwordError
  ) {
    return NextResponse.json(
      {
        error:
          passwordError,
      },
      {
        status:
          400,
      },
    );
  }

  if (
    !isPublicSignupRole(
      requestedRole,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Invalid signup role. Public signup is available only for students and faculty.",
      },
      {
        status:
          400,
      },
    );
  }

  /* =========================================
     FACULTY SIGNUP AVAILABILITY
  ========================================= */

  if (
    requestedRole ===
    "faculty"
  ) {
    try {
      const database =
        await getDatabase();

      const platformSettings =
        await database
          .collection(
            "platform_settings",
          )
          .findOne({
            key:
              "main",
          });

      if (
        platformSettings
          ?.facultySignupOpen ===
        false
      ) {
        return NextResponse.json(
          {
            error:
              "Faculty registration is currently closed.",
          },
          {
            status:
              403,
          },
        );
      }
    } catch (
      error
    ) {
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
          status:
            500,
        },
      );
    }
  }

  /* =========================================
     STUDENT VALIDATION
  ========================================= */

  if (
    requestedRole ===
    "student"
  ) {
    if (
      !isSignupStudentLevel(
        studentLevel,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please select a valid student program level.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !isValidStudentClass(
        studentLevel,
        currentClass,
      )
    ) {
      return NextResponse.json(
        {
          error:
            studentLevel ===
            "foundation"
              ? "Please select a valid standard."
              : "Please select a valid student category.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * CUSTOM PROGRAM SUPPORT
     *
     * We no longer use:
     *
     * isStudentProgram(program)
     *
     * because that only allows programs
     * already present in the fixed list.
     *
     * Custom names are allowed between
     * 2 and 120 characters.
     */
    if (
      !program ||
      program.length <
        2 ||
      program.length >
        120 ||
      program
        .toLowerCase() ===
        "others"
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid program name.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * Legacy college compatibility.
     */
    if (
      studentLevel ===
        "college" &&
      !degreeName
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter your degree or course name.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * Parent number is required only
     * for Foundation students.
     */
    if (
      studentLevel ===
        "foundation" &&
      !isValidPhone(
        parentPhone,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid parent phone number.",
        },
        {
          status:
            400,
        },
      );
    }
  }

  /* =========================================
     FACULTY VALIDATION
  ========================================= */

  if (
    requestedRole ===
    "faculty"
  ) {
    if (
      !subjectExpertise
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter your subject expertise.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !experience
    ) {
      return NextResponse.json(
        {
          error:
            "Please select your teaching experience.",
        },
        {
          status:
            400,
        },
      );
    }
  }

  try {
    /* =========================================
       DUPLICATE USER
    ========================================= */

    const existingUser =
      await findUserByEmail(
        email,
      );

    if (
      existingUser
    ) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status:
            409,
        },
      );
    }

    /* =========================================
       SELF IAM
    ========================================= */

    if (
      selfIamConfig
    ) {
      try {
        await selfIamSignup(
          {
            username:
              email.split(
                "@",
              )[0],

            email,

            password,

            phoneNumber:
              phone ||
              undefined,
          },

          selfIamConfig,
        );
      } catch (
        error: unknown
      ) {
        const selfIamStatus =
          (
            error as {
              status?: number;
            }
          ).status;

        /*
         * Existing Self-IAM account is okay.
         * MongoDB account can still be created.
         */
        if (
          selfIamStatus !==
          409
        ) {
          console.error(
            "self-IAM signup error:",
            error,
          );

          return NextResponse.json(
            {
              error:
                "Unable to create your account right now.",
            },
            {
              status:
                500,
            },
          );
        }
      }
    }

    /* =========================================
       PASSWORD
    ========================================= */

    const passwordHash =
      await hashPassword(
        password,
      );

    /* =========================================
       STATUS
    ========================================= */

    const status:
      UserStatus =
      requestedRole ===
      "faculty"
        ? "pending"
        : "active";

    const now =
      new Date();

    /* =========================================
       USER DATA
    ========================================= */

    /*
     * program is intentionally stored as
     * the actual submitted program name.
     *
     * Example:
     *
     * User chooses:
     * Others
     *
     * Then types:
     * "Game Development with Unity"
     *
     * MongoDB stores:
     * program: "Game Development with Unity"
     *
     * NOT:
     * program: "Others"
     */

    const userData = {
      name,

      email,

      phone,

      passwordHash,

      role:
        requestedRole,

      status,

      ...(requestedRole ===
        "student" &&
      isSignupStudentLevel(
        studentLevel,
      )
        ? {
            studentLevel,

            currentClass,

            program,

            ...(studentLevel ===
            "college"
              ? {
                  degreeName,
                }
              : studentLevel ===
                  "foundation"
                ? {
                    parentPhone,
                  }
                : {}),
          }
        : {}),

      ...(requestedRole ===
      "faculty"
        ? {
            subjectExpertise,

            experience,
          }
        : {}),

      createdAt:
        now,

      updatedAt:
        now,
    } as unknown as UserDocument;

    /* =========================================
       CREATE USER
    ========================================= */

    const createdUser =
      await createUser(
        userData,
      );

    const requiresApproval =
      createdUser.status ===
      "pending";

    return NextResponse.json(
      {
        message:
          requiresApproval
            ? "Your faculty application has been submitted for approval."
            : "Your account has been created successfully. You can now log in.",

        user:
          toSafeUser(
            createdUser,
          ),

        requiresApproval,

        canLogin:
          createdUser.status ===
          "active",
      },
      {
        status:
          201,
      },
    );
  } catch (
    error: unknown
  ) {
    if (
      error instanceof
        MongoServerError &&
      error.code ===
        11000
    ) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        {
          status:
            409,
        },
      );
    }

    console.error(
      "Signup API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create your account right now.",
      },
      {
        status:
          500,
      },
    );
  }
}