'use client'

import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen 
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center border border-pink-500/30 group-hover:border-pink-500/50 transition-colors"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
              >
                <motion.span 
                  className="text-pink-400 text-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✦
                </motion.span>
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                FanFic
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 rounded-full border border-pink-500/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </motion.div>
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
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10"
            >
              <motion.span 
                animate={{ 
                  rotate: mobileMenuOpen ? 45 : 0, 
                  y: mobileMenuOpen ? 6 : 0,
                  backgroundColor: mobileMenuOpen ? '#ec4899' : '#9ca3af'
                }}
                className="w-5 h-0.5 rounded-full origin-center"
              />
              <motion.span 
                animate={{ 
                  opacity: mobileMenuOpen ? 0 : 1,
                  scaleX: mobileMenuOpen ? 0 : 1
                }}
                className="w-5 h-0.5 bg-gray-400 rounded-full"
              />
              <motion.span 
                animate={{ 
                  rotate: mobileMenuOpen ? -45 : 0, 
                  y: mobileMenuOpen ? -6 : 0,
                  backgroundColor: mobileMenuOpen ? '#ec4899' : '#9ca3af'
                }}
                className="w-5 h-0.5 rounded-full origin-center"
              />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-[72px] left-4 right-4 bg-gradient-to-br from-gray-900/95 to-black/95 rounded-2xl p-4 border border-pink-500/20 shadow-2xl shadow-pink-500/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${
                          isActive 
                            ? 'bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30' 
                            : 'hover:bg-white/5'
                        }`}
                      >
                        <motion.span 
                          className="text-xl"
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                        >
                          {item.icon}
                        </motion.span>
                        <span className={`font-medium ${isActive ? 'text-pink-300' : 'text-gray-300'}`}>
                          {item.name}
                        </span>
                        {isActive && (
                          <motion.span 
                            className="ml-auto text-pink-400 text-xs"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ●
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
              
              {/* Mobile menu footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10 text-center"
              >
                <p className="text-xs text-gray-500">
                  Made with <span className="text-pink-400">♡</span> for fans
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
