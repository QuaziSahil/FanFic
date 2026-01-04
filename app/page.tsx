'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getAllSeriesAsync, Series } from '@/lib/storage'

export default function Home() {
  const [seriesData, setSeriesData] = useState<Series[]>([])
  const [loading, setLoading] = useState(true)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadSeries = async () => {
      const data = await getAllSeriesAsync()
      setSeriesData(data)
      setLoading(false)
    }
    loadSeries()
  }, [])

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Static Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#050507]" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-pink-600/15 via-fuchsia-500/10 to-transparent rounded-full blur-[100px] opacity-80" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-rose-500/10 via-pink-500/8 to-transparent rounded-full blur-[80px] opacity-70" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-t from-fuchsia-600/10 via-pink-500/8 to-transparent rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 min-h-[100svh] flex flex-col items-center justify-center px-4 md:px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <span className="text-pink-400 text-sm">✦</span>
              <span className="text-pink-200 text-xs md:text-sm font-medium">Welcome to FanFic</span>
              <span className="text-pink-400">✦</span>
            </div>
          </div>

          {/* Main Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 md:mb-8 leading-[1.1]"
          >
            <span className="block text-white">Your Stories</span>
            <span className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">Reimagined</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2"
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
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/browse">
              <button className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white font-semibold text-base md:text-lg w-full sm:w-auto hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
                Start Reading →
              </button>
            </Link>
            
            <Link href="/audiobooks">
              <button className="px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-white/10 text-white font-semibold text-base md:text-lg hover:bg-white/5 hover:border-pink-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
                🎧 Listen Now
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/10 to-fuchsia-500/10 text-pink-300 border border-pink-500/20 mb-4">
              Featured Collection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Explore </span>
              <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                Our Universe
              </span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Hand-picked stories and audiobooks from talented creators
            </p>
          </div>

          {/* Series Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesData.slice(0, 6).map((series) => (
              <div key={series.id} className="group">
                <Link href={`/series/${series.id}`}>
                  <div className="relative h-full p-6 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/40 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 border border-pink-500/20 flex items-center justify-center text-3xl mb-4 overflow-hidden group-hover:scale-105 transition-transform">
                        {series.image ? (
                          <img src={series.image} alt={series.title} className="w-full h-full object-cover" />
                        ) : (
                          series.icon
                        )}
                      </div>
                      
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
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/browse">
              <button className="px-8 py-3 rounded-full border border-pink-500/30 text-pink-300 font-medium hover:bg-pink-500/10 active:scale-95 transition-all">
                View All Series →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent via-pink-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Why </span>
              <span className="bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Choose Us?
              </span>
            </h2>
          </div>

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
              <div
                key={index}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 hover:border-pink-500/30 hover:-translate-y-2 transition-all group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} bg-opacity-20 flex items-center justify-center text-3xl mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 rounded-[3rem] bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-rose-500/10 border border-pink-500/20 text-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fuchsia-500/20 rounded-full blur-[80px]" />
            </div>
            
            <div className="relative z-10">
              <span className="text-6xl mb-6 block">🚀</span>
              
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent">
                  Ready to Dive In?
                </span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of readers exploring amazing fan-created content
              </p>
              
              <Link href="/browse">
                <button className="px-10 py-5 rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-rose-500 text-white font-bold text-lg shadow-2xl shadow-pink-500/25 hover:opacity-90 active:scale-95 transition-all">
                  Explore Now →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
