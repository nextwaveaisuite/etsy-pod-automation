'use client'

export default function Header() {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h1>Admin Console</h1>
      </div>
      
      <div className="admin-header-right">
        <div className="admin-user">
          <span>Owner</span>
          <button className="btn-icon">⚙️</button>
        </div>
      </div>
    </header>
  )
}

