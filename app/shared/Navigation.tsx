"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CORE = [
  { href: "/", label: "Basic" },
  { href: "/dashboard", label: "Auto" },
  { href: "/smart", label: "Smart 🧠" },
  { href: "/library", label: "Library 🖼️" },
  { href: "/editor", label: "Editor ✏️" },
  { href: "/planners", label: "Planners 📋" },
];

const GROWTH = [
  { href: "/opportunities", label: "Opportunities 🍎" },
  { href: "/analytics", label: "Analytics 📊" },
  { href: "/social", label: "Social 🚀" },
  { href: "/traffic", label: "Traffic 📈" },
];

const AI = [
  { href: "/chat", label: "AI Chat 🤖" },
  { href: "/pricing", label: "Pricing 💎" },
];

export default function Navigation() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const LinkItem = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link href={href} className={`nav-link${active ? " active" : ""}`}>
        {label}
      </Link>
    );
  };

  return (
    <>
      {/* Dashboards dropdown */}
      <div className="dropdown" ref={ref}>
        <button className={`nav-link ${pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/smart") ? "active" : ""}`} onClick={() => setOpen((v) => !v)}>
          Dashboards <span className="caret">▾</span>
        </button>
        {open && (
          <div className="menu">
            {CORE.map((l) => (
              <Link key={l.href} href={l.href} className={`menu-item ${pathname === l.href ? "selected" : ""}`} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Growth */}
      {GROWTH.map((l) => <LinkItem key={l.href} href={l.href} label={l.label} />)}

      {/* AI, Pricing */}
      {AI.map((l) => <LinkItem key={l.href} href={l.href} label={l.label} />)}

      {/* Admin/Settings intentionally hidden from public nav */}
    </>
  );
}
