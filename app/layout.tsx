import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "./components/Navigation";

export const metadata: Metadata = {
  title: "Etsy Automate - POD Simplified",
  description: "Professional Print-on-Demand automation platform for Etsy sellers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          {/* Header */}
          <header className="header">
            <div className="container header-inner">
              {/* Logo / Brand */}
              <Link href="/" className="brand">
                <Image
                  src="/logo.png"
                  alt="Etsy Automate Logo"
                  width={48}
                  height={48}
                  className="brand-logo"
                />
                <div>
                  <h1 className="brand-title">ETSY AUTOMATE</h1>
                  <p className="brand-subtitle">Print-on-Demand Simplified</p>
                </div>
              </Link>

              {/* Navigation */}
              <Navigation />
            </div>
          </header>

          {/* Main */}
          <main className="main">
            <div className="container">{children}</div>
          </main>

          {/* Footer */}
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
