export default function AdminPage() {
  return (
    <section className="card">
      <h2 className="card-header">Admin Console</h2>
      <p className="muted">This area is intentionally hidden from the main navigation.</p>
      <ul className="table" style={{ marginTop: 8 }}>
        <li><span>Platform Mode</span><span>Private</span></li>
        <li><span>Invite Only</span><span>On</span></li>
        <li><span>Maintenance</span><span>Off</span></li>
      </ul>
    </section>
  );
}
