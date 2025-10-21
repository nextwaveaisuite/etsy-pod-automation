import '../globals.css'
import Sidebar from './components/Sidebar'
import Header from './components/Header'

export const metadata = {
  title: 'Etsy Automate Admin Console',
  description: 'Admin management for Etsy POD Automation Platform',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#0b1120] text-white">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </main>
      </body>
    </html>
  )
}
