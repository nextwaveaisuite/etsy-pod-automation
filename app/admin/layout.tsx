"use client";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0d1b2a", color: "white" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <main
          style={{
            flex: 1,
            padding: "2rem",
            background: "#1b263b",
            borderTopLeftRadius: "12px",
            color: "#e0e1dd",
          }}
        >
          {children}
        </main>
        <footer
          style={{
            background: "#0d1b2a",
            color: "#ffd700",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          © {new Date().getFullYear()} Etsy Automate Admin Console
        </footer>
      </div>
    </div>
  );
}
