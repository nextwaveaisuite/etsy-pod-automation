'use client'

import { useState, useEffect } from 'react'

export default function TrafficAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [view, setView] = useState('summary')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, view])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/social/analytics?timeRange=${timeRange}&view=${view}`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>🚀 Traffic Analytics</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Track performance across Pinterest, Instagram, TikTok, and Lemon8
      </p>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label>Time Range</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ marginTop: '0.5rem' }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div>
            <label>View</label>
            <select 
              value={view} 
              onChange={(e) => setView(e.target.value)}
              style={{ marginTop: '0.5rem' }}
            >
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
              <option value="comparison">Platform Comparison</option>
            </select>
          </div>

          <button 
            onClick={fetchAnalytics}
            className="btn-primary"
            style={{ marginTop: 'auto' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary View */}
      {view === 'summary' && analytics?.summary && (
        <>
          {/* Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <MetricCard 
              title="Total Posts"
              value={analytics.summary.totalPosts.toLocaleString()}
              icon="📝"
            />
            <MetricCard 
              title="Total Impressions"
              value={analytics.summary.totalImpressions.toLocaleString()}
              icon="👁️"
            />
            <MetricCard 
              title="Total Clicks"
              value={analytics.summary.totalClicks.toLocaleString()}
              icon="🖱️"
            />
            <MetricCard 
              title="Total Engagements"
              value={analytics.summary.totalEngagements.toLocaleString()}
              icon="❤️"
            />
            <MetricCard 
              title="Avg Engagement Rate"
              value={`${analytics.summary.avgEngagementRate.toFixed(2)}%`}
              icon="📊"
            />
            <MetricCard 
              title="Avg CTR"
              value={`${analytics.summary.avgCTR.toFixed(2)}%`}
              icon="🎯"
            />
            <MetricCard 
              title="Total Conversions"
              value={analytics.summary.totalConversions.toLocaleString()}
              icon="💰"
            />
            <MetricCard 
              title="Total Revenue"
              value={`$${analytics.summary.totalRevenue.toFixed(2)}`}
              icon="💵"
            />
          </div>

          {/* Platform Breakdown */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 className="card-header">Platform Performance</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {Object.entries(analytics.summary.platformBreakdown).map(([platform, engagements]: [string, any]) => (
                <div key={platform} style={{ 
                  padding: '1rem', 
                  border: '2px solid var(--border)', 
                  borderRadius: '0.5rem',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {platform === 'pinterest' && '📌'}
                    {platform === 'instagram' && '📷'}
                    {platform === 'tiktok' && '🎵'}
                    {platform === 'lemon8' && '🍋'}
                  </div>
                  <div style={{ fontWeight: '700', textTransform: 'capitalize', marginBottom: '0.25rem' }}>
                    {platform}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                    {engagements.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    engagements
                  </div>
                </div>
              ))}
            </div>
            {analytics.summary.topPlatform && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                <strong>🏆 Top Platform:</strong> {analytics.summary.topPlatform.toUpperCase()}
              </div>
            )}
          </div>

          {/* Top Post */}
          {analytics.summary.topPost && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 className="card-header">🌟 Top Performing Post</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Product</div>
                  <div style={{ fontSize: '1.125rem', color: 'var(--primary)' }}>
                    {analytics.summary.topPost.productName}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Platform: {analytics.summary.topPost.platform}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Likes</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {analytics.summary.topPost.metrics.likes.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Comments</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {analytics.summary.topPost.metrics.comments.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Shares</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {analytics.summary.topPost.metrics.shares.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Saves</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                      {analytics.summary.topPost.metrics.saves.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance by Day */}
          {analytics.summary.performanceByDay && analytics.summary.performanceByDay.length > 0 && (
            <div className="card">
              <h3 className="card-header">📈 Performance Over Time</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border)' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Date</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Posts</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Impressions</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Clicks</th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Engagements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.summary.performanceByDay.map((day: any) => (
                      <tr key={day.date} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '0.75rem' }}>{day.date}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.posts}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.impressions.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.clicks.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>{day.engagements.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detailed View */}
      {view === 'detailed' && analytics?.posts && (
        <div className="card">
          <h3 className="card-header">All Posts</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Product</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700' }}>Platform</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Impressions</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Clicks</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Engagement Rate</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>CTR</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '700' }}>Conversions</th>
                </tr>
              </thead>
              <tbody>
                {analytics.posts.map((post: any) => (
                  <tr key={post.postId} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>{post.productName}</td>
                    <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>{post.platform}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{post.metrics.impressions.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{post.metrics.clicks.toLocaleString()}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{post.metrics.engagement_rate.toFixed(2)}%</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{post.metrics.ctr.toFixed(2)}%</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>{post.metrics.conversions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {view === 'comparison' && analytics?.comparison && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Object.entries(analytics.comparison).map(([platform, data]: [string, any]) => (
            <div key={platform} className="card">
              <h3 style={{ textTransform: 'capitalize', marginBottom: '1rem' }}>
                {platform === 'pinterest' && '📌 '}
                {platform === 'instagram' && '📷 '}
                {platform === 'tiktok' && '🎵 '}
                {platform === 'lemon8' && '🍋 '}
                {platform}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <MetricRow label="Posts" value={data.posts} />
                <MetricRow label="Avg Impressions" value={Math.round(data.avgImpressions).toLocaleString()} />
                <MetricRow label="Avg Reach" value={Math.round(data.avgReach).toLocaleString()} />
                <MetricRow label="Avg Clicks" value={Math.round(data.avgClicks).toLocaleString()} />
                <MetricRow label="Avg Engagement Rate" value={`${data.avgEngagementRate.toFixed(2)}%`} />
                <MetricRow label="Avg CTR" value={`${data.avgCTR.toFixed(2)}%`} />
                <MetricRow label="Total Conversions" value={data.totalConversions} />
                <MetricRow label="Total Revenue" value={`$${data.totalRevenue.toFixed(2)}`} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
        {value}
      </div>
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: '700' }}>{value}</span>
    </div>
  )
}
