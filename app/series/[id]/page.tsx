'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import { getSeriesById, Series, Chapter } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'
import { toggleBookmark, addToReadingHistory, updateReadingProgress } from '@/lib/firebase'

type TabType = 'all' | 'stories' | 'audiobooks'
type ReadingTheme = 'night' | 'day' | 'sepia' | 'ocean' | 'forest' | 'rose'
type FontSize = 'sm' | 'md' | 'lg' | 'xl'
type FontFamily = 'serif' | 'sans' | 'mono'

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
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif')
  const [showSettings, setShowSettings] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { user, userData, refreshUserData } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const data = getSeriesById(seriesId)
    setSeries(data)
  }, [seriesId])

  // Check if series is bookmarked
  useEffect(() => {
    if (userData?.bookmarks) {
      setIsBookmarked(userData.bookmarks.includes(seriesId))
    }
  }, [userData, seriesId])

  // Track reading progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    
    const element = contentRef.current
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    
    setScrollProgress(progress)
    
    // Update progress in Firebase
    if (user && selectedStory) {
      const roundedProgress = Math.round(progress / 10) * 10
      updateReadingProgress(user.uid, selectedStory.id, roundedProgress)
    }

    // Auto-hide controls on scroll (mobile reading experience)
    setShowControls(true)
    if (hideControlsTimeout.current) {
      clearTimeout(hideControlsTimeout.current)
    }
    hideControlsTimeout.current = setTimeout(() => {
      if (!showSettings) {
        setShowControls(false)
      }
    }, 2000)
  }, [user, selectedStory, showSettings])

  // Toggle controls on tap (mobile)
  const handleContentTap = () => {
    if (window.innerWidth < 768) {
      setShowControls(!showControls)
      if (!showControls) {
        if (hideControlsTimeout.current) {
          clearTimeout(hideControlsTimeout.current)
        }
        hideControlsTimeout.current = setTimeout(() => {
          if (!showSettings) {
            setShowControls(false)
          }
        }, 3000)
      }
    }
  }

  // Add to reading history when opening a story
  useEffect(() => {
    if (user && selectedStory && series) {
      addToReadingHistory(user.uid, series.id, selectedStory.id)
    }
  }, [user, selectedStory, series])

  const handleToggleBookmark = async () => {
    if (!user) return
    setBookmarking(true)
    const result = await toggleBookmark(user.uid, seriesId)
    setIsBookmarked(result)
    await refreshUserData()
    setBookmarking(false)
  }

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                  <span className="gradient-text">{series.title}</span>
                </h1>
                {/* Bookmark Button */}
                {user && (
                  <motion.button
                    onClick={handleToggleBookmark}
                    disabled={bookmarking}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                      isBookmarked 
                        ? 'bg-violet-500/30 text-violet-300 border border-violet-500/50' 
                        : 'bg-white/5 text-gray-500 hover:text-violet-300 border border-white/10 hover:border-violet-500/30'
                    }`}
                  >
                    {bookmarking ? (
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : isBookmarked ? '🔖' : '📑'}
                  </motion.button>
                )}
              </div>
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

      {/* Story Modal - Fullscreen Reading Experience */}
      {selectedStory && (
        <div 
          className={`fixed inset-0 z-50 overflow-hidden reading-theme-${readingTheme} reading-size-${fontSize} reading-font-${fontFamily}`}
        >
          {/* Progress Bar - Always visible at top */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-black/20 z-[60]">
            <div 
              className="h-full bg-violet-500 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Header - Auto-hide on mobile scroll */}
          <div 
            className={`fixed top-0 left-0 right-0 z-[55] bg-inherit border-b border-current/10 safe-area-top transition-transform duration-300 ${showControls ? 'translate-y-0' : '-translate-y-full'}`}
          >
            <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button 
                  onClick={() => setSelectedStory(null)} 
                  className="w-10 h-10 rounded-full bg-current/5 flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm md:text-base font-semibold truncate">{selectedStory.title}</h2>
                  <p className="text-xs opacity-50 truncate">{series?.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-95 ${showSettings ? 'bg-violet-500/30 text-violet-300' : 'bg-current/5'}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Settings Panel - Slides down */}
          {showSettings && (
            <div
              className="fixed top-[60px] left-0 right-0 z-[54] bg-inherit border-b border-current/10 safe-area-top"
            >
                  <div className="p-4 space-y-4 max-w-lg mx-auto">
                    {/* Theme Selection */}
                    <div>
                      <p className="text-xs opacity-50 mb-2 uppercase tracking-wider">Theme</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                      {themeOptions.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => setReadingTheme(theme.id)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all active:scale-95 ${
                            readingTheme === theme.id 
                              ? 'bg-violet-500/30 ring-2 ring-violet-500/50' 
                              : 'bg-current/5'
                          }`}
                        >
                          <span className="text-lg">{theme.icon}</span>
                          <span className="opacity-70">{theme.label}</span>
                        </button>
                      ))}
                    </div>
                    </div>

                    {/* Font Size */}
                    <div>
                      <p className="text-xs opacity-50 mb-2 uppercase tracking-wider">Size</p>
                      <div className="flex gap-2">
                        {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => (
                          <button
                            key={size}
                            onClick={() => setFontSize(size)}
                            className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-all active:scale-95 ${
                              fontSize === size 
                                ? 'bg-violet-500/30 ring-2 ring-violet-500/50' 
                                : 'bg-current/5'
                            }`}
                          >
                            <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}>Aa</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div>
                      <p className="text-xs opacity-50 mb-2 uppercase tracking-wider">Font</p>
                      <div className="flex gap-2">
                        {[
                          { id: 'serif', label: 'Serif', sample: 'Aa' },
                          { id: 'sans', label: 'Sans', sample: 'Aa' },
                          { id: 'mono', label: 'Mono', sample: 'Aa' }
                        ].map((font) => (
                          <button
                            key={font.id}
                            onClick={() => setFontFamily(font.id as FontFamily)}
                            className={`flex-1 py-2 rounded-lg flex flex-col items-center gap-1 transition-all active:scale-95 ${
                              fontFamily === font.id 
                                ? 'bg-violet-500/30 ring-2 ring-violet-500/50' 
                                : 'bg-current/5'
                            }`}
                          >
                            <span className={`text-lg ${font.id === 'serif' ? 'font-reading' : font.id === 'mono' ? 'font-mono' : 'font-sans'}`}>{font.sample}</span>
                            <span className="text-xs opacity-70">{font.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Content Area */}
            <div 
              ref={contentRef} 
              onScroll={handleScroll}
              onClick={handleContentTap}
              className="absolute inset-0 overflow-x-hidden overflow-y-auto overscroll-contain pt-16 pb-24 reading-scroll"
            >
              <div className="reader-content px-4 md:px-6 py-6 max-w-full">
                {/* Creator Credit */}
                {selectedStory.creditName && (
                  <div className="mb-8 pb-4 border-b border-current/10 text-center">
                    <p className="text-xs opacity-50 uppercase tracking-wider mb-1">Created by</p>
                    {selectedStory.creditLink ? (
                      <a 
                        href={selectedStory.creditLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 transition-colors font-medium inline-flex items-center gap-1"
                      >
                        {selectedStory.creditName}
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <p className="font-medium">{selectedStory.creditName}</p>
                    )}
                  </div>
                )}
                
                {selectedStory.content ? (
                  <article className="reading-content break-words">
                    <div 
                      dangerouslySetInnerHTML={{ __html: selectedStory.content }}
                    />
                  </article>
                ) : selectedStory.link ? (
                  <iframe 
                    src={selectedStory.link.includes('/preview') ? selectedStory.link : selectedStory.link.replace('/view', '/preview').replace('/edit', '/preview')} 
                    className="w-full h-[80vh] rounded-lg border border-current/10" 
                    allow="autoplay" 
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="opacity-50 mb-6">No content added yet</p>
                    <Link href="/admin">
                      <button className="px-6 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-sm text-violet-300 active:scale-98 transition-transform">
                        Add Link in Admin →
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation - Auto-hide on mobile scroll */}
            <div 
              className={`fixed bottom-0 left-0 right-0 z-[55] bg-inherit border-t border-current/10 safe-area-bottom transition-transform duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}
            >
              {(() => {
                const currentIndex = stories.findIndex(s => s.id === selectedStory.id)
                const prevChapter = currentIndex > 0 ? stories[currentIndex - 1] : null
                const nextChapter = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null
                return (
                  <div className="flex items-center justify-between p-3 md:p-4 gap-2">
                    <button
                      onClick={() => prevChapter && setSelectedStory(prevChapter)}
                      disabled={!prevChapter}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all active:scale-95 ${
                        prevChapter 
                          ? 'bg-current/5 active:bg-current/10' 
                          : 'opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="text-sm font-medium hidden sm:inline">Previous</span>
                    </button>
                    
                    <div className="flex flex-col items-center px-4">
                      <span className="text-xs opacity-50">Chapter</span>
                      <span className="text-sm font-semibold">{currentIndex + 1} / {stories.length}</span>
                    </div>

                    <button
                      onClick={() => nextChapter && setSelectedStory(nextChapter)}
                      disabled={!nextChapter}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all active:scale-95 ${
                        nextChapter 
                          ? 'bg-violet-500/20 active:bg-violet-500/30 text-violet-300' 
                          : 'opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-sm font-medium hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

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
