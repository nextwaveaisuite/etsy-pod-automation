'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="container">
      <h1 className="gradient-text">Dashboard</h1>
      <p className="subtitle">Choose your workflow</p>
      
      <div className="grid">
        <Link href="/dashboard/basic" className="card">
          <h2>Basic Dashboard</h2>
          <p>Manual control over all features</p>
        </Link>
        
        <Link href="/dashboard/auto" className="card">
          <h2>Auto Dashboard</h2>
          <p>Automated niche discovery and launch</p>
        </Link>
        
        <Link href="/dashboard/smart" className="card">
          <h2>Smart Dashboard 🧠</h2>
          <p>AI-powered winner analysis</p>
        </Link>
        
        <Link href="/dashboard/library" className="card">
          <h2>Image Library 🖼️</h2>
          <p>Manage your design assets</p>
        </Link>
        
        <Link href="/dashboard/editor" className="card">
          <h2>Image Editor ✏️</h2>
          <p>Edit and enhance images</p>
        </Link>
        
        <Link href="/dashboard/planners" className="card">
          <h2>Planners 📋</h2>
          <p>15 productivity templates</p>
        </Link>
        
        <Link href="/dashboard/opportunities" className="card">
          <h2>Opportunities 🍎</h2>
          <p>Low-hanging fruit analyzer</p>
        </Link>
        
        <Link href="/dashboard/analytics" className="card">
          <h2>Analytics 📊</h2>
          <p>Track performance metrics</p>
        </Link>
        
        <Link href="/dashboard/social" className="card">
          <h2>Social Hub 🚀</h2>
          <p>Multi-platform posting</p>
        </Link>
        
        <Link href="/dashboard/traffic" className="card">
          <h2>Traffic Analytics 📈</h2>
          <p>Monitor traffic sources</p>
        </Link>
        
        <Link href="/dashboard/pricing" className="card">
          <h2>Pricing 💎</h2>
          <p>Subscription tiers</p>
        </Link>
      </div>
    </div>
  )
}

