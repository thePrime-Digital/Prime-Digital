import {
  ObjectId,
} from "mongodb";

import {
  NextResponse,
} from "next/server";

import {
  requireAdminApi,
} from "@/lib/auth/api-authorization";

import {
  getUsersCollection,
} from "@/lib/data/users";

import {
  getAdminResourceConfig,
} from "@/lib/admin/admin-resource-registry";

import {
  getDatabase,
} from "@/lib/mongodb";

import {
  calculateFeeStatus,
  cleanFeeText,
  createFeeInvoiceId,
  getFeesCollection,
  positiveFeeAmount,
  serializeFee,
  type FeeDocument,
} from "@/lib/data/fees";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

type CreateFeeBody = {
  studentId?: unknown;

  parentName?: unknown;
  classBoard?: unknown;
  enrollmentNo?: unknown;
  academicYear?: unknown;

  particulars?: unknown;
  month?: unknown;

  dueDate?: unknown;
  amount?: unknown;
};


function parseDateInput(
  value: unknown,
): Date | null {
  if (
    typeof value !==
      "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(
      value.trim(),
    )
  ) {
    return null;
  }

  const date =
    new Date(
      `${value.trim()}T12:00:00`,
    );

  return Number.isNaN(
    date.getTime(),
  )
    ? null
    : date;
}


/*
 * Permanent student enrollment number.
 *
 * Example:
 * PDS2026A1B2C3D4
 */
function createEnrollmentNo(
  studentId: ObjectId,
  createdAt: Date,
): string {
  return `PDS${createdAt.getFullYear()}${studentId
    .toHexString()
    .slice(-8)
    .toUpperCase()}`;
}


function getClassBoard(
  student: {
    currentClass?: string;
    degreeName?: string;
    program?: string;
  },
): string {
  return [
    student.currentClass,
    student.degreeName,
    student.program,
  ]
    .filter(
      (
        value,
      ): value is string =>
        typeof value ===
          "string" &&
        value.trim().length >
          0,
    )
    .join(
      " | ",
    );
}


/*
 * Existing public admission records already contain parentName.
 *
 * So for old student accounts where parentName was never copied
 * into the users collection, try to recover it using the
 * same email or phone.
 */
async function findAdmissionParentName(
  email: string,
  phone: string,
): Promise<string> {
  try {
    const config =
      getAdminResourceConfig(
        "admissions",
      );

    if (!config) {
      return "";
    }

    const conditions:
      Record<
        string,
        unknown
      >[] = [];

    if (
      email.trim()
    ) {
      conditions.push({
        email:
          email
            .trim()
            .toLowerCase(),
      });
    }

    if (
      phone.trim()
    ) {
      conditions.push({
        phone:
          phone.trim(),
      });
    }

    if (
      conditions.length ===
      0
    ) {
      return "";
    }

    const database =
      await getDatabase();

    const admission =
      await database
        .collection(
          config.collection,
        )
        .findOne(
          {
            $or:
              conditions,
          },
          {
            sort: {
              createdAt:
                -1,
            },

            projection: {
              parentName:
                1,
            },
          },
        );

    return cleanFeeText(
      admission?.parentName,
      120,
    );
  } catch (
    error
  ) {
    console.warn(
      "Parent name admission lookup failed:",
      error,
    );

    return "";
  }
}


/* =========================================================
   GET
   Admin Fees + Student Dropdown Data
========================================================= */

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
    const feesCollection =
      await getFeesCollection();

    const usersCollection =
      await getUsersCollection();

    const [
      fees,
      students,
    ] =
      await Promise.all([
        feesCollection
          .find({})
          .sort({
            createdAt:
              -1,
          })
          .limit(1000)
          .toArray(),

        usersCollection
          .find({
            role:
              "student",

            status:
              "active",
          })
          .sort({
            name:
              1,
          })
          .limit(1000)
          .toArray(),
      ]);


    /*
     * Build student dropdown information.
     */
    const studentOptions =
      await Promise.all(
        students.map(
          async (
            student,
          ) => {

            /*
             * Parent Name
             */
            let parentName =
              cleanFeeText(
                student.parentName,
                120,
              );

            if (
              !parentName
            ) {
              parentName =
                await findAdmissionParentName(
                  student.email,
                  student.phone ||
                    "",
                );
            }


            /*
             * Enrollment Number
             *
             * Reuse old enrollmentId if an older version
             * of the project already created one.
             */
            const legacy =
              student as typeof student & {
                enrollmentId?: string;
              };

            const legacyEnrollment =
              cleanFeeText(
                legacy.enrollmentId,
                80,
              );

            const enrollmentNo =
              cleanFeeText(
                student.enrollmentNo,
                80,
              ) ||
              legacyEnrollment ||
              createEnrollmentNo(
                student._id,
                student.createdAt,
              );


            /*
             * Permanently store recovered/generated data.
             */
            const update:
              Partial<{
                parentName:
                  string;

                enrollmentNo:
                  string;

                updatedAt:
                  Date;
              }> = {};


            if (
              parentName &&
              parentName !==
                student.parentName
            ) {
              update.parentName =
                parentName;
            }


            if (
              enrollmentNo !==
              student.enrollmentNo
            ) {
              update.enrollmentNo =
                enrollmentNo;
            }


            if (
              Object.keys(
                update,
              ).length >
              0
            ) {
              update.updatedAt =
                new Date();

              await usersCollection.updateOne(
                {
                  _id:
                    student._id,
                },
                {
                  $set:
                    update,
                },
              );
            }


            return {
              id:
                student._id.toHexString(),

              name:
                student.name,

              email:
                student.email,

              phone:
                student.phone ||
                "",

              parentName,

              enrollmentNo,

              classBoard:
                getClassBoard(
                  student,
                ),
            };
          },
        ),
      );


    return NextResponse.json(
      {
        fees:
          fees.map(
            serializeFee,
          ),

        students:
          studentOptions,
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
      "Admin fees GET error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load fee records.",
      },
      {
        status:
          500,
      },
    );
  }
}


/* =========================================================
   POST
   Create Fee Invoice
========================================================= */

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
    CreateFeeBody;

  try {
    body =
      (await request.json()) as
        CreateFeeBody;
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


  const studentId =
    cleanFeeText(
      body.studentId,
      80,
    );


  if (
    !ObjectId.isValid(
      studentId,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Please select a valid student.",
      },
      {
        status:
          400,
      },
    );
  }


  const amount =
    positiveFeeAmount(
      body.amount,
    );


  if (!amount) {
    return NextResponse.json(
      {
        error:
          "Please enter a valid fee amount.",
      },
      {
        status:
          400,
      },
    );
  }


  const dueDate =
    parseDateInput(
      body.dueDate,
    );


  if (!dueDate) {
    return NextResponse.json(
      {
        error:
          "Please select a valid due date.",
      },
      {
        status:
          400,
      },
    );
  }


  const particulars =
    cleanFeeText(
      body.particulars,
      300,
    );


  const month =
    cleanFeeText(
      body.month,
      80,
    );


  const academicYear =
    cleanFeeText(
      body.academicYear,
      40,
    );


  if (
    !particulars ||
    !month ||
    !academicYear
  ) {
    return NextResponse.json(
      {
        error:
          "Particulars, month and academic year are required.",
      },
      {
        status:
          400,
      },
    );
  }


  try {
    const usersCollection =
      await getUsersCollection();


    const student =
      await usersCollection.findOne({
        _id:
          new ObjectId(
            studentId,
          ),

        role:
          "student",
      });


    if (!student) {
      return NextResponse.json(
        {
          error:
            "Student account was not found.",
        },
        {
          status:
            404,
        },
      );
    }


    /*
     * Parent name.
     *
     * Priority:
     * 1. Fee form
     * 2. Student profile
     * 3. Admission application
     */
    let parentName =
      cleanFeeText(
        body.parentName,
        120,
      ) ||
      cleanFeeText(
        student.parentName,
        120,
      );


    if (
      !parentName
    ) {
      parentName =
        await findAdmissionParentName(
          student.email,
          student.phone ||
            "",
        );
    }


    /*
     * If old test account has no parent name anywhere,
     * Admin enters it once.
     */
    if (
      !parentName
    ) {
      return NextResponse.json(
        {
          error:
            "Parent name is not available for this student. Enter Parent Name once and it will be saved automatically.",
        },
        {
          status:
            400,
        },
      );
    }


    /*
     * Enrollment number.
     */
    const legacy =
      student as typeof student & {
        enrollmentId?: string;
      };


    const enrollmentNo =
      cleanFeeText(
        body.enrollmentNo,
        80,
      ) ||
      cleanFeeText(
        student.enrollmentNo,
        80,
      ) ||
      cleanFeeText(
        legacy.enrollmentId,
        80,
      ) ||
      createEnrollmentNo(
        student._id,
        student.createdAt,
      );


    /*
     * Class / Board / Program always comes from
     * the student account.
     */
    const classBoard =
      getClassBoard(
        student,
      );


    /*
     * Save these permanent values to the
     * actual student account.
     */
    await usersCollection.updateOne(
      {
        _id:
          student._id,
      },
      {
        $set: {
          parentName,

          enrollmentNo,

          updatedAt:
            new Date(),
        },
      },
    );


    const now =
      new Date();


    const fee:
      FeeDocument = {
      studentId:
        student._id,

      studentName:
        student.name,

      studentEmail:
        student.email,

      studentPhone:
        student.phone ||
        "",

      parentName,

      classBoard:
        classBoard,

      enrollmentNo,

      academicYear,

      invoiceId:
        createFeeInvoiceId(),

      receiptNo:
        "",

      receiptIssuedAt:
        null,

      particulars,

      month,

      dueDate,

      amount,

      paid:
        0,

      balance:
        amount,

      status:
        calculateFeeStatus(
          amount,
          0,
          dueDate,
        ),

      payments:
        [],

      createdBy:
        authorization.user._id,

      createdAt:
        now,

      updatedAt:
        now,
    };


    const collection =
      await getFeesCollection();


    const result =
      await collection.insertOne(
        fee,
      );


    const created =
      await collection.findOne({
        _id:
          result.insertedId,
      });


    if (!created) {
      throw new Error(
        "Created fee invoice could not be loaded.",
      );
    }


    return NextResponse.json(
      {
        message:
          "Fee invoice created successfully.",

        fee:
          serializeFee(
            created,
          ),
      },
      {
        status:
          201,
      },
    );
  } catch (error) {
    console.error(
      "Admin fees POST error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to create fee invoice.",
      },
      {
        status:
          500,
      },
    );
  }
}