'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSeries, Series, Chapter } from '@/lib/storage'

export default function AudiobooksPage() {
  const [audiobooks, setAudiobooks] = useState<{series: Series, chapter: Chapter}[]>([])
  const [isPlaying, setIsPlaying] = useState<string | null>(null)

  useEffect(() => {
    const allSeries = getAllSeries()
    const allAudiobooks: {series: Series, chapter: Chapter}[] = []
    
    allSeries.forEach(series => {
      series.chapters.forEach(chapter => {
        if (chapter.type === 'audiobook') {
          allAudiobooks.push({ series, chapter })
        }
      })
    })
    
    setAudiobooks(allAudiobooks)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0a0f14] to-[#0a0a0f]" />
        <motion.div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-fuchsia-500/10 to-transparent rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Music note particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl text-pink-500/20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-8"
          >
            <motion.div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(236, 72, 153, 0.3)',
                  '0 0 40px rgba(236, 72, 153, 0.5)',
                  '0 0 20px rgba(236, 72, 153, 0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span 
                className="text-5xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🎧
              </motion.span>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-pink-300 via-fuchsia-400 to-rose-300 bg-clip-text text-transparent animate-gradient-x">
              Audiobooks
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Listen to professionally narrated fan fiction stories. 
            Immerse yourself in your favorite universes.
          </motion.p>

          {/* Waveform Animation */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-end justify-center gap-1 h-12 mt-8"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-pink-500 to-fuchsia-500 rounded-full"
                animate={{
                  height: [10, Math.random() * 30 + 10, 10],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Audiobooks Grid */}
      <section className="relative z-10 py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {audiobooks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <motion.span 
                className="text-8xl mb-6 block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🎵
              </motion.span>
              <h3 className="text-2xl font-semibold text-white mb-3">No Audiobooks Yet</h3>
              <p className="text-gray-400 mb-6">Audiobooks will appear here once they&apos;re added</p>
              <Link href="/browse">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-medium"
                >
                  Browse Stories Instead
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {audiobooks.map(({ series, chapter }, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link href={`/series/${series.id}`}>
                    <div className="relative p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all overflow-hidden">
                      {/* Playing indicator */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10 flex items-center gap-4">
                        <motion.div 
                          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/20 flex items-center justify-center flex-shrink-0"
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                        >
                          {series.image ? (
                            <img src={series.image} alt={series.title} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span className="text-3xl">🎧</span>
                          )}
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors truncate">
                            {chapter.title}
                          </h3>
                          <p className="text-gray-400 text-sm truncate">{series.title}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 rounded-full bg-pink-500/10 text-pink-300 text-xs">
                              Audiobook
                            </span>
                          </div>
                        </div>
                        
                        <motion.div 
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-pink-500/25"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="text-white text-xl ml-1">▶</span>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
