import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CollegeFinder India',
  description: 'Discover and compare top colleges in India',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-blue-600">🎓 CollegeFinder</a>
          <div className="flex gap-6">
            <a href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium">Colleges</a>
            <a href="/compare" className="text-gray-600 hover:text-blue-600 font-medium">Compare</a>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}