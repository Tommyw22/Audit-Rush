export default function SuccessPage() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#09090b", color: "#fafafa", fontFamily: "Arial, Helvetica, sans-serif" }}>
      <div style={{ maxWidth: 560, width: "100%", border: "1px solid #27272a", borderRadius: 24, padding: 24 }}>
        <h1>Payment received</h1>
        <p style={{ color: "#a1a1aa" }}>
          Your unlock flow works. Next step is wiring Stripe so this page is only reachable after a real checkout session.
        </p>
        <a href="/" style={{ display: "inline-block", marginTop: 12, padding: "12px 16px", border: "1px solid #3f3f46", borderRadius: 16 }}>
          Back to app
        </a>
      </div>
    </main>
  );
}
