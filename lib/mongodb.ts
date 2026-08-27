import { Db, MongoClient } from "mongodb";

const DEFAULT_DATABASE_NAME = "prime-digital-school";

type MongoGlobal = typeof globalThis & {
  __primeDigitalMongoClientPromise?: Promise<MongoClient>;
};

const globalForMongo = globalThis as MongoGlobal;

let productionClientPromise: Promise<MongoClient> | undefined;

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing from your environment variables.",
    );
  }

  return uri;
}

function createMongoClientPromise(): Promise<MongoClient> {
  const client = new MongoClient(getMongoUri(), {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,

    // Force IPv4 to avoid DNS/IPv6 compatibility problems.
    family: 4,
  });

  return client.connect();
}

export function getMongoClient(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!globalForMongo.__primeDigitalMongoClientPromise) {
      globalForMongo.__primeDigitalMongoClientPromise =
        createMongoClientPromise().catch((error: unknown) => {
          // Do not permanently cache a failed connection.
          globalForMongo.__primeDigitalMongoClientPromise = undefined;
          throw error;
        });
    }

    return globalForMongo.__primeDigitalMongoClientPromise;
  }

  if (!productionClientPromise) {
    productionClientPromise = createMongoClientPromise().catch(
      (error: unknown) => {
        // Allow a later request to reconnect after a temporary network failure.
        productionClientPromise = undefined;
        throw error;
      },
    );
  }

  return productionClientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();

  const databaseName =
    process.env.MONGODB_DB?.trim() || DEFAULT_DATABASE_NAME;

  return client.db(databaseName);
}