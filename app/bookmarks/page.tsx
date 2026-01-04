'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { getAllSeries, Series } from '@/lib/storage'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function BookmarksPage() {
  const { user, userData, loading } = useAuth()
  const [bookmarkedSeries, setBookmarkedSeries] = useState<Series[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userData?.bookmarks) {
      const allSeries = getAllSeries()
      const bookmarked = allSeries.filter(s => userData.bookmarks.includes(s.id))
      setBookmarkedSeries(bookmarked)
    }
  }, [userData])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-2 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mt-4">My Bookmarks</h1>
            <p className="text-gray-400 mt-2">Your saved series and stories</p>
          </motion.div>

          {bookmarkedSeries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-6xl mb-6 block">📚</span>
              <h2 className="text-2xl font-semibold text-white mb-2">No bookmarks yet</h2>
              <p className="text-gray-400 mb-6">Start exploring and save your favorite series!</p>
              <Link href="/#series">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-violet-500 rounded-full text-white font-medium"
                >
                  Browse Series
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedSeries.map((series, index) => (
                <motion.div
                  key={series.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/series/${series.id}`}>
                    <div className="glass rounded-2xl p-6 hover:border-violet-500/30 border border-white/5 transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-4xl">{series.icon || '📖'}</span>
                        <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                          {series.chapters.length} chapters
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {series.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-2 line-clamp-2">{series.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
