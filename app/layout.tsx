import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from './components/Navigation'
import './globals.css'

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
            borderBottom: '3px solid #e2e8f0',
            boxShadow: '0 2px 8px 0 rgb(0 0 0 / 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}>
            <div className="container" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              {/* Logo */}
              <Link href="/" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textDecoration: 'none'
              }}>
                <Image 
                  src="/logo.png" 
                  alt="Etsy Automate Logo" 
                  width={56} 
                  height={56}
                  style={{ borderRadius: '0.75rem', border: '3px solid #e2e8f0' }}
                />
                <div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '900',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.25rem',
                    letterSpacing: '0.02em'
                  }}>
                    ETSY AUTOMATE
                  </h1>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#64748b',
                    fontWeight: '700',
                    marginBottom: '0',
                    letterSpacing: '0.03em'
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
            padding: '2.5rem 0'
          }}>
            <div className="container">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer style={{
            backgroundColor: '#1e293b',
            color: 'white',
            padding: '2.5rem 0',
            marginTop: 'auto',
            borderTop: '4px solid #3b82f6'
          }}>
            <div className="container" style={{
              textAlign: 'center'
            }}>
              <p style={{
                fontWeight: '800',
                marginBottom: '0.75rem',
                color: 'white',
                fontSize: '1.1rem',
                letterSpacing: '0.02em'
              }}>
                © 2025 Etsy Automate. All rights reserved.
              </p>
              <p style={{
                fontSize: '0.95rem',
                color: '#94a3b8',
                marginBottom: '0',
                fontWeight: '600'
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
