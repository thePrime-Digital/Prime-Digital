import {
  ObjectId,
  type WithId,
} from "mongodb";

import {
  getUsersCollection,
} from "@/lib/data/users";

import type {
  SafeUser,
  UserDocument,
  UserRole,
  UserStatus,
} from "@/types/user";

export type AdminSafeUser =
  SafeUser & {
    isCurrentAdmin?: boolean;
  };

export function adminSafeUser(
  user: WithId<UserDocument>,
  currentAdminId?: string,
): AdminSafeUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    isCurrentAdmin:
      currentAdminId === user._id.toHexString(),
  };
}

export function isAllowedAdminRole(
  value: unknown,
): value is UserRole {
  return (
    value === "student" ||
    value === "faculty" ||
    value === "client" ||
    value === "admin"
  );
}

export function isAllowedUserStatus(
  value: unknown,
): value is UserStatus {
  return (
    value === "active" ||
    value === "pending" ||
    value === "blocked"
  );
}

export function escapeRegex(
  value: string,
): string {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

export async function countActiveAdmins(): Promise<number> {
  const collection = await getUsersCollection();

  return collection.countDocuments({
    role: "admin",
    status: "active",
  });
}

export async function findAdminUserById(
  id: string,
): Promise<WithId<UserDocument> | null> {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const collection = await getUsersCollection();

  return collection.findOne({
    _id: new ObjectId(id),
  });
}
