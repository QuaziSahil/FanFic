'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import SeriesCard from '@/components/SeriesCard'
import Footer from '@/components/Footer'
import { getAllSeries, Series } from '@/lib/storage'

// Animation variants - optimized for smoother performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function Home() {
  const [hoveredWord, setHoveredWord] = useState<number | null>(null)
  const [seriesData, setSeriesData] = useState<Series[]>([])

  useEffect(() => {
    setSeriesData(getAllSeries())
  }, [])

  const titleWords = ['Your', 'Stories', 'Reimagined']

  return (
    <main className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center z-10 max-w-3xl mx-auto"
        >
          {/* Logo mark */}
          <motion.div
            variants={itemVariants}
            className="mb-8"
          >
            <motion.div
              className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/10 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-3xl">✦</span>
            </motion.div>
          </motion.div>

          {/* Main Title with hover effects */}
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            {titleWords.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mx-2 cursor-default"
                onMouseEnter={() => setHoveredWord(index)}
                onMouseLeave={() => setHoveredWord(null)}
                animate={{
                  color: hoveredWord === index ? '#a78bfa' : '#e5e5e5',
                  scale: hoveredWord === index ? 1.05 : 1,
                  y: hoveredWord === index ? -5 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          
          {/* Subtitle with typing effect */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed"
          >
            Discover{' '}
            <span className="text-hover-glow cursor-default">fan fiction</span>{' '}
            and{' '}
            <span className="text-hover-glow cursor-default">audiobooks</span>{' '}
            from universes you love
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#series">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 bg-violet-500/20 border border-violet-500/30 rounded-full font-medium text-violet-200 hover:bg-violet-500/30 transition-all"
              >
                Browse Stories
              </motion.button>
            </Link>
            <Link href="#audiobooks">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 border border-white/10 rounded-full font-medium text-gray-300 hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <span className="mr-2">♫</span>
                Listen Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1.5"
          >
            <motion.div className="w-1 h-1.5 bg-violet-400/60 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Series Section */}
      <section id="series" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              <span className="text-hover-spread cursor-default">Choose</span>{' '}
              <span className="gradient-text-subtle">Your Universe</span>
            </h2>
            <p className="text-gray-500 max-w-xl">
              Each series contains unique stories from talented writers and professionally narrated audiobooks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesData.map((series, index) => (
              <SeriesCard key={series.id} series={{
                id: series.id,
                title: series.title,
                description: series.description,
                icon: series.icon,
                image: series.image,
                storiesCount: series.chapters.filter(c => c.type === 'story').length,
                audiobooksCount: series.chapters.filter(c => c.type === 'audiobook').length,
              }} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="audiobooks" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              <span className="text-hover-spread cursor-default">How</span>{' '}
              <span className="gradient-text-subtle">It Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '◈', title: 'Read', desc: 'Beautifully formatted stories with elegant typography' },
              { icon: '♫', title: 'Listen', desc: 'Spotify-like player with professional narration' },
              { icon: '✦', title: 'Enjoy', desc: 'New content added regularly across all series' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="card-minimal p-8 text-center group"
              >
                <motion.div 
                  className="text-3xl mb-4 text-violet-400/60 group-hover:text-violet-400 transition-colors"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-hover-glow cursor-default">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
