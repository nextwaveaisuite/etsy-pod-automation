import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navigation from "./shared/Navigation";

export const metadata: Metadata = {
  title: "Etsy Automate — POD Simplified",
  description: "Professional Print-on-Demand automation for Etsy sellers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="container topbar-inner">
              <Link href="/" className="brand">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="brand-logo" />
                <div>
                  <div className="brand-title">ETSY AUTOMATE</div>
                  <div className="brand-subtitle">Print-on-Demand Simplified</div>
                </div>
              </Link>
              <nav className="navbar">
                <Navigation />
              </nav>
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
