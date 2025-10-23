'use client'

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-value">1,234</div>
          <div className="stat-change">+12% this month</div>
        </div>
        
        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-value">$45,678</div>
          <div className="stat-change">+8% this month</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Products</h3>
          <div className="stat-value">3,456</div>
          <div className="stat-change">+15% this month</div>
        </div>
        
        <div className="stat-card">
          <h3>System Health</h3>
          <div className="stat-value">99.9%</div>
          <div className="stat-change">Uptime</div>
        </div>
      </div>
      
      <div className="admin-grid">
        <div className="admin-card">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>New user registered: john@example.com</li>
            <li>Product launched: Wildflower Tote Bag</li>
            <li>Payment received: $49.00</li>
          </ul>
        </div>
        
        <div className="admin-card">
          <h2>Quick Actions</h2>
          <button className="btn btn-primary">Add User</button>
          <button className="btn btn-secondary">View Reports</button>
          <button className="btn btn-secondary">System Settings</button>
        </div>
      </div>
    </div>
  )
}

