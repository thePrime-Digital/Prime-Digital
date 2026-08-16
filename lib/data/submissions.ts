import type {
  Collection,
  Document,
} from "mongodb";

import { getDatabase } from "@/lib/mongodb";

export const SUBMISSION_COLLECTIONS = {
  contact: "contact_submissions",
  admissions: "admission_applications",
  careers: "career_applications",
  services: "service_leads",
} as const;

const indexPromises = new Map<
  string,
  Promise<void>
>();

async function ensureIndexes(
  collection: Collection<Document>,
): Promise<void> {
  const collectionName =
    collection.collectionName;

  let indexPromise =
    indexPromises.get(collectionName);

  if (!indexPromise) {
    indexPromise = collection
      .createIndexes([
        {
          key: {
            createdAt: -1,
          },
          name: "created_at_desc",
        },
        {
          key: {
            status: 1,
            createdAt: -1,
          },
          name: "status_created_at",
        },
      ])
      .then(() => undefined)
      .catch((error: unknown) => {
        indexPromises.delete(collectionName);
        throw error;
      });

    indexPromises.set(
      collectionName,
      indexPromise,
    );
  }

  await indexPromise;
}

export async function insertSubmission(
  collectionName: string,
  submission: object,
): Promise<string> {
  const database = await getDatabase();

  const collection =
    database.collection<Document>(
      collectionName,
    );

  await ensureIndexes(collection);

  const result = await collection.insertOne(
    submission as Document,
  );

  return result.insertedId.toHexString();
}
