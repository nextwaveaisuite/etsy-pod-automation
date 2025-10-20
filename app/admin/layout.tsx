import Link from "next/link";
import { ReactNode } from "react";
import { headers } from "next/headers";

function isActive(path: string) {
  const h = headers();
  const url = h.get("x-url") || "";
  return url.includes(path);
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="admin-shell">
          <aside className="admin-aside">
            <div className="admin-brand">NEXTWAVE — ADMIN</div>
            <nav className="admin-nav">
              <Link className={`admin-link ${isActive("/admin") ? "active" : ""}`} href="/admin">Overview</Link>
              <Link className="admin-link" href="/admin/users">Users</Link>
              <Link className="admin-link" href="/admin/plans">Plans</Link>
              <Link className="admin-link" href="/admin/revenue">Revenue</Link>
              <Link className="admin-link" href="/admin/logs">Logs</Link>
              <Link className="admin-link" href="/admin/settings">Settings</Link>
              <form action="/api/admin/logout" method="post" style={{ marginTop: 10 }}>
                <button className="admin-link" style={{ width: "100%", textAlign: "left" }} type="submit">Logout</button>
              </form>
            </nav>
          </aside>
          <main className="admin-main">{children}</main>
        </div>
      </body>
    </html>
  );
}
