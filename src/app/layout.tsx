import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PALETTO - Digital Business Cards',
  description: 'PALETTO 팀의 디지털 명함 컬렉션',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen animated-gradient">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 glass">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <a href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold gradient-text">PALETTO</span>
                  </a>
                  <a
                    href="/admin"
                    className="text-sm text-paletto-sky-dark/60 hover:text-paletto-sky-dark transition-colors"
                  >
                    관리자
                  </a>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="pt-16">
              {children}
            </main>

            {/* Footer */}
            <footer className="py-8 text-center text-paletto-sky-dark/60">
              <p className="text-sm">© 2024 PALETTO Team. All rights reserved.</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
