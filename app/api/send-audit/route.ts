import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, audit } = body ?? {};

  if (!email || !audit) {
    return NextResponse.json({ error: "Missing email or audit." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email is not configured yet. Add RESEND_API_KEY to enable sending." }, { status: 500 });
  }

  // Replace with Resend send logic.
  return NextResponse.json({ ok: true });
}
