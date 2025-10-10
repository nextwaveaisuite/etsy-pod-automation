import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from './components/Navigation'

export const metadata: Metadata = {
  title: 'Etsy Automate - POD Simplified',
  description: 'Professional Print-on-Demand automation platform for Etsy sellers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <header style={{
            backgroundColor: 'white',
            borderBottom: '2px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}>
            <div className="container" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              {/* Logo */}
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                textDecoration: 'none'
              }}>
                <Image 
                  src="/logo.png" 
                  alt="Etsy Automate Logo" 
                  width={48} 
                  height={48}
                  style={{ borderRadius: '0.5rem' }}
                />
                <div>
                  <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0'
                  }}>
                    ETSY AUTOMATE
                  </h1>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#64748b',
                    fontWeight: '600',
                    marginBottom: '0'
                  }}>
                    Print-on-Demand Simplified
                  </p>
                </div>
              </Link>

              {/* Navigation */}
              <Navigation />
            </div>
          </header>

          {/* Main Content */}
          <main style={{
            flex: 1,
            padding: '2rem 0'
          }}>
            <div className="container">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer style={{
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '2rem 0',
            marginTop: 'auto'
          }}>
            <div className="container" style={{
              textAlign: 'center'
            }}>
              <p style={{
                fontWeight: '600',
                marginBottom: '0.5rem',
                color: 'white'
              }}>
                © 2025 Etsy Automate. All rights reserved.
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                marginBottom: '0'
              }}>
                Professional POD automation for Etsy sellers
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
