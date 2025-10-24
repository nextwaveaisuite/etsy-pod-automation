'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/revenue', label: 'Revenue', icon: '💰' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>ETSY AUTOMATE</h2>
        <p>Admin Console</p>
      </div>
      
      <nav className="admin-nav">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

