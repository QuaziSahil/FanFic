'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllSeries, addSeries, deleteSeries, addChapter, deleteChapter, Series } from '@/lib/storage'
import { auth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@/lib/firebase'

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [series, setSeries] = useState<Series[]>([])
  const [activeTab, setActiveTab] = useState<'series' | 'chapters'>('series')
  const [selectedSeries, setSelectedSeries] = useState<string>('')
  
  // Form states
  const [newSeriesTitle, setNewSeriesTitle] = useState('')
  const [newSeriesDesc, setNewSeriesDesc] = useState('')
  const [newSeriesIcon, setNewSeriesIcon] = useState('📚')
  const [newSeriesImage, setNewSeriesImage] = useState<string>('')
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [newChapterLink, setNewChapterLink] = useState('')
  const [newChapterType, setNewChapterType] = useState<'story' | 'audiobook'>('story')
  const [newChapterCreditName, setNewChapterCreditName] = useState('')
  const [newChapterCreditLink, setNewChapterCreditLink] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkChapters, setBulkChapters] = useState<{title: string, link: string}[]>([
    { title: '', link: '' }
  ])

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser) {
        setSeries(getAllSeries())
      }
    })
    return () => unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password')
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address')
      } else {
        setError('Login failed. Please try again.')
      }
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const handleAddSeries = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSeriesTitle.trim()) return
    addSeries(newSeriesTitle, newSeriesDesc, newSeriesIcon, newSeriesImage || undefined)
    setSeries(getAllSeries())
    setNewSeriesTitle('')
    setNewSeriesDesc('')
    setNewSeriesIcon('📚')
    setNewSeriesImage('')
    showSuccess('Series added successfully!')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (file.size > 500000) { // 500KB limit
      setError('Image too large. Max 500KB.')
      setTimeout(() => setError(''), 3000)
      return
    }
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setNewSeriesImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteSeries = (id: string) => {
    if (confirm('Delete this series and all its chapters?')) {
      deleteSeries(id)
      setSeries(getAllSeries())
      showSuccess('Series deleted!')
    }
  }

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeries || !newChapterTitle.trim()) return
    addChapter(selectedSeries, newChapterTitle, newChapterLink, newChapterType, undefined, newChapterCreditName || undefined, newChapterCreditLink || undefined)
    setSeries(getAllSeries())
    setNewChapterTitle('')
    setNewChapterLink('')
    setNewChapterCreditName('')
    setNewChapterCreditLink('')
    showSuccess('Chapter added successfully!')
  }

  const handleBulkAddChapters = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSeries) return
    
    const validChapters = bulkChapters.filter(ch => ch.title.trim())
    if (validChapters.length === 0) return
    
    validChapters.forEach(ch => {
      addChapter(selectedSeries, ch.title, ch.link, newChapterType)
    })
    
    setSeries(getAllSeries())
    setBulkChapters([{ title: '', link: '' }])
    showSuccess(`${validChapters.length} chapters added successfully!`)
  }

  const addBulkRow = () => {
    setBulkChapters([...bulkChapters, { title: '', link: '' }])
  }

  const removeBulkRow = (index: number) => {
    if (bulkChapters.length > 1) {
      setBulkChapters(bulkChapters.filter((_, i) => i !== index))
    }
  }

  const updateBulkChapter = (index: number, field: 'title' | 'link', value: string) => {
    const updated = [...bulkChapters]
    updated[index][field] = value
    setBulkChapters(updated)
  }

  const handleDeleteChapter = (seriesId: string, chapterId: string) => {
    if (confirm('Delete this chapter?')) {
      deleteChapter(seriesId, chapterId)
      setSeries(getAllSeries())
      showSuccess('Chapter deleted!')
    }
  }

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  // Loading Screen
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    )
  }

  // Login Screen
  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Panel</h1>
            <p className="text-gray-500">Sign in to manage content</p>
          </div>
          
          <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                placeholder="your@email.com"
                autoFocus
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                placeholder="Enter password"
                required
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>
            
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
            >
              Sign In
            </motion.button>
          </form>
          
          <p className="text-center text-gray-600 text-sm mt-6">
            Only authorized admins can access this panel
          </p>
        </motion.div>
      </main>
    )
  }

  // Admin Dashboard
  return (
    <main className="min-h-screen bg-[#0a0a0f] p-4 md:p-8">
      {/* Success Toast */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400"
          >
            ✓ {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Content Manager</h1>
            <p className="text-gray-500 text-sm">Add and manage your fanfic content</p>
          </div>
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all">
              ← View Site
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('series')}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'series'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                : 'text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            📚 Manage Series
          </button>
          <button
            onClick={() => setActiveTab('chapters')}
            className={`px-5 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'chapters'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20'
                : 'text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            📄 Add Chapters
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            {activeTab === 'series' ? (
              <>
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <span className="text-violet-400">+</span> Add New Series
                </h2>
                <form onSubmit={handleAddSeries} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Series Title *</label>
                    <input
                      type="text"
                      value={newSeriesTitle}
                      onChange={(e) => setNewSeriesTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                      placeholder="e.g., Harry Potter"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <input
                      type="text"
                      value={newSeriesDesc}
                      onChange={(e) => setNewSeriesDesc(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                      placeholder="e.g., Magical adventures..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Icon (emoji)</label>
                    <input
                      type="text"
                      value={newSeriesIcon}
                      onChange={(e) => setNewSeriesIcon(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                      placeholder="📚"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Cover Image (optional)</label>
                    <div className="space-y-3">
                      {newSeriesImage ? (
                        <div className="relative">
                          <img 
                            src={newSeriesImage} 
                            alt="Preview" 
                            className="w-full h-32 object-cover rounded-xl border border-white/10"
                          />
                          <button
                            type="button"
                            onClick={() => setNewSeriesImage('')}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-500 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-violet-500/30 transition-colors bg-white/5">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <span className="text-2xl mb-2">📷</span>
                            <p className="text-sm text-gray-500">Click to upload image</p>
                            <p className="text-xs text-gray-600">Max 500KB</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
                  >
                    Add Series
                  </motion.button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-violet-400">+</span> Add {bulkMode ? 'Multiple Chapters' : 'New Chapter'}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setBulkMode(!bulkMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      bulkMode 
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/20' 
                        : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {bulkMode ? '📝 Single Mode' : '📚 Bulk Mode'}
                  </button>
                </div>
                <form onSubmit={bulkMode ? handleBulkAddChapters : handleAddChapter} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Select Series *</label>
                    <select
                      value={selectedSeries}
                      onChange={(e) => setSelectedSeries(e.target.value)}
                      className="w-full px-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors text-gray-200"
                      required
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" className="bg-[#1a1a2e] text-gray-400">Choose a series...</option>
                      {series.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#1a1a2e] text-gray-200">{s.icon} {s.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Series Info Card */}
                  <AnimatePresence>
                    {selectedSeries && (() => {
                      const selected = series.find(s => s.id === selectedSeries)
                      if (!selected) return null
                      const stories = selected.chapters.filter(c => c.type === 'story')
                      const audiobooks = selected.chapters.filter(c => c.type === 'audiobook')
                      const lastChapter = selected.chapters[selected.chapters.length - 1]
                      return (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-3xl">{selected.icon}</span>
                              <div>
                                <h3 className="font-semibold text-gray-100">{selected.title}</h3>
                                <p className="text-xs text-gray-500">{selected.description}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-violet-400">{selected.chapters.length}</p>
                                <p className="text-xs text-gray-500">Total</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-emerald-400">{stories.length}</p>
                                <p className="text-xs text-gray-500">Stories</p>
                              </div>
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-2xl font-bold text-indigo-400">{audiobooks.length}</p>
                                <p className="text-xs text-gray-500">Audio</p>
                              </div>
                            </div>

                            {lastChapter ? (
                              <div className="bg-white/5 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">Last uploaded:</p>
                                <div className="flex items-center gap-2">
                                  <span>{lastChapter.type === 'audiobook' ? '🎧' : '📖'}</span>
                                  <span className="text-sm text-gray-300 truncate">{lastChapter.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {new Date(lastChapter.createdAt).toLocaleDateString('en-US', { 
                                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            ) : (
                              <div className="bg-white/5 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500">No chapters yet - add one below!</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })()}
                  </AnimatePresence>

                  {bulkMode ? (
                    <>
                      {/* Bulk Chapters Input */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm text-gray-400">Chapters</label>
                          <span className="text-xs text-gray-500">{bulkChapters.filter(c => c.title.trim()).length} chapters</span>
                        </div>
                        
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {bulkChapters.map((chapter, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-2 items-start"
                            >
                              <span className="text-xs text-gray-500 mt-3 w-6">{index + 1}.</span>
                              <div className="flex-1 space-y-2">
                                <input
                                  type="text"
                                  value={chapter.title}
                                  onChange={(e) => updateBulkChapter(index, 'title', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                  placeholder={`Chapter ${index + 1} title`}
                                />
                                <input
                                  type="url"
                                  value={chapter.link}
                                  onChange={(e) => updateBulkChapter(index, 'link', e.target.value)}
                                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
                                  placeholder="Link (optional)"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBulkRow(index)}
                                className="mt-2 p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                              >
                                ✕
                              </button>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.button
                          type="button"
                          onClick={addBulkRow}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className="w-full py-2 border-2 border-dashed border-white/10 rounded-lg text-sm text-gray-500 hover:border-violet-500/30 hover:text-violet-400 transition-all"
                        >
                          + Add Another Chapter
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Chapter Title *</label>
                        <input
                          type="text"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="e.g., Chapter 1: The Beginning"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Content Link (Google Docs/Drive/Archive)</label>
                        <input
                          type="url"
                          value={newChapterLink}
                          onChange={(e) => setNewChapterLink(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="https://archive.org/download/..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty if not ready yet</p>
                      </div>
                      
                      {/* Creator Credit Section */}
                      <div className="border-t border-white/10 pt-4 mt-4">
                        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Creator Credit (Optional)</p>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Creator Name</label>
                            <input
                              type="text"
                              value={newChapterCreditName}
                              onChange={(e) => setNewChapterCreditName(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                              placeholder="e.g., John Doe"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Creator Link</label>
                            <input
                              type="url"
                              value={newChapterCreditLink}
                              onChange={(e) => setNewChapterCreditLink(e.target.value)}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-violet-500/50 transition-colors"
                              placeholder="https://twitter.com/creator or profile URL"
                            />
                            <p className="text-xs text-gray-500 mt-1">Link to creator's social/profile (optional)</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Type</label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setNewChapterType('story')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          newChapterType === 'story'
                            ? 'bg-violet-500/20 border-violet-500/30 text-violet-300'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        📖 Story
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewChapterType('audiobook')}
                        className={`flex-1 py-3 rounded-xl border transition-all ${
                          newChapterType === 'audiobook'
                            ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                        }`}
                      >
                        🎧 Audiobook
                      </button>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl font-medium hover:from-violet-500 hover:to-indigo-500 transition-all"
                  >
                    {bulkMode ? `Add ${bulkChapters.filter(c => c.title.trim()).length} Chapters` : 'Add Chapter'}
                  </motion.button>
                </form>
              </>
            )}
          </div>

          {/* Right Panel - List */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">
              {activeTab === 'series' ? '📚 All Series' : '📄 All Chapters'}
            </h2>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {activeTab === 'series' ? (
                series.map(s => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {s.image ? (
                          <img src={s.image} alt={s.title} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <span className="text-2xl w-12 h-12 flex items-center justify-center bg-white/5 rounded-lg">{s.icon}</span>
                        )}
                        <div>
                          <h3 className="font-medium text-gray-200">{s.title}</h3>
                          <p className="text-xs text-gray-500">{s.chapters.length} chapters</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSeries(s.id)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                series.map(s => (
                  <div key={s.id} className="mb-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                      {s.icon} {s.title}
                    </h3>
                    {s.chapters.length === 0 ? (
                      <p className="text-xs text-gray-600 ml-6">No chapters yet</p>
                    ) : (
                      s.chapters.map(ch => (
                        <motion.div
                          key={ch.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-6 p-3 bg-white/5 rounded-lg border border-white/5 mb-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{ch.type === 'audiobook' ? '🎧' : '📖'}</span>
                              <span className="text-sm text-gray-300">{ch.title}</span>
                              {ch.link && <span className="text-xs text-emerald-400">✓ linked</span>}
                            </div>
                            <button
                              onClick={() => handleDeleteChapter(s.id, ch.id)}
                              className="opacity-0 group-hover:opacity-100 px-2 py-1 text-red-400 hover:bg-red-500/10 rounded text-xs transition-all"
                            >
                              ✕
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
          <h3 className="font-semibold text-gray-300 mb-3">📝 How to use:</h3>
          <ol className="text-sm text-gray-500 space-y-2 list-decimal list-inside">
            <li>Create a new <strong className="text-gray-400">Series</strong> (e.g., "Harry Potter", "Marvel")</li>
            <li>Switch to <strong className="text-gray-400">Add Chapters</strong> tab</li>
            <li>Select your series, enter chapter title, and paste your Google Docs/Drive link</li>
            <li>For stories: Use Google Docs link (docs.google.com/document/d/...)</li>
            <li>For audiobooks: Use Google Drive audio file link (drive.google.com/file/d/...)</li>
            <li>Content appears automatically on your website!</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
