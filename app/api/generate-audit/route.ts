import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

type Audit = {
  score: number;
  businessName: string;
  niche: string;
  website: string;
  headline: string;
  issues: string[];
  rewrittenHero: string;
  cta: string;
  revenueLeakEstimate: string;
  reviewReplies: string[];
  socialPosts: string[];
  salesEmail: string;
  notes: string;
  createdAt: string;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWebsiteText(url: string) {
  const target = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const res = await fetch(target, {
    headers: {
      "User-Agent": "Mozilla/5.0 AuditRush/1.0",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Could not fetch website: ${res.status}`);
  }

  const html = await res.text();
  const text = stripHtml(html).slice(0, 12000);

  if (!text || text.length < 200) {
    throw new Error("Website text was too thin to analyze.");
  }

  return { target, text };
}

function parseJsonSafely(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  return JSON.parse(cleaned);
}

function validateAudit(data: any): Audit {
  return {
    score: Number(data?.score ?? 65),
    businessName: String(data?.businessName ?? "Unknown Business"),
    niche: String(data?.niche ?? "Business"),
    website: String(data?.website ?? ""),
    headline: String(data?.headline ?? ""),
    issues: Array.isArray(data?.issues) ? data.issues.slice(0, 5).map(String) : [],
    rewrittenHero: String(data?.rewrittenHero ?? ""),
    cta: String(data?.cta ?? "Get Started"),
    revenueLeakEstimate: String(data?.revenueLeakEstimate ?? ""),
    reviewReplies: Array.isArray(data?.reviewReplies)
      ? data.reviewReplies.slice(0, 5).map(String)
      : [],
    socialPosts: Array.isArray(data?.socialPosts)
      ? data.socialPosts.slice(0, 7).map(String)
      : [],
    salesEmail: String(data?.salesEmail ?? ""),
    notes: String(data?.notes ?? ""),
    createdAt: new Date().toISOString(),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const businessName = String(body?.businessName ?? "").trim();
    const website = String(body?.website ?? "").trim();
    const niche = String(body?.niche ?? "Business").trim();
    const notes = String(body?.notes ?? "").trim();

    if (!businessName || !website) {
      return NextResponse.json(
        { error: "Business name and website are required." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const model = process.env.OPENAI_MODEL || "gpt-4.1";

    let target = "";
    let text = "";

    try {
      const fetched = await fetchWebsiteText(website);
      target = fetched.target;
      text = fetched.text;
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "Website fetch failed.",
          details: error?.message || String(error),
        },
        { status: 500 }
      );
    }

    try {
      const prompt = `
You are an elite conversion strategist building a MONEY LEAK REPORT for a small business.

Business name: ${businessName}
Niche: ${niche}
Website: ${target}
Extra notes: ${notes || "None"}

Analyze the website text below and return ONLY valid JSON.

RETURN THIS EXACT JSON SHAPE:
{
  "score": number,
  "businessName": string,
  "niche": string,
  "website": string,
  "headline": string,
  "issues": string[],
  "rewrittenHero": string,
  "cta": string,
  "revenueLeakEstimate": string,
  "reviewReplies": string[],
  "socialPosts": string[],
  "salesEmail": string,
  "notes": string
}

RULES:
- score must be 1 to 100
- issues: 3 to 5 items
- reviewReplies: exactly 5
- socialPosts: exactly 7

WEBSITE TEXT:
${text}
      `.trim();

      const response = await client.responses.create({
        model,
        input: prompt,
      });

      const raw = response.output_text || "";
      const parsed = parseJsonSafely(raw);
      const audit = validateAudit(parsed);

      return NextResponse.json({ audit });
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "OpenAI generation failed.",
          details:
            error?.message ||
            error?.response?.data ||
            error?.cause ||
            String(error),
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
