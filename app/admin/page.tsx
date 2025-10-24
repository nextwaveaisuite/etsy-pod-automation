'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, isOwner } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function AdminConsolePage() {
  const router = useRouter()
  const [user, setUser] = useState(getCurrentUser())
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Check if user is owner
    if (!isOwner(user)) {
      // Redirect non-owners
      router.push('/')
    }
  }, [user, router])

  if (!isOwner(user)) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>🔐 Access Denied</h2>
        <p style={{ fontWeight: '600', marginBottom: '1.5rem' }}>
          You do not have permission to access the Admin Console.
        </p>
        <button onClick={() => router.push('/')} className="btn-primary">
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        borderRadius: '0.75rem',
        color: 'white'
      }}>
        <div>
          <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>🔐 Admin Console</h1>
          <p style={{ fontWeight: '600', marginBottom: '0', opacity: 0.9 }}>
            Platform Owner Control Panel
          </p>
        </div>
        <div style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '0.5rem',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Logged in as</div>
          <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{user.name}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem', 
        borderBottom: '3px solid var(--border)',
        overflowX: 'auto'
      }}>
        <TabButton label="📊 Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="👥 Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="⚙️ Platform Settings" active={activeTab === 'platform'} onClick={() => setActiveTab('platform')} />
        <TabButton label="💰 Revenue" active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} />
        <TabButton label="📈 Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
        <TabButton label="🔧 System" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard title="Total Users" value="1,247" icon="👥" color="#3b82f6" />
            <StatCard title="Active Users" value="892" icon="✅" color="#10b981" />
            <StatCard title="Revenue (MTD)" value="$12,450" icon="💰" color="#8b5cf6" />
            <StatCard title="Products Created" value="8,932" icon="📦" color="#f59e0b" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <h3 className="card-header">📊 Platform Activity</h3>
              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <p style={{ fontWeight: '600', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Activity chart would go here
                </p>
              </div>
            </div>

            <div className="card">
              <h3 className="card-header">⚡ Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="btn-primary" style={{ width: '100%' }}>
                  👥 Manage Users
                </button>
                <button className="btn-secondary" style={{ width: '100%' }}>
                  ⚙️ Platform Settings
                </button>
                <button className="btn-secondary" style={{ width: '100%' }}>
                  📊 View Reports
                </button>
                <button className="btn-secondary" style={{ width: '100%' }}>
                  🔧 System Health
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="card">
          <h3 className="card-header">👥 User Management</h3>
          
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              placeholder="Search users..." 
              style={{ flex: 1, minWidth: '250px' }}
            />
            <button className="btn-primary">+ Add User</button>
            <button className="btn-secondary">📤 Export</button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <UserRow name="John Doe" email="john@example.com" plan="Pro" status="Active" joined="2025-01-15" />
                <UserRow name="Jane Smith" email="jane@example.com" plan="Starter" status="Active" joined="2025-02-20" />
                <UserRow name="Bob Johnson" email="bob@example.com" plan="Free" status="Active" joined="2025-03-10" />
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Platform Settings Tab */}
      {activeTab === 'platform' && (
        <div>
          <div className="card">
            <h3 className="card-header">⚙️ Platform Settings</h3>
            
            <div className="form-group">
              <label>Platform Mode</label>
              <select>
                <option value="private">🔒 Private (Invite Only)</option>
                <option value="public">🌐 Public (Open Registration)</option>
                <option value="request">📝 Request Access</option>
              </select>
            </div>

            <div className="form-group">
              <label>Platform Name</label>
              <input type="text" defaultValue="Etsy Automate" />
            </div>

            <div className="form-group">
              <label>Support Email</label>
              <input type="email" defaultValue="support@etsyautomate.com" />
            </div>

            <div className="form-group">
              <label>
                <input type="checkbox" defaultChecked style={{ width: 'auto', marginRight: '0.5rem' }} />
                Allow new user registrations
              </label>
            </div>

            <div className="form-group">
              <label>
                <input type="checkbox" defaultChecked style={{ width: 'auto', marginRight: '0.5rem' }} />
                Require email verification
              </label>
            </div>

            <button className="btn-success">💾 Save Settings</button>
          </div>

          <div className="card">
            <h3 className="card-header">🔑 API Keys</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ApiKeyRow label="Etsy API" status="Connected" />
              <ApiKeyRow label="Printify API" status="Connected" />
              <ApiKeyRow label="OpenAI API" status="Connected" />
              <ApiKeyRow label="Pinterest API" status="Not Connected" />
              <ApiKeyRow label="Instagram API" status="Not Connected" />
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard title="MRR" value="$8,450" icon="💵" color="#10b981" />
            <StatCard title="ARR" value="$101,400" icon="📈" color="#3b82f6" />
            <StatCard title="Churn Rate" value="2.3%" icon="📉" color="#f59e0b" />
            <StatCard title="LTV" value="$2,840" icon="💎" color="#8b5cf6" />
          </div>

          <div className="card">
            <h3 className="card-header">💰 Revenue Breakdown</h3>
            <table>
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Users</th>
                  <th>MRR</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge badge-primary">Pro</span></td>
                  <td>124</td>
                  <td>$6,076</td>
                  <td>71.9%</td>
                </tr>
                <tr>
                  <td><span className="badge badge-success">Starter</span></td>
                  <td>186</td>
                  <td>$3,534</td>
                  <td>41.8%</td>
                </tr>
                <tr>
                  <td><span className="badge">Free</span></td>
                  <td>937</td>
                  <td>$0</td>
                  <td>0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="card">
          <h3 className="card-header">📈 Platform Analytics</h3>
          <p style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>
            Comprehensive analytics dashboard coming soon...
          </p>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div>
          <div className="card">
            <h3 className="card-header">🔧 System Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <SystemStatusRow label="API Server" status="Operational" />
              <SystemStatusRow label="Database" status="Operational" />
              <SystemStatusRow label="Storage" status="Operational" />
              <SystemStatusRow label="Email Service" status="Operational" />
              <SystemStatusRow label="Background Jobs" status="Operational" />
            </div>
          </div>

          <div className="card">
            <h3 className="card-header">⚠️ Danger Zone</h3>
            <div style={{ padding: '1.5rem', backgroundColor: '#fef2f2', border: '3px solid #ef4444', borderRadius: '0.5rem' }}>
              <h4 style={{ color: '#991b1b', marginBottom: '1rem' }}>Maintenance Mode</h4>
              <p style={{ fontWeight: '600', marginBottom: '1rem', color: '#991b1b' }}>
                Enable maintenance mode to prevent user access during updates
              </p>
              <button className="btn-secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }}>
                Enable Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.875rem 1.5rem',
        border: 'none',
        borderBottom: active ? '4px solid var(--primary)' : '4px solid transparent',
        backgroundColor: 'transparent',
        fontWeight: active ? '800' : '700',
        fontSize: '0.95rem',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </button>
  )
}

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: string; color: string }) {
  return (
    <div className="card" style={{ textAlign: 'center', borderColor: color }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '700' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '900', color: color }}>
        {value}
      </div>
    </div>
  )
}

function UserRow({ name, email, plan, status, joined }: any) {
  return (
    <tr>
      <td style={{ fontWeight: '700' }}>{name}</td>
      <td>{email}</td>
      <td><span className={`badge badge-${plan === 'Pro' ? 'primary' : plan === 'Starter' ? 'success' : ''}`}>{plan}</span></td>
      <td><span className="badge badge-success">{status}</span></td>
      <td>{joined}</td>
      <td>
        <button className="btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
          Edit
        </button>
      </td>
    </tr>
  )
}

function ApiKeyRow({ label, status }: { label: string; status: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '0.5rem',
      border: '2px solid var(--border)'
    }}>
      <span style={{ fontWeight: '700' }}>{label}</span>
      <span className={`badge badge-${status === 'Connected' ? 'success' : 'warning'}`}>
        {status}
      </span>
    </div>
  )
}

function SystemStatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: 'var(--bg-tertiary)',
      borderRadius: '0.5rem',
      border: '2px solid var(--border)'
    }}>
      <span style={{ fontWeight: '700' }}>{label}</span>
      <span className="badge badge-success">✅ {status}</span>
    </div>
  )
}

