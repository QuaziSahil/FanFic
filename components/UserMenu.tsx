'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { signInWithGoogle, logOut } from '@/lib/firebase'
import Image from 'next/image'
import Link from 'next/link'

export default function UserMenu() {
  const { user, userData, loading } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignIn = async () => {
    setSigningIn(true)
    await signInWithGoogle()
    setSigningIn(false)
  }

  const handleSignOut = async () => {
    await logOut()
    setShowMenu(false)
  }

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-violet-500/10 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <motion.button
        onClick={handleSignIn}
        disabled={signingIn}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-5 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium hover:bg-violet-500/20 hover:border-violet-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        {signingIn ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign In
          </>
        )}
      </motion.button>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || 'User'}
            width={40}
            height={40}
            className="rounded-full border-2 border-violet-500/30 hover:border-violet-500/50 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium">
            {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
          </div>
        )}
        {userData && userData.bookmarks.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full text-xs flex items-center justify-center text-white">
            {userData.bookmarks.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl"
          >
            {/* User Info */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium text-lg">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user.displayName}</p>
                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <Link href="/bookmarks" onClick={() => setShowMenu(false)}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group"
                >
                  <span className="text-xl">📚</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">My Bookmarks</p>
                    <p className="text-gray-500 text-xs">{userData?.bookmarks.length || 0} saved</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>

              <Link href="/history" onClick={() => setShowMenu(false)}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group"
                >
                  <span className="text-xl">📖</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">Reading History</p>
                    <p className="text-gray-500 text-xs">{userData?.readingHistory.length || 0} chapters read</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>

              <Link href="/continue-reading" onClick={() => setShowMenu(false)}>
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer group"
                >
                  <span className="text-xl">▶️</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm group-hover:text-white transition-colors">Continue Reading</p>
                    <p className="text-gray-500 text-xs">Pick up where you left</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </Link>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-white/5">
              <motion.button
                onClick={handleSignOut}
                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left group"
              >
                <span className="text-xl">🚪</span>
                <p className="text-gray-400 text-sm group-hover:text-red-400 transition-colors">Sign Out</p>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
