'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

interface AudioPlayerProps {
  audioUrl: string // Can be Google Drive link or direct URL
  title: string
  author: string
  coverEmoji?: string
  onClose: () => void
}

export default function AudioPlayer({ audioUrl, title, author, coverEmoji = '📚', onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [showVolume, setShowVolume] = useState(false)
  const [error, setError] = useState(false)
  const [isGoogleDrive, setIsGoogleDrive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Convert Google Drive link to direct playable link
  const getPlayableUrl = (url: string) => {
    if (!url || typeof url !== 'string') return ''
    
    try {
      // Google Drive file link pattern: https://drive.google.com/file/d/FILE_ID/view
      const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
      if (driveMatch) {
        setIsGoogleDrive(true)
        // Use the preview endpoint which sometimes works better
        return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`
      }
      
      // Google Drive direct download link
      const ucMatch = url.match(/drive\.google\.com\/uc\?.*id=([^&]+)/)
      if (ucMatch) {
        setIsGoogleDrive(true)
        return url
      }
      
      setIsGoogleDrive(false)
      return url
    } catch {
      return url || ''
    }
  }

  const playableUrl = getPlayableUrl(audioUrl)
  
  // Get Google Drive preview URL for iframe fallback
  const getGoogleDrivePreviewUrl = (url: string) => {
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
    if (driveMatch) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
    }
    return null
  }
  
  const previewUrl = getGoogleDrivePreviewUrl(audioUrl)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleError = () => {
      setError(true)
      setIsLoading(false)
    }
    const handleCanPlay = () => setIsLoading(false)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [playableUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const time = parseFloat(e.target.value)
    audio.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const vol = parseFloat(e.target.value)
    audio.volume = vol
    setVolume(vol)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration))
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 audio-player border-t border-white/10"
    >
      <audio ref={audioRef} src={playableUrl} preload="metadata" crossOrigin="anonymous" />
      
      {/* Show Google Drive iframe player if there's an error or it's a Google Drive link */}
      {(error || !playableUrl) && isGoogleDrive && previewUrl ? (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center">
                <span className="text-lg">{coverEmoji}</span>
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-medium text-gray-100 truncate">{title}</h4>
                <p className="text-xs text-gray-500">{author}</p>
              </div>
            </div>
            <div className="flex-1 max-w-xl">
              <iframe 
                src={previewUrl}
                className="w-full h-12 rounded-lg"
                allow="autoplay"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors ml-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      ) : !playableUrl ? (
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center">
                <span className="text-2xl">{coverEmoji}</span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-100">{title}</h4>
                <p className="text-xs text-amber-400">No audio link provided - add one in Admin Panel</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      ) : (
        <>
      {/* Progress bar at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
          style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Track Info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <motion.div
              className="w-14 h-14 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center flex-shrink-0"
              animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: isPlaying ? Infinity : 0 }}
            >
              <span className="text-2xl">{coverEmoji}</span>
            </motion.div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-100 truncate">{title}</h4>
              <p className="text-xs text-gray-500 truncate">{author}</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-4">
              {/* Skip Back */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skip(-10)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                  <text x="9" y="15" fontSize="6" fill="currentColor">10</text>
                </svg>
              </motion.button>

              {/* Play/Pause */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </motion.button>

              {/* Skip Forward */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => skip(10)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                  <text x="9" y="15" fontSize="6" fill="currentColor">10</text>
                </svg>
              </motion.button>
            </div>

            {/* Progress */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-gray-500 w-10 text-right font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="progress-bar flex-1"
                style={{
                  background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.1) 100%)`
                }}
              />
              <span className="text-xs text-gray-500 w-10 font-mono">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume & Close */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div 
              className="relative flex items-center gap-2"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
              </motion.button>
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: showVolume ? 80 : 0, opacity: showVolume ? 1 : 0 }}
                className="overflow-hidden"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  style={{
                    background: `linear-gradient(to right, #a78bfa 0%, #a78bfa ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
        </>
      )}
    </motion.div>
  )
}
