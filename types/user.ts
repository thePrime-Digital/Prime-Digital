export const USER_ROLES = [
  "student",
  "faculty",
  "client",
  "admin",
] as const;

export type UserRole =
  (typeof USER_ROLES)[number];

/*
 * Client remains a valid internal/legacy role
 * for now, but Prime Digital School no longer
 * allows new client accounts through public signup.
 */
export const PUBLIC_SIGNUP_ROLES = [
  "student",
  "faculty",
] as const;

export type PublicSignupRole =
  (typeof PUBLIC_SIGNUP_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "pending",
  "blocked",
] as const;

export type UserStatus =
  (typeof USER_STATUSES)[number];

/* =========================================
   STUDENT PROGRAM LEVELS
========================================= */

export const STUDENT_LEVELS = [
  "foundation",
  "advanced",
  "college",
] as const;

export type StudentLevel =
  (typeof STUDENT_LEVELS)[number];

/* =========================================
   STUDENT CLASS / YEAR OPTIONS
========================================= */

export const FOUNDATION_CLASSES = [
  "8th Standard",
  "9th Standard",
  "10th Standard",
] as const;

export const ADVANCED_CLASSES = [
  "11th Standard",
  "12th Standard",
] as const;

export const COLLEGE_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
] as const;

/* =========================================
   PRIME DIGITAL SCHOOL PROGRAMS
========================================= */

export const STUDENT_PROGRAMS = [
  "Technology & Coding",
  "AI, Robotics & Future Tech",
  "Business & Digital Marketing",
  "Design & Creative Arts",
  "Entrepreneurship & Innovation",
  "Cybersecurity & Digital Safety",
] as const;

export type StudentProgram =
  (typeof STUDENT_PROGRAMS)[number];

/* =========================================
   USER DOCUMENT
========================================= */

export interface UserDocument {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;

  role: UserRole;
  status: UserStatus;

  /* Student-only fields */
  studentLevel?: StudentLevel;
  currentClass?: string;
  degreeName?: string;
  program?: StudentProgram;
  parentName?: string;
  parentPhone?: string;
  enrollmentNo?: string;

  /* Faculty-only fields */
  subjectExpertise?: string;
  experience?: string;

  /*
   * Legacy client field.
   * Client functionality is being moved
   * to Prime Digital Agency.
   */
  interest?: string;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================
   SAFE USER
========================================= */

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string;

  role: UserRole;
  status: UserStatus;

  /* Student dashboard-safe fields */
  studentLevel?: StudentLevel;
  currentClass?: string;
  degreeName?: string;
  program?: StudentProgram;

  createdAt: string;
  updatedAt: string;
}

/* =========================================
   HELPERS
========================================= */

export function isUserRole(
  value: unknown,
): value is UserRole {
  return (
    typeof value === "string" &&
    (
      USER_ROLES as readonly string[]
    ).includes(value)
  );
}

export function isPublicSignupRole(
  value: unknown,
): value is PublicSignupRole {
  return (
    typeof value === "string" &&
    (
      PUBLIC_SIGNUP_ROLES as readonly string[]
    ).includes(value)
  );
}

export function isStudentLevel(
  value: unknown,
): value is StudentLevel {
  return (
    typeof value === "string" &&
    (
      STUDENT_LEVELS as readonly string[]
    ).includes(value)
  );
}

export function isStudentProgram(
  value: unknown,
): value is StudentProgram {
  return (
    typeof value === "string" &&
    (
      STUDENT_PROGRAMS as readonly string[]
    ).includes(value)
  );
}