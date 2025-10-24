'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [inviteRequests, setInviteRequests] = useState<any[]>([]);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [stats, setStats] = useState<any>({});
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    try {
      const [usersRes, requestsRes, codesRes, settingsRes, statsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/invite-requests'),
        fetch('/api/admin/invite-codes'),
        fetch('/api/admin/settings'),
        fetch('/api/admin/stats')
      ]);

      const [usersData, requestsData, codesData, settingsData, statsData] = await Promise.all([
        usersRes.json(),
        requestsRes.json(),
        codesRes.json(),
        settingsRes.json(),
        statsRes.json()
      ]);

      setUsers(usersData.users || []);
      setInviteRequests(requestsData.requests || []);
      setInviteCodes(codesData.codes || []);
      setSettings(settingsData.settings || {});
      setStats(statsData.stats || {});
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleInviteOnly() {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteOnly: !settings.inviteOnly
        })
      });

      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, inviteOnly: !settings.inviteOnly });
      }
    } catch (err) {
      console.error('Failed to toggle invite mode:', err);
    }
  }

  async function generateInviteCode() {
    try {
      const res = await fetch('/api/admin/invite-codes', {
        method: 'POST'
      });

      const data = await res.json();
      if (data.success) {
        setInviteCodes([data.code, ...inviteCodes]);
      }
    } catch (err) {
      console.error('Failed to generate invite code:', err);
    }
  }

  async function approveRequest(requestId: string) {
    try {
      const res = await fetch('/api/admin/invite-requests/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });

      const data = await res.json();
      if (data.success) {
        setInviteRequests(inviteRequests.filter(r => r.id !== requestId));
        await loadAdminData(); // Reload to get updated stats
      }
    } catch (err) {
      console.error('Failed to approve request:', err);
    }
  }

  async function rejectRequest(requestId: string) {
    try {
      const res = await fetch('/api/admin/invite-requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });

      const data = await res.json();
      if (data.success) {
        setInviteRequests(inviteRequests.filter(r => r.id !== requestId));
      }
    } catch (err) {
      console.error('Failed to reject request:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-6 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black text-gray-900 mb-4">
            🔐 Admin Console
          </h1>
          <p className="text-xl text-gray-600">
            Manage users, settings, and system configuration
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl font-black text-purple-600 mb-4">{stats.totalUsers || 0}</div>
            <div className="text-sm font-bold text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl font-black text-blue-600 mb-4">{stats.activeUsers || 0}</div>
            <div className="text-sm font-bold text-gray-600">Active Users</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl font-black text-green-600 mb-4">{stats.pendingRequests || 0}</div>
            <div className="text-sm font-bold text-gray-600">Pending Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl font-black text-orange-600 mb-4">{stats.availableCodes || 0}</div>
            <div className="text-sm font-bold text-gray-600">Available Codes</div>
          </div>
        </div>

        {/* Invite-Only Toggle */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
                🔒 Invite-Only Mode
              </h2>
              <p className="text-gray-600">
                {settings.inviteOnly 
                  ? 'Platform is currently private. Users need an invite code to sign up.'
                  : 'Platform is open. Anyone can create an account.'}
              </p>
            </div>
            <button
              onClick={toggleInviteOnly}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                settings.inviteOnly ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform ${
                  settings.inviteOnly ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {['overview', 'users', 'requests', 'codes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-6 px-6 border-b-2 font-bold text-sm uppercase transition-colors ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold mb-6">System Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-600 mb-4">Registration Status</div>
                      <div className="text-3xl font-black text-gray-900">
                        {settings.inviteOnly ? '🔒 Private' : '🌐 Open'}
                      </div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-lg">
                      <div className="text-sm font-bold text-gray-600 mb-4">User Growth</div>
                      <div className="text-3xl font-black text-green-600">
                        +{stats.newUsersThisWeek || 0} this week
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-2xl font-extrabold mb-6">All Users ({users.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-5 px-6 font-extrabold text-sm text-gray-700">Name</th>
                        <th className="text-left py-5 px-6 font-extrabold text-sm text-gray-700">Email</th>
                        <th className="text-left py-5 px-6 font-extrabold text-sm text-gray-700">Role</th>
                        <th className="text-left py-5 px-6 font-extrabold text-sm text-gray-700">Joined</th>
                        <th className="text-left py-5 px-6 font-extrabold text-sm text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-5 px-6 font-semibold">{user.name}</td>
                          <td className="py-5 px-6 text-gray-600">{user.email}</td>
                          <td className="py-5 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-5 px-6 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="py-5 px-6">
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h3 className="text-2xl font-extrabold mb-6">Invite Requests ({inviteRequests.length})</h3>
                <div className="space-y-6">
                  {inviteRequests.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No pending invite requests
                    </div>
                  ) : (
                    inviteRequests.map((request) => (
                      <div key={request.id} className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-extrabold text-lg text-gray-900 mb-2">{request.name}</div>
                            <div className="text-sm text-gray-600 mb-4">{request.email}</div>
                            <div className="text-sm text-gray-700 mb-4">
                              <strong>Reason:</strong> {request.reason}
                            </div>
                            <div className="text-xs text-gray-500">
                              Requested: {new Date(request.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex gap-4 ml-6">
                            <button
                              onClick={() => approveRequest(request.id)}
                              className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => rejectRequest(request.id)}
                              className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                              ✗ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Codes Tab */}
            {activeTab === 'codes' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-extrabold">Invite Codes ({inviteCodes.length})</h3>
                  <button
                    onClick={generateInviteCode}
                    className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    + Generate New Code
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {inviteCodes.map((code) => (
                    <div key={code.id} className="p-6 bg-gray-50 rounded-lg">
                      <div className="font-mono text-2xl font-black text-purple-600 mb-4">
                        {code.code}
                      </div>
                      <div className="text-sm text-gray-600 space-y-2">
                        <div><strong>Status:</strong> {code.used ? '✓ Used' : '○ Available'}</div>
                        {code.used && <div><strong>Used by:</strong> {code.usedBy}</div>}
                        <div><strong>Created:</strong> {new Date(code.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

