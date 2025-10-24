'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getCurrentUser, isOwner } from '@/lib/auth'

export default function NavigationNew() {
  const user = getCurrentUser()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  return (
    <nav style={{
      display: 'flex',
      gap: '0.5rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {/* Dashboard Dropdown */}
      <DropdownMenu
        label="Dashboard"
        icon="📊"
        active={activeDropdown === 'dashboard'}
        onToggle={() => toggleDropdown('dashboard')}
        items={[
          { href: '/', label: 'Basic', icon: '📦' },
          { href: '/dashboard', label: 'Auto', icon: '⚡' },
          { href: '/smart', label: 'Smart', icon: '🧠' },
        ]}
      />

      {/* Products Dropdown */}
      <DropdownMenu
        label="Products"
        icon="🎨"
        active={activeDropdown === 'products'}
        onToggle={() => toggleDropdown('products')}
        items={[
          { href: '/library', label: 'Image Library', icon: '🖼️' },
          { href: '/editor', label: 'Image Editor', icon: '✏️' },
          { href: '/planners', label: 'Planners', icon: '📋' },
          { href: '/opportunities', label: 'Opportunities', icon: '🍎' },
        ]}
      />

      {/* Social Media Dropdown */}
      <DropdownMenu
        label="Social"
        icon="🚀"
        active={activeDropdown === 'social'}
        onToggle={() => toggleDropdown('social')}
        items={[
          { href: '/social', label: 'Social Hub', icon: '🚀' },
          { href: '/traffic', label: 'Traffic Analytics', icon: '📈' },
        ]}
      />

      {/* Analytics */}
      <NavLink href="/analytics" label="Analytics" icon="📊" />

      {/* AI Chat */}
      <NavLink href="/chat" label="AI Chat" icon="🤖" />

      {/* Pricing */}
      <NavLink href="/pricing" label="Pricing" icon="💎" />

      {/* User Menu Dropdown */}
      <DropdownMenu
        label="Account"
        icon="👤"
        active={activeDropdown === 'account'}
        onToggle={() => toggleDropdown('account')}
        items={[
          { href: '/settings', label: 'Settings', icon: '⚙️' },
          ...(isOwner(user) ? [
            { href: '/admin', label: 'Admin Console', icon: '🔐' }
          ] : [])
        ]}
        align="right"
      />
    </nav>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon?: string }) {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link 
      href={href}
      style={{
        padding: '0.625rem 1rem',
        borderRadius: '0.5rem',
        fontWeight: '700',
        fontSize: '0.95rem',
        color: isHovered ? '#3b82f6' : '#1e293b',
        textDecoration: 'none',
        transition: 'all 0.2s',
        border: `2px solid ${isHovered ? '#3b82f6' : 'transparent'}`,
        backgroundColor: isHovered ? '#f1f5f9' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </Link>
  )
}

function DropdownMenu({ 
  label, 
  icon, 
  items, 
  active, 
  onToggle,
  align = 'left'
}: { 
  label: string
  icon: string
  items: { href: string; label: string; icon: string }[]
  active: boolean
  onToggle: () => void
  align?: 'left' | 'right'
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '0.625rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: '700',
          fontSize: '0.95rem',
          color: isHovered || active ? '#3b82f6' : '#1e293b',
          backgroundColor: isHovered || active ? '#f1f5f9' : 'transparent',
          border: `2px solid ${isHovered || active ? '#3b82f6' : 'transparent'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{icon}</span>
        <span>{label}</span>
        <span style={{ 
          fontSize: '0.75rem',
          transform: active ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s'
        }}>
          ▼
        </span>
      </button>

      {active && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          [align]: 0,
          backgroundColor: 'white',
          border: '3px solid #e2e8f0',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          minWidth: '200px',
          zIndex: 100,
          padding: '0.5rem'
        }}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onToggle()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9'
                e.currentTarget.style.color = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#1e293b'
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

