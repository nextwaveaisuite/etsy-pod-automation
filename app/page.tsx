'use client'

import { useState } from 'react'

export default function BasicDashboard() {
  const [niche, setNiche] = useState('wildflower line art')
  const [product, setProduct] = useState('tote bag')
  const [mockupUrls, setMockupUrls] = useState('')
  const [activity, setActivity] = useState<string[]>([])
  const [seo, setSeo] = useState('')
  const [profit, setProfit] = useState('')
  const [loading, setLoading] = useState(false)

  const generateMockup = async () => {
    setActivity(prev => [...prev, '🎨 Generating mockup...'])
    // Add your mockup generation logic here
  }

  const launch = async () => {
    setLoading(true)
    setActivity(prev => [...prev, '🚀 Launching one-button flow...'])
    
    try {
      // Calculate profit
      const calcResponse = await fetch('/api/calc/etsy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemPrice: 24.95,
          costOfGoods: 13.00
        })
      })
      
      const calcData = await calcResponse.json()
      if (calcData.success) {
        setProfit(`${calcData.profit.toFixed(2)} AUD`)
        setActivity(prev => [...prev, '✅ Calc done'])
      }

      // Generate SEO
      const seoResponse = await fetch('/api/seo/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: niche,
          product: product
        })
      })
      
      const seoData = await seoResponse.json()
      if (seoData.success && seoData.titles) {
        setSeo(seoData.titles.join(' — '))
        setActivity(prev => [...prev, '✅ SEO generated'])
      }
    } catch (error) {
      console.error('Launch error:', error)
      setActivity(prev => [...prev, '❌ Error occurred'])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>📦 Basic Dashboard</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontWeight: '600' }}>
        Manual controls for product creation and listing
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Column - Inputs */}
        <div>
          <div className="card">
            <h3 className="card-header">⚙️ Inputs</h3>
            
            <div className="form-group">
              <label>Niche</label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                placeholder="e.g., wildflower line art"
              />
            </div>

            <div className="form-group">
              <label>Product</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="e.g., tote bag"
              />
            </div>

            <div className="form-group">
              <label>Mockup Image URLs (one per line)</label>
              <textarea
                value={mockupUrls}
                onChange={(e) => setMockupUrls(e.target.value)}
                rows={4}
                placeholder="https://example.com/image1.jpg"
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              onClick={generateMockup}
              className="btn-success"
              style={{ width: '100%' }}
            >
              🎨 Generate Mockup
            </button>

            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary )', 
              borderRadius: '0.5rem',
              border: '2px solid var(--border)'
            }}>
              <strong style={{ fontWeight: '800' }}>Taxonomy ID:</strong> 1100
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Results */}
        <div>
          <div className="card">
            <h3 className="card-header">🚀 One-Button Launcher</h3>
            
            <button
              onClick={launch}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', fontSize: '1.25rem', padding: '1.25rem' }}
            >
              {loading ? '⏳ Processing...' : '🚀 Launch'}
            </button>

            {seo && (
              <div style={{ marginTop: '1.5rem' }}>
                <strong style={{ fontWeight: '800', display: 'block', marginBottom: '0.75rem' }}>
                  📝 SEO:
                </strong>
                <p style={{ 
                  padding: '1rem', 
                  backgroundColor: '#eff6ff', 
                  borderRadius: '0.5rem',
                  border: '2px solid #3b82f6',
                  fontWeight: '600',
                  color: '#1e40af'
                }}>
                  {seo}
                </p>
              </div>
            )}

            {profit && (
              <div style={{ marginTop: '1.5rem' }}>
                <strong style={{ fontWeight: '800', display: 'block', marginBottom: '0.75rem' }}>
                  💰 Profit:
                </strong>
                <p style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '0.5rem',
                  border: '2px solid #10b981',
                  fontWeight: '800',
                  fontSize: '1.5rem',
                  color: '#166534',
                  textAlign: 'center'
                }}>
                  ${profit}
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="card-header">📊 Activity Log</h3>
            <div style={{ 
              maxHeight: '300px', 
              overflowY: 'auto',
              backgroundColor: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '2px solid var(--border)'
            }}>
              {activity.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontWeight: '600', textAlign: 'center' }}>
                  No activity yet
                </p>
              ) : (
                activity.map((item, index) => (
                  <div key={index} style={{ 
                    padding: '0.75rem', 
                    marginBottom: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '0.375rem',
                    border: '2px solid var(--border)',
                    fontWeight: '600'
                  }}>
                    {item}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
