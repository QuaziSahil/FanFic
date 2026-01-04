'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = ['Home', 'Series', 'Audiobooks', 'About']

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 md:gap-3 cursor-pointer group"
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20"
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-violet-400 text-sm">✦</span>
              </motion.div>
              <span className="text-lg md:text-xl font-semibold tracking-tight text-hover-glow">FanFic</span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item}
                href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                className="text-gray-400 text-sm font-medium text-hover-underline cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                {item}
              </motion.a>
            ))}
            <UserMenu />
          </div>

          {/* Mobile: User Menu + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <UserMenu />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg"
            >
              <motion.span 
                animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 4 : 0 }}
                className="w-5 h-0.5 bg-gray-400 rounded-full origin-center"
              />
              <motion.span 
                animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
                className="w-5 h-0.5 bg-gray-400 rounded-full"
              />
              <motion.span 
                animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -4 : 0 }}
                className="w-5 h-0.5 bg-gray-400 rounded-full origin-center"
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
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[70px] left-4 right-4 glass rounded-2xl p-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item}
                    href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-violet-400">
                      {item === 'Home' && '🏠'}
                      {item === 'Series' && '📚'}
                      {item === 'Audiobooks' && '🎧'}
                      {item === 'About' && 'ℹ️'}
                    </span>
                    <span className="font-medium">{item}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
