import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "Etsy Automate - POD Simplified",
  description: "Professional Print-on-Demand automation platform for Etsy sellers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {/* Top Bar */}
          <header className="topbar">
            <div className="container topbar-inner">
              <Link href="/" className="brand">
                <Image src="/logo.png" alt="Etsy Automate Logo" width={40} height={40} className="brand-logo" />
                <div>
                  <h1 className="brand-title">ETSY AUTOMATE</h1>
                  <p className="brand-subtitle">Print-on-Demand Simplified</p>
                </div>
              </Link>
              <Navigation />
            </div>
          </header>

          <main className="main">
            <div className="container">{children}</div>
          </main>

          <footer className="footer">
            <div className="container footer-inner">
              <p className="footer-title">© 2025 Etsy Automate. All rights reserved.</p>
              <p className="footer-subtitle">Professional POD automation for Etsy sellers</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
