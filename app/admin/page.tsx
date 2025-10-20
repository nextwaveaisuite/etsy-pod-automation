export default function AdminHome() {
  return (
    <div className="admin-card">
      <h2 className="admin-h2">🧠 Admin Control Panel</h2>
      <p style={{ textAlign: "center", color: "#CBD5E1", fontWeight: 800, marginBottom: 12 }}>
        Manage users, plans, revenue, and system health.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        <div className="admin-card" style={{ background: "#111827" }}>
          <h3 style={{ textAlign: "center", margin: 0, fontWeight: 900 }}>👥 Users</h3>
          <p style={{ textAlign: "center", fontWeight: 900, fontSize: 24 }}>128</p>
        </div>
        <div className="admin-card" style={{ background: "#111827" }}>
          <h3 style={{ textAlign: "center", margin: 0, fontWeight: 900 }}>🏪 Active Shops</h3>
          <p style={{ textAlign: "center", fontWeight: 900, fontSize: 24 }}>93</p>
        </div>
        <div className="admin-card" style={{ background: "#111827" }}>
          <h3 style={{ textAlign: "center", margin: 0, fontWeight: 900 }}>💰 MRR</h3>
          <p style={{ textAlign: "center", fontWeight: 900, fontSize: 24 }}>$4,292</p>
        </div>
      </div>
    </div>
  );
}

