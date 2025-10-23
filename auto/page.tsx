'use client'

import { useState } from 'react'

export default function AutoDashboard() {
  const [niche, setNiche] = useState('')
  const [product, setProduct] = useState('')
  const [activity, setActivity] = useState<string[]>([])

  const handleAutoLaunch = async () => {
    setActivity(['🔍 Discovering top niches...', '📊 Analyzing competition...', '🎨 Generating designs...'])
    // Add auto-launch logic here
  }

  return (
    <div className="container">
      <h1 className="gradient-text">Auto Dashboard</h1>
      <p className="subtitle">Automated niche discovery and product launch</p>
      
      <div className="grid">
        <div className="card">
          <h2>Configuration</h2>
          <div className="form-group">
            <label>Niche (Auto-populated)</label>
            <select value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option>Wildflower Line Art</option>
              <option>Pet Portrait Silhouette</option>
              <option>Celestial Moon & Stars</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Product Type</label>
            <select value={product} onChange={(e) => setProduct(e.target.value)}>
              <option>Tote Bag</option>
              <option>Mug</option>
              <option>T-Shirt</option>
            </select>
          </div>
          
          <button onClick={handleAutoLaunch} className="btn btn-primary">
            🚀 Auto Launch Pipeline
          </button>
        </div>
        
        <div className="card">
          <h2>Activity Log</h2>
          <div className="activity-log">
            {activity.length === 0 ? (
              <p className="text-muted">No activity yet</p>
            ) : (
              activity.map((item, index) => (
                <div key={index} className="activity-item">{item}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

