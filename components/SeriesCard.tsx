'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface Series {
  id: string
  title: string
  description: string
  icon: string
  image?: string
  storiesCount: number
  audiobooksCount: number
}

interface SeriesCardProps {
  series: Series
  index: number
}

export default function SeriesCard({ series, index }: SeriesCardProps) {
  return (
    <Link href={`/series/${series.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
        viewport={{ once: true }}
        whileHover={{ y: -6 }}
        className="card-minimal p-6 cursor-pointer group overflow-hidden"
      >
        {/* Cover Image or Icon */}
        {series.image ? (
          <div className="relative w-full h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
            <img 
              src={series.image} 
              alt={series.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
          </div>
        ) : (
          <motion.div 
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/10 flex items-center justify-center mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-2xl">{series.icon}</span>
          </motion.div>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-100 mb-1 group-hover:text-violet-300 transition-colors duration-300">
          {series.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {series.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="text-violet-400/60">◈</span>
            {series.storiesCount} stories
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-indigo-400/60">♫</span>
            {series.audiobooksCount} audio
          </span>
        </div>

        {/* Hover indicator */}
        <motion.div
          className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: -5 }}
          whileHover={{ x: 0 }}
        >
          <span className="text-violet-400 text-sm">→</span>
        </motion.div>
      </motion.div>
    </Link>
  )
}
