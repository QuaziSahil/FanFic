'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { getAllSeries, Series, Chapter } from '@/lib/storage'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ContinueItem {
  seriesId: string
  chapterId: string
  progress: number
  series?: Series
  chapter?: Chapter
  nextChapter?: Chapter
}

export default function ContinueReadingPage() {
  const { user, userData, loading } = useAuth()
  const [continueItems, setContinueItems] = useState<ContinueItem[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (userData?.readingProgress) {
      const allSeries = getAllSeries()
      const items: ContinueItem[] = []
      
      Object.entries(userData.readingProgress).forEach(([chapterId, progress]) => {
        if (progress < 100) {
          for (const series of allSeries) {
            const chapterIndex = series.chapters.findIndex(c => c.id === chapterId)
            if (chapterIndex !== -1) {
              const chapter = series.chapters[chapterIndex]
              const nextChapter = series.chapters[chapterIndex + 1]
              items.push({
                seriesId: series.id,
                chapterId,
                progress,
                series,
                chapter,
                nextChapter
              })
              break
            }
          }
        }
      })
      
      setContinueItems(items.sort((a, b) => b.progress - a.progress))
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
            <h1 className="text-4xl font-bold text-white mt-4">Continue Reading</h1>
            <p className="text-gray-400 mt-2">Pick up where you left off</p>
          </motion.div>

          {continueItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-6xl mb-6 block">▶️</span>
              <h2 className="text-2xl font-semibold text-white mb-2">Nothing to continue</h2>
              <p className="text-gray-400 mb-6">Start reading a story and your progress will be saved!</p>
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
              {continueItems.map((item, index) => (
                <motion.div
                  key={item.chapterId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/read/${item.seriesId}/${item.chapterId}`}>
                    <div className="glass rounded-2xl p-6 hover:border-violet-500/30 border border-white/5 transition-all group cursor-pointer">
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{item.series?.icon || '📖'}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white group-hover:text-violet-300 transition-colors">
                            {item.chapter?.title}
                          </h3>
                          <p className="text-gray-500 text-sm mt-1">{item.series?.title}</p>
                          
                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Progress</span>
                              <span className="text-violet-400">{Math.round(item.progress)}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="self-center"
                        >
                          <svg className="w-6 h-6 text-gray-500 group-hover:text-violet-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                      </div>
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
