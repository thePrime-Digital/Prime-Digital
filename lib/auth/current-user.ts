import type { WithId } from "mongodb";
import { getSessionFromCookies } from "@/lib/auth/session";
import { findUserById } from "@/lib/data/users";
import type { UserDocument } from "@/types/user";

export async function getCurrentUser(): Promise<WithId<UserDocument> | null> {
  const session = await getSessionFromCookies();

  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);

  if (!user) {
    return null;
  }

  if (user.status !== "active") {
    return null;
  }

  return user;
}

export async function getCurrentAdmin(): Promise<WithId<UserDocument> | null> {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}
