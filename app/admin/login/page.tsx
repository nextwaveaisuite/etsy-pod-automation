"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        setErr(j?.error || "Login failed");
        return;
      }
      const next = sp.get("next") || "/admin";
      router.replace(next);
    } catch {
      setErr("Network error");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, marginTop: 40 }}>
      <div className="card">
        <h2 className="card-header">Admin Login</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div>
            <label>Email</label>
            <input type="email" placeholder="owner@nextwaveaisuite.com" value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          {err && <p style={{ color: "var(--danger)", fontWeight: 800, textAlign: "center" }}>{err}</p>}
          <button className="btn-primary" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
}
