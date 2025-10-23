'use client'

import { useState } from 'react'

export default function SocialMediaHubPage() {
  const [activeTab, setActiveTab] = useState('post')
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    imageUrl: '',
    videoUrl: '',
    niche: '',
    platforms: [] as string[],
    caption: '',
    hashtags: '',
    scheduleType: 'immediate',
    scheduledTime: ''
  })
  const [generatedCaption, setGeneratedCaption] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const generateCaption = async () => {
    if (!formData.productName) {
      alert('Please enter a product name')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/social/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productName,
          niche: formData.niche,
          platform: formData.platforms[0] || 'instagram',
          tone: 'casual',
          includeEmojis: true,
          includeHashtags: true
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setGeneratedCaption(data)
        setFormData(prev => ({
          ...prev,
          caption: data.captionOnly,
          hashtags: data.hashtags.join(' ')
        }))
      } else {
        alert('Failed to generate caption: ' + data.error)
      }
    } catch (error) {
      console.error('Caption generation error:', error)
      alert('Failed to generate caption')
    } finally {
      setLoading(false)
    }
  }

  const schedulePost = async () => {
    if (!formData.productName || !formData.imageUrl || formData.platforms.length === 0) {
      alert('Please fill in product name, image URL, and select at least one platform')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/social/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: formData.productId || `prod_${Date.now()}`,
          productName: formData.productName,
          imageUrl: formData.imageUrl,
          videoUrl: formData.videoUrl || undefined,
          platforms: formData.platforms,
          caption: formData.caption + '\n\n' + formData.hashtags,
          hashtags: formData.hashtags.split(' ').filter(h => h.startsWith('#')),
          scheduleType: formData.scheduleType,
          scheduledTime: formData.scheduledTime || undefined
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult(data)
        alert(data.message)
      } else {
        alert('Failed to schedule post: ' + data.error)
      }
    } catch (error) {
      console.error('Scheduling error:', error)
      alert('Failed to schedule post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>🚀 Social Media Hub</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Automate your social media presence across Pinterest, Instagram, TikTok, and Lemon8
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid var(--border)' }}>
        <TabButton 
          label="📝 Create Post" 
          active={activeTab === 'post'} 
          onClick={() => setActiveTab('post')} 
        />
        <TabButton 
          label="🎬 Generate Video" 
          active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')} 
        />
        <TabButton 
          label="🔗 Affiliate Links" 
          active={activeTab === 'affiliate'} 
          onClick={() => setActiveTab('affiliate')} 
        />
        <TabButton 
          label="📊 Analytics" 
          active={activeTab === 'analytics'} 
          onClick={() => setActiveTab('analytics')} 
        />
      </div>

      {/* Create Post Tab */}
      {activeTab === 'post' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Left Column - Form */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-header">Product Details</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Product Name *</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="e.g., Wildflower Tote Bag"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Product ID (optional)</label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Niche</label>
                <input
                  type="text"
                  name="niche"
                  value={formData.niche}
                  onChange={handleInputChange}
                  placeholder="e.g., Boho Home Decor"
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Image URL *</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://..."
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Video URL (optional)</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://... (for TikTok/Reels)"
                />
              </div>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-header">Select Platforms *</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <PlatformCheckbox
                  label="📌 Pinterest"
                  checked={formData.platforms.includes('pinterest')}
                  onChange={() => handlePlatformToggle('pinterest')}
                />
                <PlatformCheckbox
                  label="📷 Instagram"
                  checked={formData.platforms.includes('instagram')}
                  onChange={() => handlePlatformToggle('instagram')}
                />
                <PlatformCheckbox
                  label="🎵 TikTok"
                  checked={formData.platforms.includes('tiktok')}
                  onChange={() => handlePlatformToggle('tiktok')}
                />
                <PlatformCheckbox
                  label="🍋 Lemon8"
                  checked={formData.platforms.includes('lemon8')}
                  onChange={() => handlePlatformToggle('lemon8')}
                />
              </div>
            </div>

            <div className="card">
              <h3 className="card-header">Schedule</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label>Schedule Type</label>
                <select
                  name="scheduleType"
                  value={formData.scheduleType}
                  onChange={handleInputChange}
                >
                  <option value="immediate">Post Immediately</option>
                  <option value="scheduled">Schedule for Later</option>
                  <option value="recurring">Recurring Post</option>
                </select>
              </div>

              {formData.scheduleType !== 'immediate' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label>Scheduled Time</label>
                  <input
                    type="datetime-local"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Caption & Actions */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="card-header">Caption & Hashtags</h3>
              
              <button
                onClick={generateCaption}
                className="btn-primary"
                disabled={loading || !formData.productName}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                {loading ? 'Generating...' : '✨ Generate AI Caption'}
              </button>

              <div style={{ marginBottom: '1rem' }}>
                <label>Caption</label>
                <textarea
                  name="caption"
                  value={formData.caption}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Your caption here..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label>Hashtags</label>
                <textarea
                  name="hashtags"
                  value={formData.hashtags}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="#hashtag1 #hashtag2 #hashtag3"
                  style={{ resize: 'vertical' }}
                />
              </div>

              {generatedCaption && generatedCaption.alternatives && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
                  <strong>Alternative Captions:</strong>
                  {generatedCaption.alternatives.map((alt: string, i: number) => (
                    <div key={i} style={{ 
                      marginTop: '0.75rem', 
                      padding: '0.75rem', 
                      backgroundColor: 'white', 
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      border: '1px solid var(--border)'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, caption: alt }))}
                    >
                      <small style={{ color: 'var(--text-secondary)' }}>Option {i + 1} (click to use):</small>
                      <p style={{ marginTop: '0.25rem', marginBottom: '0' }}>{alt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={schedulePost}
              className="btn-success"
              disabled={loading || !formData.productName || !formData.imageUrl || formData.platforms.length === 0}
              style={{ width: '100%', fontSize: '1.125rem', padding: '1rem' }}
            >
              {loading ? 'Processing...' : '🚀 ' + (formData.scheduleType === 'immediate' ? 'Post Now' : 'Schedule Post')}
            </button>

            {result && (
              <div className="card" style={{ marginTop: '1.5rem', backgroundColor: '#f0fdf4', border: '2px solid #10b981' }}>
                <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>✅ Success!</h4>
                <p style={{ marginBottom: '0' }}>{result.message}</p>
                {result.results && (
                  <div style={{ marginTop: '1rem' }}>
                    <strong>Platform Results:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      {Object.entries(result.results).map(([platform, data]: [string, any]) => (
                        <li key={platform} style={{ marginBottom: '0.25rem' }}>
                          {platform}: {data.success ? '✅ Posted' : '❌ Failed'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Tab */}
      {activeTab === 'video' && (
        <div className="card">
          <h3 className="card-header">🎬 AI Video Generator</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Create professional product showcase videos for TikTok and Instagram Reels
          </p>
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎥</p>
            <p>Video generator coming soon!</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Upload product images and we'll create engaging videos automatically
            </p>
          </div>
        </div>
      )}

      {/* Affiliate Tab */}
      {activeTab === 'affiliate' && (
        <div className="card">
          <h3 className="card-header">🔗 Affiliate Link Generator</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Create trackable links to measure traffic and conversions from social media
          </p>
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</p>
            <p>Affiliate link system ready!</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              API available at /api/social/affiliate
            </p>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="card">
          <h3 className="card-header">📊 Traffic Analytics</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            View detailed analytics on the Traffic Analytics page
          </p>
          <a href="/traffic" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            Go to Traffic Analytics →
          </a>
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
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderBottom: active ? '3px solid var(--primary)' : '3px solid transparent',
        backgroundColor: 'transparent',
        fontWeight: active ? '700' : '600',
        color: active ? 'var(--primary)' : 'var(--text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      {label}
    </button>
  )
}

function PlatformCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.5rem', 
      padding: '0.75rem',
      border: `2px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
      borderRadius: '0.5rem',
      cursor: 'pointer',
      backgroundColor: checked ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      transition: 'all 0.2s'
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
      />
      <span style={{ fontWeight: '600' }}>{label}</span>
    </label>
  )
}
