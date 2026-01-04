'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AudioPlayer from '@/components/AudioPlayer'
import { getSeriesByIdAsync, Series, Chapter } from '@/lib/storage'
import { useAuth } from '@/contexts/AuthContext'
import { toggleBookmark, addToReadingHistory, updateReadingProgress } from '@/lib/firebase'

type TabType = 'all' | 'stories' | 'audiobooks'
type ReadingTheme = 'night' | 'day' | 'sepia' | 'ocean' | 'forest' | 'rose'
type FontSize = 'sm' | 'md' | 'lg' | 'xl'
type FontFamily = 'serif' | 'sans' | 'mono'

const themeOptions: { id: ReadingTheme; label: string; icon: string }[] = [
  { id: 'night', label: 'Night', icon: '🌙' },
  { id: 'day', label: 'Day', icon: '☀️' },
  { id: 'sepia', label: 'Sepia', icon: '📜' },
  { id: 'ocean', label: 'Ocean', icon: '🌊' },
  { id: 'forest', label: 'Forest', icon: '🌲' },
  { id: 'rose', label: 'Rose', icon: '🌸' },
]

export default function SeriesPage() {
  const params = useParams()
  const seriesId = params.id as string
  const [series, setSeries] = useState<Series | null>(null)
  const [loading, setLoading] = useState(true)
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
  const [scrollProgress, setScrollProgress] = useState(0)
  const { user, userData, refreshUserData } = useAuth()
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true)
      const data = await getSeriesByIdAsync(seriesId)
      setSeries(data)
      setLoading(false)
    }
    loadSeries()
  }, [seriesId])

  useEffect(() => {
    if (userData?.bookmarks) {
      setIsBookmarked(userData.bookmarks.includes(seriesId))
    }
  }, [userData, seriesId])

  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    const element = contentRef.current
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    setScrollProgress(progress)
    
    if (user && selectedStory) {
      const roundedProgress = Math.round(progress / 10) * 10
      updateReadingProgress(user.uid, selectedStory.id, roundedProgress)
    }
  }, [user, selectedStory])

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

  if (loading || !series) {
    return (
      <main className="min-h-screen relative flex items-center justify-center bg-[#050507]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
    <main className="min-h-screen relative bg-[#050507]">
      {/* Static Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-600/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-fuchsia-600/10 to-transparent rounded-full blur-[80px]" />
      </div>

      <Navbar />
      
      {/* Header */}
      <section className="relative z-10 pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-300 mb-8 transition-colors text-sm">
            ← Back to Home
          </Link>
          
          <div className="flex items-start gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/20 flex items-center justify-center text-3xl md:text-4xl flex-shrink-0 overflow-hidden">
              {series.image ? (
                <img src={series.image} alt={series.title} className="w-full h-full object-cover" />
              ) : (
                series.icon
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {series.title}
                </h1>
                {user && (
                  <button
                    onClick={handleToggleBookmark}
                    disabled={bookmarking}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl transition-all active:scale-95 flex-shrink-0 ${
                      isBookmarked 
                        ? 'bg-pink-500/30 text-pink-300 border border-pink-500/50' 
                        : 'bg-white/5 text-gray-500 hover:text-pink-300 border border-white/10 hover:border-pink-500/30'
                    }`}
                  >
                    {bookmarking ? (
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isBookmarked ? '🔖' : '📑'}
                  </button>
                )}
              </div>
              <p className="text-gray-500 text-sm md:text-base">{series.description}</p>
              <div className="flex gap-4 mt-3 text-xs md:text-sm text-gray-400">
                <span>📖 {stories.length} stories</span>
                <span>🎧 {audiobooks.length} audiobooks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="relative z-10 py-4 md:py-6 px-4 md:px-6 sticky top-16 bg-[#050507]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-1 p-1 bg-white/5 rounded-full w-full md:w-auto justify-center">
            {[{ id: 'all', label: 'All' }, { id: 'stories', label: 'Stories' }, { id: 'audiobooks', label: 'Audio' }].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id as TabType)} 
                className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-pink-500/20 text-pink-300' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full md:w-64 px-4 py-2 pl-9 bg-white/5 border border-white/10 rounded-full text-sm focus:outline-none focus:border-pink-500/30 transition-colors" 
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="relative z-10 py-8 md:py-12 px-4 md:px-6 pb-32">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stories Section */}
          {displayStories && filteredStories.length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span className="text-pink-400/60">📖</span> Stories
              </h3>
              <div className="grid gap-3">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className="p-4 md:p-5 bg-white/5 rounded-xl border border-white/5 hover:border-pink-500/30 cursor-pointer transition-colors hover:bg-white/[0.08] group"
                  >
                    <div className="flex items-center justify-between gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg md:text-xl">📖</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-200 group-hover:text-pink-300 transition-colors text-sm md:text-base truncate">{story.title}</h4>
                          <p className="text-xs text-gray-500">
                            {story.content ? '✓ Content added' : story.link ? '✓ Link added' : 'No content yet'}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-500 group-hover:text-pink-400 transition-colors flex-shrink-0">→</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audiobooks Section */}
          {displayAudiobooks && filteredAudiobooks.length > 0 && (
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                <span className="text-fuchsia-400/60">🎧</span> Audiobooks
              </h3>
              <div className="grid gap-3">
                {filteredAudiobooks.map((audio) => (
                  <div
                    key={audio.id}
                    onClick={() => setCurrentAudiobook(audio)}
                    className="p-4 md:p-5 bg-white/5 rounded-xl border border-white/5 hover:border-fuchsia-500/30 cursor-pointer transition-colors hover:bg-white/[0.08] group"
                  >
                    <div className="flex items-center justify-between gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-fuchsia-500/20 to-pink-500/20 border border-fuchsia-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-lg md:text-xl">🎧</span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-gray-200 group-hover:text-fuchsia-300 transition-colors text-sm md:text-base truncate">{audio.title}</h4>
                          <p className="text-xs text-gray-500">
                            {audio.link ? '✓ Audio linked' : 'No audio yet'}
                          </p>
                        </div>
                      </div>
                      <button className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-pink-500/20 border border-pink-500/20 flex items-center justify-center text-pink-300 hover:bg-pink-500/30 transition-colors flex-shrink-0">
                        ▶
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredStories.length === 0 && filteredAudiobooks.length === 0 && (
            <div className="text-center py-20">
              <span className="text-4xl mb-4 block opacity-50">📭</span>
              <p className="text-gray-500 mb-4">No content yet</p>
              <Link href="/admin">
                <button className="px-6 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300 hover:bg-pink-500/30 transition-colors">
                  Add Content →
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Story Reader Modal */}
      {selectedStory && (
        <div className={`fixed inset-0 z-50 overflow-hidden reading-theme-${readingTheme} reading-size-${fontSize} reading-font-${fontFamily}`}>
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 right-0 h-1 bg-black/20 z-[60]">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>

          {/* Close Button */}
          <button 
            onClick={() => setSelectedStory(null)}
            className="fixed left-4 top-4 z-[60] w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-black/80 transition-colors"
          >
            ✕
          </button>

          {/* Settings Button */}
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`fixed right-4 top-4 z-[60] w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              showSettings ? 'bg-pink-500 text-white' : 'bg-black/60 backdrop-blur-md text-white/80 hover:bg-black/80'
            }`}
          >
            ⚙️
          </button>

          {/* Settings Panel */}
          {showSettings && (
            <div className="fixed right-4 top-16 z-[59] w-72 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Theme</p>
                  <div className="grid grid-cols-3 gap-2">
                    {themeOptions.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setReadingTheme(theme.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors ${
                          readingTheme === theme.id 
                            ? 'bg-pink-500/30 ring-2 ring-pink-500/50 text-white' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">{theme.icon}</span>
                        <span className="opacity-70">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Size</p>
                  <div className="flex gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 rounded-lg flex items-center justify-center transition-colors ${
                          fontSize === size 
                            ? 'bg-pink-500/30 ring-2 ring-pink-500/50 text-white' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <span className={size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-lg'}>Aa</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Font</p>
                  <div className="flex gap-2">
                    {[
                      { id: 'serif', label: 'Serif' },
                      { id: 'sans', label: 'Sans' },
                      { id: 'mono', label: 'Mono' }
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id as FontFamily)}
                        className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                          fontFamily === font.id 
                            ? 'bg-pink-500/30 ring-2 ring-pink-500/50 text-white' 
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {font.label}
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
            onClick={() => showSettings && setShowSettings(false)}
            className="absolute inset-0 overflow-x-hidden overflow-y-auto pt-16 pb-24 reading-scroll"
          >
            <div className="reader-content py-6">
              <div className="mb-8 text-center">
                <h2 className="text-xl md:text-2xl font-bold mb-2">{selectedStory.title}</h2>
                <p className="text-sm opacity-50">{series?.title}</p>
              </div>

              {selectedStory.creditName && (
                <div className="mb-8 pb-4 border-b border-current/10 text-center">
                  <p className="text-xs opacity-50 uppercase tracking-wider mb-1">Created by</p>
                  {selectedStory.creditLink ? (
                    <a 
                      href={selectedStory.creditLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 transition-colors font-medium"
                    >
                      {selectedStory.creditName} ↗
                    </a>
                  ) : (
                    <p className="font-medium">{selectedStory.creditName}</p>
                  )}
                </div>
              )}
              
              {selectedStory.content ? (
                <article className="reading-content break-words">
                  <div dangerouslySetInnerHTML={{ __html: selectedStory.content }} />
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
                    <button className="px-6 py-2 bg-pink-500/20 border border-pink-500/30 rounded-full text-sm text-pink-300">
                      Add Content in Admin →
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          {stories.length > 1 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55]">
              {(() => {
                const currentIndex = stories.findIndex(s => s.id === selectedStory.id)
                const prevChapter = currentIndex > 0 ? stories[currentIndex - 1] : null
                const nextChapter = currentIndex < stories.length - 1 ? stories[currentIndex + 1] : null
                return (
                  <div className="flex items-center gap-2 px-2 py-2 bg-black/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                    <button
                      onClick={() => prevChapter && setSelectedStory(prevChapter)}
                      disabled={!prevChapter}
                      className={`py-2 px-4 rounded-full transition-colors text-sm ${
                        prevChapter ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-30 cursor-not-allowed text-gray-500'
                      }`}
                    >
                      ← Prev
                    </button>
                    
                    <span className="px-3 text-white text-sm">{currentIndex + 1}/{stories.length}</span>

                    <button
                      onClick={() => nextChapter && setSelectedStory(nextChapter)}
                      disabled={!nextChapter}
                      className={`py-2 px-4 rounded-full transition-colors text-sm ${
                        nextChapter ? 'bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white' : 'opacity-30 cursor-not-allowed text-gray-500'
                      }`}
                    >
                      Next →
                    </button>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* Audio Player */}
      {currentAudiobook && (
        <AudioPlayer 
          audioUrl={currentAudiobook.link || ''} 
          title={currentAudiobook.title || 'Untitled'} 
          author={series?.title || 'Unknown'} 
          coverEmoji="🎧" 
          onClose={() => setCurrentAudiobook(null)} 
        />
      )}

      <Footer />
    </main>
  )
}
