'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navigation() {
  return (
    <nav style={{
      display: 'flex',
      gap: '0.75rem',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      <NavLink href="/" label="Basic" />
      <NavLink href="/dashboard" label="Auto" />
      <NavLink href="/smart" label="Smart 🧠" />
      <NavLink href="/library" label="Library 🖼️" />
      <NavLink href="/editor" label="Editor ✏️" />
      <NavLink href="/planners" label="Planners 📋" />
      <NavLink href="/opportunities" label="Opportunities 🍎" />
      <NavLink href="/analytics" label="Analytics 📊" />
      <NavLink href="/social" label="Social 🚀" />
      <NavLink href="/traffic" label="Traffic 📈" />
      <NavLink href="/chat" label="AI Chat 🤖" />
      <NavLink href="/pricing" label="Pricing 💎" />
      <NavLink href="/admin" label="Admin ⚙️" />
      <NavLink href="/settings" label="Settings" />
    </nav>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link 
      href={href}
      style={{
        padding: '0.625rem 1.25rem',
        borderRadius: '0.5rem',
        fontWeight: '800',
        fontSize: '1rem',
        color: isHovered ? '#3b82f6' : '#1e293b',
        textDecoration: 'none',
        transition: 'all 0.2s',
        border: `3px solid ${isHovered ? '#3b82f6' : 'transparent'}`,
        backgroundColor: isHovered ? '#f1f5f9' : 'transparent',
        letterSpacing: '0.01em'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
    </Link>
  )
}
