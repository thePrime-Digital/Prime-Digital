
import { NextResponse } from "next/server";

import {
  getDatabase,
} from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const database =
      await getDatabase();

    await database.command({
      ping: 1,
    });

    return NextResponse.json({
      ok: true,
      databaseConnected: true,
      databaseName:
        database.databaseName,
    });
  } catch (error: unknown) {
    console.error(
      "DATABASE HEALTH ERROR:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "";

    let reason =
      "UNKNOWN_DATABASE_ERROR";

    if (
      message.includes(
        "MONGODB_URI is missing",
      )
    ) {
      reason =
        "MONGODB_URI_MISSING";
    } else if (
      /authentication failed|bad auth|code 18/i.test(
        message,
      )
    ) {
      reason =
        "MONGODB_AUTH_FAILED";
    } else if (
      /querySrv|ENOTFOUND|DNS/i.test(
        message,
      )
    ) {
      reason =
        "MONGODB_DNS_ERROR";
    } else if (
      /Server selection|ECONNREFUSED|ETIMEDOUT/i.test(
        message,
      )
    ) {
      reason =
        "MONGODB_CONNECTION_FAILED";
    }

    return NextResponse.json(
      {
        ok: false,
        databaseConnected:
          false,
        reason,
      },
      {
        status: 500,
      },
    );
  }
}

