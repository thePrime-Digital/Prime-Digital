import {
  ObjectId,
  type Collection,
  type WithId,
} from "mongodb";

import { getDatabase } from "@/lib/mongodb";
import type {
  SafeUser,
  UserDocument,
} from "@/types/user";

const USERS_COLLECTION_NAME = "users";

let userIndexesPromise: Promise<void> | null = null;

async function ensureUserIndexes(
  collection: Collection<UserDocument>,
): Promise<void> {
  if (!userIndexesPromise) {
    userIndexesPromise = collection
      .createIndex(
        { email: 1 },
        {
          unique: true,
          name: "unique_user_email",
        },
      )
      .then(() => undefined)
      .catch((error: unknown) => {
        userIndexesPromise = null;
        throw error;
      });
  }

  await userIndexesPromise;
}

export async function getUsersCollection(): Promise<
  Collection<UserDocument>
> {
  const database = await getDatabase();

  const collection = database.collection<UserDocument>(
    USERS_COLLECTION_NAME,
  );

  await ensureUserIndexes(collection);

  return collection;
}

export async function findUserByEmail(
  email: string,
): Promise<WithId<UserDocument> | null> {
  const collection = await getUsersCollection();

  return collection.findOne({
    email: email.trim().toLowerCase(),
  });
}

export async function findUserById(
  userId: string,
): Promise<WithId<UserDocument> | null> {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  const collection = await getUsersCollection();

  return collection.findOne({
    _id: new ObjectId(userId),
  });
}

export async function createUser(
  user: UserDocument,
): Promise<WithId<UserDocument>> {
  const collection = await getUsersCollection();

  const result = await collection.insertOne(user);

  return {
    _id: result.insertedId,
    ...user,
  };
}

export function toSafeUser(
  user: WithId<UserDocument>,
): SafeUser {
  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}