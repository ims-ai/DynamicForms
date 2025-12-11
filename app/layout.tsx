import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "DynamicForms | Insurance Lead Capture",
  description: "Schema-driven insurance form platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="layout-shell">
        <main className="main-panel">{children}</main>
      </body>
    </html>
  );
}
