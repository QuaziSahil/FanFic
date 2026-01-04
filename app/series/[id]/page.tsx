'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import { getSeriesById, Series, Chapter } from '@/lib/storage'

type TabType = 'all' | 'stories' | 'audiobooks'
type ReadingTheme = 'night' | 'day' | 'sepia' | 'ocean' | 'forest' | 'rose'
type FontSize = 'sm' | 'md' | 'lg' | 'xl'

const themeOptions: { id: ReadingTheme; label: string; bg: string; icon: string }[] = [
  { id: 'night', label: 'Night', bg: '#0a0a0f', icon: '🌙' },
  { id: 'day', label: 'Day', bg: '#fafaf9', icon: '☀️' },
  { id: 'sepia', label: 'Sepia', bg: '#f4ecd8', icon: '📜' },
  { id: 'ocean', label: 'Ocean', bg: '#0f1729', icon: '🌊' },
  { id: 'forest', label: 'Forest', bg: '#0c1a14', icon: '🌲' },
  { id: 'rose', label: 'Rose', bg: '#1a0c14', icon: '🌸' },
]

export default function SeriesPage() {
  const params = useParams()
  const seriesId = params.id as string
  const [series, setSeries] = useState<Series | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStory, setSelectedStory] = useState<Chapter | null>(null)
  const [currentAudiobook, setCurrentAudiobook] = useState<Chapter | null>(null)
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>('night')
  const [fontSize, setFontSize] = useState<FontSize>('md')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const data = getSeriesById(seriesId)
    setSeries(data)
  }, [seriesId])

  if (!series) {
    return (
      <main className="min-h-screen relative flex items-center justify-center">
        <ParticleBackground />
        <div className="text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    )
  }

  const stories = series.chapters.filter(c => c.type === 'story')
  const audiobooks = series.chapters.filter(c => c.type === 'audiobook')
  
  const filteredStories = stories.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredAudiobooks = audiobooks.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const displayStories = activeTab === 'all' || activeTab === 'stories'
  const displayAudiobooks = activeTab === 'all' || activeTab === 'audiobooks'

  return (
    <main className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      
      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <motion.button 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              whileHover={{ x: -3 }} 
              className="flex items-center gap-2 text-gray-500 hover:text-gray-300 mb-8 transition-colors text-sm"
            >
              ← Back to Series
            </motion.button>
          </Link>
          <div className="flex items-start gap-6">
            <motion.div 
              initial={{ scale: 0, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ type: "spring", stiffness: 200 }} 
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center text-4xl flex-shrink-0 overflow-hidden"
            >
              {series.image ? (
                <img src={series.image} alt={series.title} className="w-full h-full object-cover" />
              ) : (
                series.icon
              )}
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                <span className="gradient-text">{series.title}</span>
              </h1>
              <p className="text-gray-500">{series.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-400">
                <span>📖 {stories.length} stories</span>
                <span>🎧 {audiobooks.length} audiobooks</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-6 sticky top-16 z-40 glass">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-1 p-1 bg-white/5 rounded-full">
            {[{ id: 'all', label: 'All' }, { id: 'stories', label: 'Stories' }, { id: 'audiobooks', label: 'Audiobooks' }].map((tab) => (
              <motion.button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as TabType)} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full md:w-64 px-4 py-2 pl-9 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-violet-500/30 transition-colors" 
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">◎</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="space-y-8"
            >
              {/* Stories Section */}
              {displayStories && filteredStories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <span className="text-violet-400/60">◈</span> Stories
                  </h3>
                  <div className="grid gap-4">
                    {filteredStories.map((story, index) => (
                      <motion.div
                        key={story.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedStory(story)}
                        className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-violet-500/20 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center">
                              <span className="text-xl">📖</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-200 group-hover:text-violet-300 transition-colors">{story.title}</h4>
                              <p className="text-xs text-gray-500">
                                {story.link ? '✓ Content linked' : 'No content yet'}
                              </p>
                            </div>
                          </div>
                          <span className="text-gray-500 group-hover:text-violet-400 transition-colors">→</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audiobooks Section */}
              {displayAudiobooks && filteredAudiobooks.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <span className="text-indigo-400/60">♫</span> Audiobooks
                  </h3>
                  <div className="grid gap-4">
                    {filteredAudiobooks.map((audio, index) => (
                      <motion.div
                        key={audio.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03, duration: 0.2 }}
                        whileHover={{ x: 4 }}
                        onClick={() => setCurrentAudiobook(audio)}
                        className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-indigo-500/20 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/10 flex items-center justify-center">
                              <span className="text-xl">🎧</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-200 group-hover:text-indigo-300 transition-colors">{audio.title}</h4>
                              <p className="text-xs text-gray-500">
                                {audio.link ? '✓ Audio linked' : 'No audio yet'}
                              </p>
                            </div>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/20 flex items-center justify-center text-violet-300 hover:bg-violet-500/30 transition-all"
                          >
                            ▶
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredStories.length === 0 && filteredAudiobooks.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-center py-20"
                >
                  <span className="text-4xl mb-4 block opacity-50">◎</span>
                  <p className="text-gray-500 mb-4">No content yet</p>
                  <Link href="/admin">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-sm text-violet-300 hover:bg-violet-500/30 transition-all"
                    >
                      Add Content →
                    </motion.button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
            onClick={() => setSelectedStory(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()} 
              className={`w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 overflow-hidden flex flex-col reading-theme-${readingTheme} reading-size-${fontSize}`}
            >
              {/* Header with theme controls - Always dark */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0f] flex-shrink-0">
                <h2 className="text-lg font-semibold truncate pr-4 text-white">{selectedStory.title}</h2>
                <div className="flex items-center gap-2">
                  {/* Settings Toggle */}
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors ${showSettings ? 'bg-violet-500/30 text-violet-300' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                  >
                    ⚙
                  </motion.button>
                  {/* Close */}
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={() => setSelectedStory(null)} 
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </motion.button>
                </div>
              </div>

              {/* Settings Panel - Always dark regardless of theme */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-b border-white/10 bg-[#0a0a0f] flex-shrink-0"
                  >
                    <div className="p-4 space-y-4">
                      {/* Theme Selection */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Theme</p>
                        <div className="flex flex-wrap gap-2">
                          {themeOptions.map((theme) => (
                            <motion.button
                              key={theme.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setReadingTheme(theme.id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                                readingTheme === theme.id 
                                  ? 'bg-violet-500/40 border-violet-500/60 text-white' 
                                  : 'bg-white/10 border-white/20 text-gray-300 hover:text-white hover:bg-white/15'
                              } border`}
                            >
                              <span>{theme.icon}</span>
                              <span>{theme.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Font Size */}
                      <div>
                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Font Size</p>
                        <div className="flex gap-2">
                          {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => (
                            <motion.button
                              key={size}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setFontSize(size)}
                              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all border ${
                                fontSize === size 
                                  ? 'bg-violet-500/40 border-violet-500/60 text-white' 
                                  : 'bg-white/10 border-white/20 text-gray-300 hover:text-white hover:bg-white/15'
                              }`}
                            >
                              <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}>A</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Creator Credit */}
                {selectedStory.creditName && (
                  <div className="mb-6 pb-4 border-b border-current/10">
                    <p className="text-xs opacity-50 uppercase tracking-wider mb-1">Created by</p>
                    {selectedStory.creditLink ? (
                      <a 
                        href={selectedStory.creditLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
                      >
                        {selectedStory.creditName} ↗
                      </a>
                    ) : (
                      <p className="font-medium">{selectedStory.creditName}</p>
                    )}
                  </div>
                )}
                
                {selectedStory.content ? (
                  <div className="reader-content">
                    <div 
                      className="reading-content"
                      dangerouslySetInnerHTML={{ __html: selectedStory.content }}
                    />
                    {/* Next/Previous Chapter Navigation */}
                    {(() => {
                      const currentIndex = stories.findIndex(s => s.id === selectedStory.id)
                      const prevChapter = currentIndex > 0 ? stories[currentIndex - 1] : null
                      const nextChapter = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null
                      return (prevChapter || nextChapter) ? (
                        <div className="mt-12 pt-8 border-t border-current/10">
                          <div className="flex items-center justify-between gap-4">
                            {prevChapter ? (
                              <motion.button
                                whileHover={{ scale: 1.02, x: -4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedStory(prevChapter)}
                                className="flex items-center gap-3 px-5 py-3 bg-black/20 border border-current/20 rounded-xl text-left hover:bg-black/30 transition-all group"
                              >
                                <span className="text-xl opacity-60 group-hover:opacity-100">←</span>
                                <div>
                                  <p className="text-xs opacity-60 uppercase tracking-wider">Previous</p>
                                  <p className="font-medium">{prevChapter.title}</p>
                                </div>
                              </motion.button>
                            ) : <div />}
                            {nextChapter ? (
                              <motion.button
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedStory(nextChapter)}
                                className="flex items-center gap-3 px-5 py-3 bg-violet-500/20 border border-violet-500/30 rounded-xl text-right hover:bg-violet-500/30 transition-all group ml-auto"
                              >
                                <div>
                                  <p className="text-xs opacity-60 uppercase tracking-wider">Next Chapter</p>
                                  <p className="font-medium">{nextChapter.title}</p>
                                </div>
                                <span className="text-xl opacity-60 group-hover:opacity-100">→</span>
                              </motion.button>
                            ) : null}
                          </div>
                        </div>
                      ) : null
                    })()}
                  </div>
                ) : selectedStory.link ? (
                  <iframe 
                    src={selectedStory.link.includes('/preview') ? selectedStory.link : selectedStory.link.replace('/view', '/preview').replace('/edit', '/preview')} 
                    className="w-full h-[600px] rounded-lg border border-white/10" 
                    allow="autoplay" 
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-400 mb-6">No content link added yet</p>
                    <Link href="/admin">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="px-6 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-sm text-violet-300"
                      >
                        Add Link in Admin →
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Player */}
      <AnimatePresence>
        {currentAudiobook && currentAudiobook.link && (
          <AudioPlayer 
            audioUrl={currentAudiobook.link} 
            title={currentAudiobook.title} 
            author={series.title} 
            coverEmoji="🎧" 
            onClose={() => setCurrentAudiobook(null)} 
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  )
}
