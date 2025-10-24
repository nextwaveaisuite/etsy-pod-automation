"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (email === "nextwaveaisuite@gmail.com" && password === "1Church@Miles_st") {
      localStorage.setItem("adminAuth", "true");
      router.push("/admin");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a1128] text-white">
      <h1 className="text-3xl mb-6 font-bold">Admin Login</h1>
      <form onSubmit={handleLogin} className="bg-[#13274F] p-8 rounded-xl shadow-lg w-80">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-[#f1c40f] text-black py-2 font-bold rounded">
          Login
        </button>
        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      </form>
    </div>
  );
}
