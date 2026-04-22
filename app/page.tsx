"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  Search,
  Sparkles,
  Target,
  Wand2,
  Clock3
} from "lucide-react";
import { Audit, formatAuditForExport, makeDemoAudit } from "@/lib/demo";

const niches = [
  "Dentist",
  "Plumber",
  "Law Firm",
  "Gym",
  "Real Estate Agent",
  "Med Spa",
  "Roofing Company",
  "Restaurant",
  "Chiropractor",
  "Marketing Agency"
];

async function postJSON(url: string, data: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`);
  return json;
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Box({ children }: { children: React.ReactNode }) {
  return <div style={{ border: "1px solid #27272a", borderRadius: 24, padding: 16 }}>{children}</div>;
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { secondary?: boolean }) {
  const { secondary, style, ...rest } = props;
  return (
    <button
      {...rest}
      style={{
        borderRadius: 16,
        padding: "12px 16px",
        border: "1px solid #3f3f46",
        background: secondary ? "transparent" : "#fafafa",
        color: secondary ? "#fafafa" : "#09090b",
        cursor: "pointer",
        fontWeight: 700,
        ...style
      }}
    />
  );
}

export default function Page() {
  const [businessName, setBusinessName] = useState("");
  const [website, setWebsite] = useState("");
  const [niche, setNiche] = useState("Dentist");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [audit, setAudit] = useState<Audit | null>(null);
  const [error, setError] = useState("");
  const [paid, setPaid] = useState(false);
  const [mode, setMode] = useState<"live" | "demo">("demo");
  const [copied, setCopied] = useState("");
  const [loading, setLoading] = useState<"generate" | "checkout" | "send" | "export" | "">("");

  const preview = useMemo(() => audit || makeDemoAudit(businessName, niche, website, notes), [audit, businessName, niche, website, notes]);

  async function handleGenerate() {
    setError("");
    setPaid(false);
    if (!businessName.trim() || !website.trim()) {
      setError("Enter a business name and website first.");
      return;
    }
    if (mode === "demo") {
      setAudit(makeDemoAudit(businessName, niche, website, notes));
      return;
    }
    try {
      setLoading("generate");
      const data = await postJSON("/api/generate-audit", { businessName, website, niche, notes, email });
      setAudit(data.audit);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate audit.");
    } finally {
      setLoading("");
    }
  }

  async function handleCheckout() {
    setError("");
    if (mode === "demo") {
      setPaid(true);
      return;
    }
    try {
      setLoading("checkout");
      const data = await postJSON("/api/create-checkout-session", { businessName, website, niche, notes, email, audit: preview });
      if (data.url) window.location.href = data.url;
      else if (data.paid) setPaid(true);
      else throw new Error("Checkout session did not return a redirect URL.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout.");
    } finally {
      setLoading("");
    }
  }

  async function handleSend() {
    setError("");
    if (!paid) return setError("Unlock the report before sending it.");
    if (!email.trim()) return setError("Add an email address first.");
    if (mode === "demo") {
      alert(`Demo mode: this would send the audit to ${email}.`);
      return;
    }
    try {
      setLoading("send");
      await postJSON("/api/send-audit", { email, audit: preview });
      alert(`Audit sent to ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send audit.");
    } finally {
      setLoading("");
    }
  }

  async function handleExport() {
    setError("");
    if (!paid) return setError("Unlock the report before exporting it.");
    try {
      setLoading("export");
      const slug = (preview.businessName || "audit").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      downloadTextFile(`${slug || "audit"}-auditrush-report.txt`, formatAuditForExport(preview));
    } finally {
      setLoading("");
    }
  }

  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 12,
    borderRadius: 16,
    border: "1px solid #3f3f46",
    background: "#09090b",
    color: "#fafafa"
  };

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1.1fr 0.9fr" }}>
            <section style={{ display: "grid", gap: 24 }}>
              <div>
                <div style={{ display: "inline-block", padding: "6px 12px", border: "1px solid #27272a", borderRadius: 999 }}>AI audits that sell same day</div>
                <h1 style={{ fontSize: 54, lineHeight: 1.05, margin: "16px 0 12px" }}>Turn weak business websites into paid deliverables in minutes.</h1>
                <p style={{ color: "#a1a1aa", maxWidth: 760, fontSize: 18 }}>
                  Generate a conversion teardown, homepage rewrite, review replies, social content, and a follow-up email. Sell it upfront.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16, color: "#d4d4d8" }}>
                  <span><Clock3 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />same-day fulfillment</span>
                  <span><Wand2 size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />AI-generated assets</span>
                  <span><Target size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />built for cold outreach</span>
                </div>
              </div>

              <Box>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Generate a paid audit</h2>
                    <p style={{ margin: "8px 0 0", color: "#a1a1aa" }}>Use demo mode first, then switch to live mode after adding keys.</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button onClick={() => setMode("live")} secondary={mode !== "live"}>Live</Button>
                    <Button onClick={() => setMode("demo")} secondary={mode !== "demo"}>Demo</Button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div><label>Business name</label><input style={inputStyle} value={businessName} onChange={(e) => { setBusinessName(e.target.value); setAudit(null); }} placeholder="Peak Smile Dental" /></div>
                  <div><label>Website</label><input style={inputStyle} value={website} onChange={(e) => { setWebsite(e.target.value); setAudit(null); }} placeholder="https://example.com" /></div>
                  <div>
                    <label>Niche</label>
                    <select style={inputStyle} value={niche} onChange={(e) => { setNiche(e.target.value); setAudit(null); }}>
                      {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div><label>Delivery email</label><input style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@business.com" /></div>
                  <div style={{ gridColumn: "1 / -1" }}><label>Extra context</label><textarea style={{ ...inputStyle, minHeight: 120 }} value={notes} onChange={(e) => { setNotes(e.target.value); setAudit(null); }} placeholder="Family-owned, premium pricing, wants more bookings..." /></div>
                  {error ? <div style={{ gridColumn: "1 / -1", color: "#fecaca", background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 16, padding: 12 }}>{error}</div> : null}
                  <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <Button onClick={handleGenerate}><span style={{ marginRight: 8 }}>{loading === "generate" ? <Loader2 size={16} /> : <Sparkles size={16} />}</span>{loading === "generate" ? "Generating..." : "Generate audit"}</Button>
                    <Button secondary onClick={() => window.open(website || "https://google.com", "_blank")}><ExternalLink size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />Open website</Button>
                  </div>
                </div>
              </Box>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  [Search, "Analyze site", "Pull homepage copy, offer clarity, trust signals, and CTA quality."],
                  [Sparkles, "Generate assets", "Produce a deliverable the owner can use immediately after purchase."],
                  [CreditCard, "Get paid", "Preview enough to sell. Lock exports and delivery behind Stripe checkout."]
                ].map(([Icon, title, text]) => (
                  <Box key={String(title)}>
                    <div>{/* @ts-expect-error icon */}<Icon size={18} /></div>
                    <div style={{ fontWeight: 700, marginTop: 8 }}>{title}</div>
                    <div style={{ color: "#a1a1aa", marginTop: 8 }}>{text}</div>
                  </Box>
                ))}
              </div>
            </section>

            <section>
              <Box>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Audit preview</h2>
                    <p style={{ margin: "8px 0 0", color: "#a1a1aa" }}>{mode === "live" ? "Live API output or demo fallback" : "Demo output for fast testing"}</p>
                  </div>
                  <div style={{ border: "1px solid #27272a", borderRadius: 999, padding: "6px 12px" }}>{paid ? "$49 unlocked" : "$49 to unlock"}</div>
                </div>

                {!businessName && !website ? (
                  <div style={{ border: "1px dashed #3f3f46", borderRadius: 24, padding: 32, textAlign: "center", color: "#a1a1aa", marginTop: 20 }}>
                    <Briefcase style={{ marginBottom: 12 }} />
                    Generate an audit to create a paid deliverable.
                  </div>
                ) : (
                  <div style={{ marginTop: 20, display: "grid", gap: 16 }}>
                    <Box>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#a1a1aa" }}>Conversion score</span>
                        <strong>{preview.score}/100</strong>
                      </div>
                      <p style={{ color: "#d4d4d8" }}>{preview.headline}</p>
                    </Box>
                    <Box>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Top issues</div>
                      <ul style={{ paddingLeft: 18, color: "#d4d4d8" }}>
                        {preview.issues.map((issue) => <li key={issue} style={{ marginBottom: 8 }}><CheckCircle2 size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />{issue}</li>)}
                      </ul>
                    </Box>
                    <Box>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontWeight: 700 }}>Rewritten homepage hero</div>
                        <Button secondary onClick={() => copyText("hero", preview.rewrittenHero)}><Copy size={16} style={{ marginRight: 8 }} />{copied === "hero" ? "Copied" : "Copy"}</Button>
                      </div>
                      <p style={{ fontSize: 22, fontWeight: 700 }}>{preview.rewrittenHero}</p>
                      <div style={{ display: "inline-block", border: "1px solid #3f3f46", borderRadius: 999, padding: "6px 12px" }}>CTA: {preview.cta}</div>
                    </Box>
                    <Box>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Review replies</div>
                      {preview.reviewReplies.slice(0, 3).map((reply, i) => <div key={i} style={{ background: "#09090b", borderRadius: 16, padding: 12, marginBottom: 8 }}>{reply}</div>)}
                    </Box>
                    <Box>
                      <div style={{ fontWeight: 700, marginBottom: 8 }}>Follow-up email</div>
                      <pre style={{ whiteSpace: "pre-wrap", color: "#d4d4d8" }}>{preview.salesEmail}</pre>
                    </Box>
                  </div>
                )}

                <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
                  <Box>
                    <div style={{ fontWeight: 700 }}>Offer stack</div>
                    <div style={{ color: "#a1a1aa", marginTop: 8 }}>$49 instant audit pack. Upsell $149 to $299/month for weekly content, review replies, landing page rewrites, and promo emails.</div>
                  </Box>
                  <Button onClick={handleCheckout}><CreditCard size={16} style={{ marginRight: 8 }} />{loading === "checkout" ? "Processing..." : paid ? "Unlocked" : "Unlock full pack — $49"}</Button>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <Button secondary onClick={handleExport}><Download size={16} style={{ marginRight: 8 }} />{loading === "export" ? "Exporting..." : "Export report"}</Button>
                    <Button secondary onClick={handleSend}><Mail size={16} style={{ marginRight: 8 }} />{loading === "send" ? "Sending..." : "Send report"}</Button>
                  </div>
                </div>
              </Box>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
