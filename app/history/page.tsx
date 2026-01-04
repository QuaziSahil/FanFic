'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { getAllSeries, Series, Chapter } from '@/lib/storage'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface HistoryItem {
  seriesId: string
  chapterId: string
  timestamp: Date
  series?: Series
  chapter?: Chapter
}

export default function HistoryPage() {
  const { user, userData, loading } = useAuth()
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userData?.readingHistory) {
      const allSeries = getAllSeries()
      const enrichedHistory = userData.readingHistory.map(item => {
        const series = allSeries.find(s => s.id === item.seriesId)
        const chapter = series?.chapters.find(c => c.id === item.chapterId)
        return { ...item, series, chapter }
      }).filter(item => item.series && item.chapter)
      setHistoryItems(enrichedHistory)
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

  const formatDate = (date: Date) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
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
            <h1 className="text-4xl font-bold text-white mt-4">Reading History</h1>
            <p className="text-gray-400 mt-2">Your recently read chapters</p>
          </motion.div>

          {historyItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-6xl mb-6 block">📖</span>
              <h2 className="text-2xl font-semibold text-white mb-2">No reading history</h2>
              <p className="text-gray-400 mb-6">Start reading to build your history!</p>
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
            <div className="space-y-4">
              {historyItems.map((item, index) => (
                <motion.div
                  key={`${item.chapterId}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/read/${item.seriesId}/${item.chapterId}`}>
                    <div className="glass rounded-xl p-4 hover:border-violet-500/30 border border-white/5 transition-all group cursor-pointer flex items-center gap-4">
                      <span className="text-3xl">{item.series?.icon || '📖'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-violet-300 transition-colors truncate">
                          {item.chapter?.title}
                        </p>
                        <p className="text-gray-500 text-sm truncate">{item.series?.title}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">{formatDate(item.timestamp)}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
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
