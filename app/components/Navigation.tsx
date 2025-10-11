"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Basic" },
  { href: "/dashboard", label: "Auto" },
  { href: "/smart", label: "Smart 🧠" },
  { href: "/library", label: "Library 🖼️" },
  { href: "/editor", label: "Editor ✏️" },
  { href: "/planners", label: "Planners 📋" },
  { href: "/opportunities", label: "Opportunities 🍎" },
  { href: "/analytics", label: "Analytics 📊" },
  { href: "/chat", label: "AI Chat 🤖" },
  { href: "/pricing", label: "Pricing 💎" },
  { href: "/admin", label: "Admin ⚙️" },
  { href: "/settings", label: "Settings" },
];

export default function Navigation() {
  const pathname = usePathname() || "/";

  return (
    <nav className="nav">
      {LINKS.map(({ href, label }) => {
        const isActive =
          pathname === href ||
          (href !== "/" && pathname.startsWith(href + "/"));

        return (
          <Link
            key={href}
            href={href}
            className={`nav-link${isActive ? " active" : ""}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
