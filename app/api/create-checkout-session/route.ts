import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json(
      {
        error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and NEXT_PUBLIC_APP_URL to enable checkout."
      },
      { status: 500 }
    );
  }

  // Replace with Stripe Checkout session creation.
  return NextResponse.json({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/success?demo=1`
  });
}
