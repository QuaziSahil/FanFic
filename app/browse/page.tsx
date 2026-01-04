'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSeriesAsync, Series } from '@/lib/storage'

export default function BrowsePage() {
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'stories' | 'audiobooks'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadSeries = async () => {
      const data = await getAllSeriesAsync()
      setSeriesData(data)
      setLoading(false)
    }
    loadSeries()
  }, [])

  const filteredSeries = seriesData.filter(series => 
    series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    series.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0f0a14] to-[#0a0a0f]" />
        <motion.div 
          className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/10 to-fuchsia-500/5 rounded-full blur-[150px]"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-500/10 to-pink-500/5 rounded-full blur-[120px]"
          animate={{ 
            scale: [1.1, 1, 1.1],
            rotate: [0, -10, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 mb-6"
            >
              <motion.span 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                ✦
              </motion.span>
              <span className="text-pink-300 text-sm font-medium">Discover Amazing Stories</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <motion.span 
                className="inline-block bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200%' }}
              >
                Browse
              </motion.span>{' '}
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent animate-gradient-x">
                Collection
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Explore our curated collection of fan fiction stories and audiobooks
            </p>
          </motion.div>

          {/* Search & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col md:flex-row gap-4 items-center justify-center mb-12"
          >
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 text-white placeholder-gray-500 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            </div>
            
            <div className="flex gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
              {(['all', 'stories', 'audiobooks'] as const).map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setFilter(type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-5 py-2.5 rounded-xl font-medium text-sm capitalize transition-all ${
                    filter === type 
                      ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg shadow-pink-500/25' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Series Grid */}
      <section className="relative z-10 py-12 px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {filteredSeries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-xl font-semibold text-white mb-2">No Series Found</h3>
              <p className="text-gray-400">Try adjusting your search or add content in the admin panel</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeries.map((series, index) => {
                const storiesCount = series.chapters.filter(c => c.type === 'story').length
                const audiobooksCount = series.chapters.filter(c => c.type === 'audiobook').length
                
                if (filter === 'stories' && storiesCount === 0) return null
                if (filter === 'audiobooks' && audiobooksCount === 0) return null
                
                return (
                  <motion.div
                    key={series.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Link href={`/series/${series.id}`}>
                      <div className="relative h-full p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all overflow-hidden">
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Content */}
                        <div className="relative z-10">
                          <div className="flex items-start gap-4 mb-4">
                            <motion.div 
                              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/20 flex items-center justify-center text-3xl overflow-hidden flex-shrink-0"
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.5 }}
                            >
                              {series.image ? (
                                <img src={series.image} alt={series.title} className="w-full h-full object-cover" />
                              ) : (
                                series.icon
                              )}
                            </motion.div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-lg text-white group-hover:text-pink-300 transition-colors line-clamp-2">
                                {series.title}
                              </h3>
                            </div>
                          </div>
                          
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {series.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-300">
                              📖 {storiesCount} stories
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fuchsia-500/10 text-fuchsia-300">
                              🎧 {audiobooksCount} audio
                            </span>
                          </div>
                        </div>
                        
                        {/* Arrow indicator */}
                        <motion.div 
                          className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-pink-500/25"
                          initial={{ x: -10 }}
                          whileHover={{ x: 0 }}
                        >
                          <span className="text-white">→</span>
                        </motion.div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
