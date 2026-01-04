'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSeries, Series } from '@/lib/storage'

const floatingEmojis = ['✦', '♡', '✧', '◇', '❋', '✺']

export default function Home() {
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])

  useEffect(() => {
    setSeriesData(getAllSeries())
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#050507]" />
        
        {/* Main gradient orbs */}
        <motion.div 
          className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-pink-600/20 via-fuchsia-500/15 to-transparent rounded-full blur-[120px]"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-rose-500/15 via-pink-500/10 to-transparent rounded-full blur-[100px]"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-t from-fuchsia-600/15 via-pink-500/10 to-transparent rounded-full blur-[130px]"
          animate={{ 
            x: [0, 60, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Mouse follow effect */}
        <motion.div 
          className="absolute w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-[80px] pointer-events-none hidden md:block"
          animate={{
            x: mousePos.x - 200,
            y: mousePos.y - 200,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        {/* Floating particles */}
        {floatingEmojis.map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/20 text-2xl pointer-events-none hidden md:block"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-8"
          >
            <motion.div 
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, borderColor: 'rgba(236, 72, 153, 0.4)' }}
            >
              <motion.span 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="text-pink-400"
              >
                ✦
              </motion.span>
              <span className="text-pink-200 text-sm font-medium">Welcome to the Future of Fan Fiction</span>
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-pink-400"
              >
                ✦
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-none"
          >
            <motion.span 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block text-white"
            >
              Your Stories
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent animate-gradient-x"
            >
              Reimagined
            </motion.span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Discover incredible{' '}
            <span className="text-pink-300 font-medium">fan fiction</span>{' '}
            and{' '}
            <span className="text-fuchsia-300 font-medium">audiobooks</span>{' '}
            from universes you love
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/browse">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Reading
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
            
            <Link href="/audiobooks">
              <motion.button
                whileHover={{ scale: 1.05, borderColor: 'rgba(236, 72, 153, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full border-2 border-white/10 text-white font-semibold text-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎧
                </motion.span>
                Listen Now
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-gray-500 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-pink-500/30 rounded-full flex justify-center pt-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-pink-400 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 text-pink-300 border border-pink-500/20 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Featured Collection
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Explore </span>
              <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                Our Universe
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Hand-picked stories and audiobooks from talented creators
            </p>
          </motion.div>

          {/* Series Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesData.slice(0, 6).map((series, index) => (
              <motion.div
                key={series.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link href={`/series/${series.id}`}>
                  <div className="relative h-full p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/40 transition-all duration-300 overflow-hidden">
                    {/* Shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    />
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/20 flex items-center justify-center text-3xl mb-4 overflow-hidden"
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {series.image ? (
                          <img src={series.image} alt={series.title} className="w-full h-full object-cover" />
                        ) : (
                          series.icon
                        )}
                      </motion.div>
                      
                      <h3 className="font-bold text-xl text-white group-hover:text-pink-200 transition-colors mb-2 line-clamp-2">
                        {series.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {series.description}
                      </p>
                      
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 text-xs text-pink-300">
                          <span>📖</span>
                          {series.chapters.filter(c => c.type === 'story').length} stories
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-fuchsia-300">
                          <span>🎧</span>
                          {series.chapters.filter(c => c.type === 'audiobook').length} audio
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/browse">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border border-pink-500/30 text-pink-300 font-medium hover:bg-pink-500/10 transition-all"
              >
                View All Series →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Why </span>
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Choose Us?
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: '📖', 
                title: 'Beautiful Reading', 
                desc: 'Elegant typography and comfortable reading experience on any device',
                color: 'from-pink-500 to-rose-500'
              },
              { 
                icon: '🎧', 
                title: 'Pro Narration', 
                desc: 'Spotify-style audio player with professionally narrated content',
                color: 'from-fuchsia-500 to-pink-500'
              },
              { 
                icon: '✨', 
                title: 'Fresh Content', 
                desc: 'New stories and audiobooks added regularly from talented creators',
                color: 'from-rose-500 to-fuchsia-500'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all group overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center text-3xl mb-6 shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                >
                  {feature.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-rose-500/10 border border-pink-500/20 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div 
                className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-[80px]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-[80px]"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
            </div>
            
            <div className="relative z-10">
              <motion.span 
                className="text-6xl mb-6 block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🚀
              </motion.span>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                  Ready to Dive In?
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of readers exploring amazing fan-created content
              </p>
              
              <Link href="/browse">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 25px 50px rgba(236, 72, 153, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white font-bold text-lg shadow-2xl shadow-pink-500/25"
                >
                  Explore Now →
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
