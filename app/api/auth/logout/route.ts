import { NextResponse } from "next/server";

import { clearSessionCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  await clearSessionCookie();

  return NextResponse.json(
    { message: "Logged out successfully." },
    { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
