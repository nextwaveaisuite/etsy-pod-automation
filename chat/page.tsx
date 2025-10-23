'use client'

import React, { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about POD or Etsy.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })
      
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const quickTopics = [
    { label: 'Product Pricing', prompt: 'How should I price my POD products?' },
    { label: 'Niche Trends', prompt: 'What are the trending niches on Etsy right now?' },
    { label: 'SEO Tips', prompt: 'How can I optimize my Etsy listings for SEO?' }
  ]

  return (
    <div className="card" style={{ maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '2rem', height: '100%' }}>
        {/* Sidebar */}
        <div style={{ width: '250px', borderRight: '2px solid var(--border)', paddingRight: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Common Topics</h3>
          {quickTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => setInput(topic.prompt)}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: 'white',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.background = 'var(--bg-tertiary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'white'
              }}
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>🤖 AI Assistant — POD & Etsy Expert</h2>
          
          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '0.75rem', border: '2px solid var(--border)' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ 
                  padding: '0.5rem', 
                  borderRadius: '0.5rem', 
                  background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-tertiary)',
                  color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                  fontWeight: '600',
                  minWidth: '40px',
                  textAlign: 'center'
                }}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div style={{ flex: 1, padding: '0.75rem', background: msg.role === 'user' ? 'var(--bg-tertiary)' : 'white', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div className="spinner"></div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message…"
              style={{ flex: 1 }}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
