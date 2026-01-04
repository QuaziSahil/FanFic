import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FanFic - Your Gateway to Fan Fiction & Audiobooks',
  description: 'Discover amazing fan fiction stories and audiobooks from your favorite series',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="animated-bg">
          {/* Floating particles will be added via JS */}
        </div>
        {children}
      </body>
    </html>
  )
}
