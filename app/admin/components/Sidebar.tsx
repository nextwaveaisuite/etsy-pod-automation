export default function Sidebar() {
  return (
    <aside style={{ width: '220px', background: '#0d1b2a', color: 'white', padding: '1rem' }}>
      <h2 style={{ color: '#ffd700' }}>Admin</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="/admin/dashboard" style={{ color: 'white' }}>Dashboard</a></li>
          <li><a href="/admin/users" style={{ color: 'white' }}>Users</a></li>
          <li><a href="/admin/analytics" style={{ color: 'white' }}>Analytics</a></li>
          <li><a href="/admin/settings" style={{ color: 'white' }}>Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}
