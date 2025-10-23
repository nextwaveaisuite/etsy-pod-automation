'use client'

import { useState, useEffect } from 'react'

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([])

  useEffect(() => {
    // Fetch opportunities from API
    fetch('/api/opportunities/analyze')
      .then(res => res.json())
      .then(data => setOpportunities(data.opportunities || []))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="container">
      <h1 className="gradient-text">Low-Hanging Fruit Opportunities 🍎</h1>
      <p className="subtitle">High traffic, low competition, high profit niches</p>
      
      <div className="grid">
        {opportunities.length === 0 ? (
          <div className="card">
            <p>Loading opportunities...</p>
          </div>
        ) : (
          opportunities.map((opp, index) => (
            <div key={index} className="card">
              <h3>{opp.niche}</h3>
              <div className="stats">
                <div>
                  <strong>Score:</strong> {opp.score}
                </div>
                <div>
                  <strong>Traffic:</strong> {opp.traffic}
                </div>
                <div>
                  <strong>Competition:</strong> {opp.competition}
                </div>
                <div>
                  <strong>Profit:</strong> ${opp.profit}
                </div>
              </div>
              <button className="btn btn-primary">Explore</button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
