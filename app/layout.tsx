export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto", padding: 16 }}>
          <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
            <img src="/avatar-500.png" alt="logo" width={40} height={40} />
            <h1 style={{ fontSize: 22, fontWeight: 700 }}>Etsy POD Builder — AU</h1>
            <nav style={{ marginLeft: "auto", display: "flex", gap: 12, fontSize: 14 }}>
              <a href="/">Basic</a>
              <a href="/dashboard">Auto</a>
              <a href="/smart">Smart 🧠</a>
              <a href="/library">Library 🖼️</a>
              <a href="/editor">Editor ✏️</a>
              <a href="/planners">Planners 📋</a>
              <a href="/opportunities">Opportunities 🍎</a>
              <a href="/analytics">Analytics 📊</a>
              <a href="/chat">AI Chat 🤖</a>
              <a href="/pricing">Pricing 💎</a>
              <a href="/admin">Admin ⚙️</a>
              <a href="/settings">Settings</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
