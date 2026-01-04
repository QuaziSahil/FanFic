'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserMenu from './UserMenu'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = ['Home', 'Series', 'Audiobooks', 'About']

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-violet-400 text-sm">✦</span>
            </motion.div>
            <span className="text-xl font-semibold tracking-tight text-hover-glow">FanFic</span>
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

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
        >
          <span className="w-5 h-0.5 bg-gray-400 rounded-full" />
          <span className="w-5 h-0.5 bg-gray-400 rounded-full" />
        </motion.button>
      </div>
    </motion.nav>
  )
}
