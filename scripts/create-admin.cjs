const fs = require("node:fs");
const path = require("node:path");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Environment file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function normaliseEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalisePhone(value) {
  return String(value || "")
    .trim()
    .replace(/[\s()-]/g, "");
}

async function main() {
  loadEnvFile(path.join(process.cwd(), ".env"));

  const mongoUri = process.env.MONGODB_URI;
  const databaseName =
    process.env.MONGODB_DB || "prime-digital-school";

  const name = String(process.env.ADMIN_NAME || "").trim();
  const email = normaliseEmail(process.env.ADMIN_EMAIL);
  const phone = normalisePhone(process.env.ADMIN_PHONE);
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing from .env.local");
  }

  if (name.length < 2) {
    throw new Error("Admin name must contain at least 2 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid admin email address.");
  }

  if (!/^\+?[0-9]{7,15}$/.test(phone)) {
    throw new Error("Enter a valid admin phone number.");
  }

  if (password.length < 8) {
    throw new Error("Admin password must contain at least 8 characters.");
  }

  if (Buffer.byteLength(password, "utf8") > 72) {
    throw new Error("Admin password is too long.");
  }

  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  try {
    await client.connect();

    const database = client.db(databaseName);
    const users = database.collection("users");

    await users.createIndex(
      { email: 1 },
      {
        unique: true,
        name: "unique_user_email",
      },
    );

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists. Use a different email.",
      );
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await users.insertOne({
      name,
      email,
      phone,
      passwordHash,
      role: "admin",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    console.log("");
    console.log("Admin account created successfully.");
    console.log(`Admin ID: ${result.insertedId.toHexString()}`);
    console.log(`Email: ${email}`);
    console.log("Role: admin");
    console.log("Status: active");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("");
  console.error("Admin creation failed:");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

