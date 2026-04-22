export type Audit = {
  score: number;
  businessName: string;
  niche: string;
  website: string;
  headline: string;
  issues: string[];
  rewrittenHero: string;
  cta: string;
  reviewReplies: string[];
  socialPosts: string[];
  salesEmail: string;
  notes: string;
  createdAt: string;
};

const demoIssues: Record<string, string[]> = {
  Dentist: [
    "Homepage headline does not mention location, urgency, or specific treatment intent.",
    "No trust stack above the fold such as reviews, insurance accepted, or financing info.",
    "Primary CTA is too weak. Use a booking action with clear intent instead of a generic contact option."
  ],
  Plumber: [
    "Emergency service and phone number are not dominant on mobile.",
    "No city-specific service pages or local proof to capture nearby search intent.",
    "Missing review snippets and guarantee language near the main CTA."
  ],
  Restaurant: [
    "Menu, reservations, and ordering actions are not obvious on first view.",
    "Weak visual proof and social proof reduce booking confidence.",
    "No email or SMS capture for repeat traffic, specials, or events."
  ]
};

const fallbackIssues = [
  "The offer is not instantly clear in the first screen view.",
  "The page lacks trust indicators where buyers decide.",
  "Calls to action are too soft and do not create urgency."
];

export function getDomainLabel(raw: string) {
  try {
    return new URL(raw).hostname.replace("www.", "");
  } catch {
    return raw || "your site";
  }
}

export function makeDemoAudit(name: string, niche: string, website: string, notes: string): Audit {
  const issues = demoIssues[niche] || fallbackIssues;
  return {
    score: 63,
    businessName: name || "This Business",
    niche,
    website,
    headline: `${name || "This business"} is likely losing leads because the offer, trust, and CTA are not doing enough work.`,
    issues,
    rewrittenHero: `Get ${niche.toLowerCase()} help fast from ${getDomainLabel(website)} — trusted, local, and easy to book today.`,
    cta: niche === "Dentist" ? "Book Your Visit" : niche === "Plumber" ? "Call Now" : "Get Started",
    reviewReplies: [
      "Thank you for the kind words. We appreciate your trust and are glad we could make the experience smooth and easy.",
      "We really appreciate your feedback. Our team works hard to deliver a great result, and this means a lot.",
      "Thanks for choosing us. We’re happy you had a positive experience and look forward to helping again.",
      "Your support means a lot to our team. Thank you for taking the time to share your experience.",
      "We appreciate the opportunity to serve you and are grateful for your recommendation."
    ],
    socialPosts: [
      `Most ${niche.toLowerCase()} websites don’t need a redesign. They need a clearer offer and a stronger CTA.`,
      "Proof sells. Put reviews, guarantees, and before-and-after outcomes next to your main conversion action.",
      "If a visitor can’t tell what to do in 5 seconds, conversions leak. Clarity beats clever every time.",
      "One sharp headline can lift conversions more than weeks of random posting.",
      "Local buyers trust specifics: location, speed, guarantees, and clear next steps.",
      "Your homepage is a sales rep. Make sure it actually asks for the sale.",
      "The fastest conversion win is usually not traffic. It is reducing confusion."
    ],
    salesEmail: `Subject: quick conversion wins for ${name || "your business"}\n\nI took a quick look at ${getDomainLabel(website)} and found a few conversion leaks that are probably costing you leads. I mocked up a sharper headline, stronger CTA, review replies, and ready-to-post content your team can use immediately. If you want the full pack, I can send it over today.`,
    notes: notes || "No additional notes.",
    createdAt: new Date().toISOString()
  };
}

export function formatAuditForExport(audit: Audit) {
  return [
    "AUDITRUSH REPORT",
    "",
    `Business: ${audit.businessName}`,
    `Niche: ${audit.niche}`,
    `Website: ${audit.website}`,
    `Score: ${audit.score}/100`,
    `Created: ${audit.createdAt}`,
    "",
    "HEADLINE",
    audit.headline,
    "",
    "TOP ISSUES",
    ...audit.issues.map((x, i) => `${i + 1}. ${x}`),
    "",
    "REWRITTEN HERO",
    audit.rewrittenHero,
    `CTA: ${audit.cta}`,
    "",
    "REVIEW REPLIES",
    ...audit.reviewReplies.map((x, i) => `${i + 1}. ${x}`),
    "",
    "SOCIAL POSTS",
    ...audit.socialPosts.map((x, i) => `${i + 1}. ${x}`),
    "",
    "FOLLOW-UP EMAIL",
    audit.salesEmail,
    "",
    "NOTES",
    audit.notes
  ].join("\n");
}
