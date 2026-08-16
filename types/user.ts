export const USER_ROLES = [
  "student",
  "faculty",
  "client",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const PUBLIC_SIGNUP_ROLES = [
  "student",
  "faculty",
  "client",
] as const;

export type PublicSignupRole = (typeof PUBLIC_SIGNUP_ROLES)[number];

export const USER_STATUSES = [
  "active",
  "pending",
  "blocked",
] as const;

export type UserStatus = (typeof USER_STATUSES)[number];

export interface UserDocument {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  );
}

export function isPublicSignupRole(
  value: unknown,
): value is PublicSignupRole {
  return (
    typeof value === "string" &&
    (PUBLIC_SIGNUP_ROLES as readonly string[]).includes(value)
  );
}