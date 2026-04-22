import { NextRequest, NextResponse } from "next/server";
import { makeDemoAudit } from "@/lib/demo";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { businessName = "", website = "", niche = "Dentist", notes = "" } = body ?? {};

  if (!businessName || !website) {
    return NextResponse.json({ error: "Missing businessName or website." }, { status: 400 });
  }

  // Replace this with real scraping + OpenAI generation.
  const audit = makeDemoAudit(businessName, niche, website, notes);
  return NextResponse.json({ audit });
}
