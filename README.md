# AuditRush Next Starter

Vercel-ready Next.js starter for selling AI website audits.

## What is included

- Landing page + audit preview UI
- Demo/live mode switch
- API route stubs for generation, checkout, and email sending
- Success page
- Environment variable template

## Quick start

1. Upload this folder to a GitHub repo.
2. Import the repo into Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.

## Local dev

```bash
npm install
npm run dev
```

## What still needs real wiring

### `/api/generate-audit`
Replace demo output with:
- homepage scraping
- prompt to OpenAI
- strict JSON response

### `/api/create-checkout-session`
Replace demo redirect with:
- Stripe Checkout session creation
- success and cancel URLs
- optional metadata for lead tracking

### `/api/send-audit`
Replace placeholder with:
- Resend email send
- report attachment or hosted report link

## Recommended next moves

1. Deploy this as-is on Vercel in demo mode.
2. Send outreach with screenshots from demo audits.
3. Wire OpenAI generation.
4. Wire Stripe.
5. Wire email delivery.
