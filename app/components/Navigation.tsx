"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const LINKS = [
  // Shown as individual links
  { href: "/library", label: "Library 🖼️" },
  { href: "/editor", label: "Editor ✏️" },
  { href: "/planners", label: "Planners 📋" },
  { href: "/opportunities", label: "Opportunities 🍎" },
  { href: "/analytics", label: "Analytics 📊" },
  { href: "/chat", label: "AI Chat 🤖" },
  { href: "/pricing", label: "Pricing 💎" },
  // Hidden from navbar: /admin, /settings
];

const DASHBOARDS = [
  { href: "/", label: "Basic" },
  { href: "/dashboard", label: "Auto" },
  { href: "/smart", label: "Smart 🧠" },
];

export default function Navigation() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <nav className="nav">
      {/* Dashboards dropdown */}
      <div className="dropdown" ref={ref}>
        <button className={`nav-link ${pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/smart") ? "active" : ""}`} onClick={() => setOpen((v) => !v)}>
          Dashboards
          <span className="caret">▾</span>
        </button>
        {open && (
          <div className="menu">
            {DASHBOARDS.map(({ href, label }) => (
              <Link key={href} href={href} className={`menu-item ${pathname === href ? "selected" : ""}`} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Flat links */}
      {LINKS.map(({ href, label }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={href} href={href} className={`nav-link${active ? " active" : ""}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
