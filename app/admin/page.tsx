'use client';
import React from 'react';

export default function AdminPage() {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      setSettings(data.settings);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  }

  async function updateSetting(action: string, data: any) {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data })
      });
      
      if (res.ok) {
        await loadSettings();
        alert('✅ Updated successfully');
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white">Loading admin console...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ⚙️ Admin Console
          </h1>
          <p className="text-xl text-gray-300">
            Manage platform, users, integrations, and automation
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="bg-gray-800 rounded-xl p-2 mb-6 flex gap-2 overflow-x-auto">
          {['overview', 'platform', 'users', 'integrations', 'automation'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">{settings.stats.totalUsers}</div>
                <div className="text-sm opacity-90">Total Users</div>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">{settings.stats.totalProducts}</div>
                <div className="text-sm opacity-90">Total Products</div>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">{settings.stats.totalSales}</div>
                <div className="text-sm opacity-90">Total Sales</div>
              </div>
              <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-xl p-6 text-white">
                <div className="text-3xl font-bold">${settings.stats.totalRevenue}</div>
                <div className="text-sm opacity-90">Total Revenue</div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">System Status</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Platform Mode</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      settings.platform.mode === 'private' ? 'bg-red-600 text-white' :
                      settings.platform.mode === 'public' ? 'bg-green-600 text-white' :
                      'bg-yellow-600 text-white'
                    }`}>
                      {settings.platform.mode.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Autopilot</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      settings.automation.autopilotMode ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                    }`}>
                      {settings.automation.autopilotMode ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Storage Used</span>
                    <span className="text-white font-bold">{settings.stats.storageUsed}</span>
                  </div>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">API Calls Today</span>
                    <span className="text-white font-bold">{settings.stats.apiCallsToday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Tab */}
        {activeTab === 'platform' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Platform Settings</h2>
            
            <div className="space-y-6">
              {/* Access Mode */}
              <div>
                <label className="block text-white font-bold mb-3">Access Mode</label>
                <div className="grid grid-cols-3 gap-3">
                  {['private', 'invite-only', 'public'].map(mode => (
                    <button
                      key={mode}
                      onClick={() => updateSetting('update_platform', { mode })}
                      className={`p-4 rounded-lg font-bold transition-all ${
                        settings.platform.mode === mode
                          ? 'bg-indigo-600 text-white ring-2 ring-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {mode === 'private' && '🔒 Private'}
                      {mode === 'invite-only' && '📧 Invite Only'}
                      {mode === 'public' && '🌍 Public'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {settings.platform.mode === 'private' && 'Only you can access the platform'}
                  {settings.platform.mode === 'invite-only' && 'Users need an invite to join'}
                  {settings.platform.mode === 'public' && 'Anyone can sign up'}
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-bold">Allow Signups</div>
                    <div className="text-sm text-gray-400">Let new users create accounts</div>
                  </div>
                  <button
                    onClick={() => updateSetting('update_platform', { allowSignups: !settings.platform.allowSignups })}
                    className={`w-16 h-8 rounded-full transition-all ${
                      settings.platform.allowSignups ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                      settings.platform.allowSignups ? 'ml-9' : 'ml-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-bold">Require Approval</div>
                    <div className="text-sm text-gray-400">Manually approve new users</div>
                  </div>
                  <button
                    onClick={() => updateSetting('update_platform', { requireApproval: !settings.platform.requireApproval })}
                    className={`w-16 h-8 rounded-full transition-all ${
                      settings.platform.requireApproval ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                      settings.platform.requireApproval ? 'ml-9' : 'ml-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-bold">Maintenance Mode</div>
                    <div className="text-sm text-gray-400">Temporarily disable platform</div>
                  </div>
                  <button
                    onClick={() => updateSetting('update_platform', { maintenanceMode: !settings.platform.maintenanceMode })}
                    className={`w-16 h-8 rounded-full transition-all ${
                      settings.platform.maintenanceMode ? 'bg-red-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                      settings.platform.maintenanceMode ? 'ml-9' : 'ml-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Users ({settings.users.length})</h2>
                <button
                  onClick={() => {
                    const email = prompt('Enter user email:');
                    if (email) updateSetting('add_user', { email, role: 'user' });
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  + Add User
                </button>
              </div>

              <div className="space-y-3">
                {settings.users.map((user: any) => (
                  <div key={user.id} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{user.email}</div>
                      <div className="text-sm text-gray-400">
                        {user.role} • {user.productsCreated} products • {user.totalSales} sales
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'owner' ? 'bg-purple-600 text-white' :
                        user.role === 'admin' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {user.role}
                      </span>
                      {user.role !== 'owner' && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${user.email}?`)) {
                              updateSetting('remove_user', { userId: user.id });
                            }
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invites */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Pending Invites ({settings.invites.length})</h2>
                <button
                  onClick={() => {
                    const email = prompt('Enter email to invite:');
                    if (email) updateSetting('send_invite', { email });
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg"
                >
                  📧 Send Invite
                </button>
              </div>

              <div className="space-y-2">
                {settings.invites.map((invite: any) => (
                  <div key={invite.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{invite.email}</div>
                      <div className="text-xs text-gray-400">Sent: {invite.sentAt} • Expires: {invite.expiresAt}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-600 text-white">
                      {invite.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Integrations</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(settings.integrations).map(([provider, config]: [string, any]) => (
                <div key={provider} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white capitalize">{provider}</h3>
                      <div className="text-sm text-gray-400">
                        {config.connected ? '✅ Connected' : '⚠️ Not configured'}
                      </div>
                    </div>
                    <button
                      onClick={() => updateSetting('toggle_integration', { provider, enabled: !config.enabled })}
                      className={`w-16 h-8 rounded-full transition-all ${
                        config.enabled ? 'bg-green-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                        config.enabled ? 'ml-9' : 'ml-1'
                      }`} />
                    </button>
                  </div>
                  
                  {config.shopId && (
                    <div className="text-xs text-gray-400">
                      Shop ID: {config.shopId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Automation Settings</h2>
            
            <div className="space-y-4">
              {Object.entries(settings.automation).map(([key, value]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="text-white font-bold capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {key === 'autopilotMode' && '100% hands-free operation'}
                      {key === 'autoPublish' && 'Automatically publish to Etsy'}
                      {key === 'autoPrice' && 'Optimize pricing automatically'}
                      {key === 'autoSEO' && 'Generate SEO content automatically'}
                      {key === 'autoMockups' && 'Create mockups automatically'}
                    </div>
                  </div>
                  <button
                    onClick={() => updateSetting('update_automation', { [key]: !value })}
                    className={`w-16 h-8 rounded-full transition-all ${
                      value ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full transition-all ${
                      value ? 'ml-9' : 'ml-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            {settings.automation.autopilotMode && (
              <div className="mt-6 p-4 bg-green-900 border-2 border-green-600 rounded-lg">
                <div className="text-green-300 font-bold mb-2">🚀 Autopilot Mode Active</div>
                <div className="text-sm text-green-400">
                  The system is running on 100% autopilot. Products will be created, optimized, and published automatically.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

