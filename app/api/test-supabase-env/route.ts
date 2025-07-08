import { NextResponse } from "next/server";

export async function GET() {
  const roleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!roleKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY is missing" }, { status: 500 });
  }

  return NextResponse.json({ message: "SUPABASE_SERVICE_ROLE_KEY is set", preview: roleKey.slice(0, 8) + "..." });
}
