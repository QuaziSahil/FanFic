'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import UserMenu from './UserMenu'

const navItems = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Browse', href: '/browse', icon: '📚' },
  { name: 'Audiobooks', href: '/audiobooks', icon: '🎧' },
  { name: 'About', href: '/about', icon: '✨' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center border border-pink-500/30 group-hover:border-pink-500/50 transition-colors">
                <span className="text-pink-400 text-lg">✦</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                FanFic
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                  </div>
                </Link>
              )
            })}
            <div className="ml-4 pl-4 border-l border-white/10">
              <UserMenu />
            </div>
          </div>

          {/* Mobile: User Menu + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <UserMenu />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-transform"
            >
              <span className={`w-5 h-0.5 rounded-full transition-all origin-center ${mobileMenuOpen ? 'rotate-45 translate-y-2 bg-pink-500' : 'bg-gray-400'}`} />
              <span className={`w-5 h-0.5 bg-gray-400 rounded-full transition-all ${mobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`w-5 h-0.5 rounded-full transition-all origin-center ${mobileMenuOpen ? '-rotate-45 -translate-y-2 bg-pink-500' : 'bg-gray-400'}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div
            className="absolute top-[72px] left-4 right-4 bg-gradient-to-br from-gray-900/95 to-black/95 rounded-2xl p-4 border border-pink-500/20 shadow-2xl shadow-pink-500/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className={`font-medium ${isActive ? 'text-pink-300' : 'text-gray-300'}`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <span className="ml-auto text-pink-400 text-xs">●</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile menu footer */}
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-gray-500">
                Made with <span className="text-pink-400">♡</span> for fans
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
