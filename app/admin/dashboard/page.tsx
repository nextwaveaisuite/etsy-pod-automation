"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) router.push("/admin/login");
  }, [router]);

  return (
    <div>
      <h1>📊 Admin Dashboard</h1>
      <p>Manage users, monitor analytics, and control automation performance from here.</p>
    </div>
  );
}
