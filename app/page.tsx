'use client'

import { useState } from 'react'

export default function HomePage() {
  const [niche, setNiche] = useState('wildflower line art')
  const [product, setProduct] = useState('tote bag')
  const [mockupUrls, setMockupUrls] = useState('')
  const [activity, setActivity] = useState<string[]>([])
  const [seo, setSeo] = useState('')
  const [profit, setProfit] = useState('')
  const [breakeven, setBreakeven] = useState('')
  const [loading, setLoading] = useState(false)

  const generateMockup = async () => {
    setActivity(prev => [...prev, '🎨 Generating mockup...'])
  }

  const launch = async () => {
    setLoading(true)
    setActivity([])
    setActivity(prev => [...prev, '🚀 Launching one-button flow...'])
    
    try {
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
        setProfit(`$${calcData.profit.toFixed(2)} AUD`)
        setBreakeven(`$${calcData.breakeven.toFixed(2)} AUD`)
        setActivity(prev => [...prev, '✅ Calc done'])
      }

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
      setActivity(prev => [...prev, `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Etsy POD Builder — AU</h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '1.05rem' }}>
          Dashboard
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card">
            <h3 className="card-header">Inputs</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label>Niche</label>
              <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Product</label>
              <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label>Mockup Image URLs (one per line)</label>
              <textarea value={mockupUrls} onChange={(e) => setMockupUrls(e.target.value)} rows={3} style={{ resize: 'vertical' }} />
            </div>

            <button onClick={generateMockup} className="btn-success" style={{ width: '100%', marginBottom: '1rem' }}>
              Generate Mockup
            </button>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '0.5rem', border: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '700' }}>Taxonomy ID:</span>
              <span style={{ fontWeight: '800', color: 'var(--primary)' }}>1100</span>
            </div>
          </div>

          <div className="card">
            <h3 className="card-header">One-Button Launcher</h3>
            
            <button onClick={launch} disabled={loading} className="btn-primary" style={{ width: '100%', fontSize: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem' }}>
              {loading ? '⏳ Processing...' : 'Launch'}
            </button>

            {seo && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: '700', marginBottom: '0.75rem' }}>SEO:</div>
                <div style={{ padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '0.5rem', border: '2px solid #3b82f6', fontWeight: '600', color: '#1e40af' }}>
                  {seo}
                </div>
              </div>
            )}

            {profit && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '2px solid #10b981', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#166534', marginBottom: '0.5rem' }}>Profit</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981' }}>{profit}</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', border: '2px solid #f59e0b', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#92400e', marginBottom: '0.5rem' }}>Breakeven</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f59e0b' }}>{breakeven}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="card-header">Activity</h3>
            <div style={{ minHeight: '400px', maxHeight: '600px', overflowY: 'auto', backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '0.5rem', border: '2px solid var(--border)' }}>
              {activity.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <p style={{ fontWeight: '600' }}>No activity yet</p>
                </div>
              ) : (
                activity.map((item, index) => (
                  <div key={index} style={{ padding: '0.875rem 1rem', marginBottom: '0.75rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '2px solid var(--border)', fontWeight: '600' }}>
                    • {item}
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
