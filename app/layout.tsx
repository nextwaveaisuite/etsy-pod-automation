import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="/">🏠 Dashboard</Link>
          <Link href="/opportunities">Opportunities</Link>
          <Link href="/social">Social</Link>
          <Link href="/traffic">Traffic</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/admin/login">Admin</Link>
        </nav>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
