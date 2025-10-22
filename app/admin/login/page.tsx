"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === "nextwaveaisuite@gmail.com" && password === "1Church@Miles_st") {
      localStorage.setItem("admin", "true");
      router.push("/admin/dashboard");
    } else {
      alert("Invalid admin credentials.");
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ textAlign: "center" }}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
