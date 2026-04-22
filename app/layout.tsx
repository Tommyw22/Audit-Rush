import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AuditRush",
  description: "AI growth audits for local businesses",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
