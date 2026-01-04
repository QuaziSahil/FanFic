'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const teamMembers = [
  { name: 'FanFic Team', role: 'Platform Creators', emoji: '✨' },
]

const credits = [
  {
    title: 'Shadow Slave Fan Fiction',
    author: 'Community Contributors',
    link: '',
    description: 'Fan-created content from the Shadow Slave universe',
  },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#120a1a] to-[#0a0a0f]" />
        <motion.div 
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px]"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/5 rounded-full blur-[80px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1 }}
            className="mb-8"
          >
            <span className="text-6xl">💫</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-pink-300 via-fuchsia-400 to-pink-300 bg-clip-text text-transparent animate-gradient-x">
              About Us
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            We&apos;re passionate about bringing fan-created stories to life. 
            Our platform celebrates the creativity of writers and artists who 
            expand the universes we all love.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <motion.span 
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 text-pink-300 border border-pink-500/20 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                Our Mission
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-white">Empowering </span>
                <span className="bg-gradient-to-r from-pink-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Creative Voices
                </span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                FanFic is a platform dedicated to showcasing the incredible talent of fan fiction 
                writers from around the world. We believe every story deserves to be heard, and 
                every creator deserves recognition.
              </p>
              <p className="text-gray-400 leading-relaxed">
                All content on our platform is properly credited to its original creators. We work 
                directly with authors to feature their work and ensure they receive the recognition 
                they deserve.
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-rose-500/10 border border-pink-500/20 p-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="text-9xl opacity-50"
                >
                  📚
                </motion.div>
              </div>
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center text-2xl shadow-lg shadow-pink-500/25"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✦
              </motion.div>
              <motion.div 
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-rose-500 flex items-center justify-center text-xl shadow-lg shadow-fuchsia-500/25"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                ♡
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Credits Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-500/20 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Credits & Attribution
            </motion.span>
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="text-white">Talented </span>
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Creators
              </span>
            </h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">
              All stories featured on FanFic are created by amazing writers. 
              We are honored to showcase their work.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {credits.map((credit, index) => (
              <motion.a
                key={index}
                href={credit.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="block p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-pink-500/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    📖
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-white group-hover:text-pink-300 transition-colors truncate">
                      {credit.title}
                    </h3>
                    <p className="text-pink-400 text-sm font-medium mb-2">
                      by {credit.author}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {credit.description}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500 group-hover:text-pink-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/5 to-fuchsia-500/5 border border-pink-500/10"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Important Disclaimer</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  All fan fiction and creative works featured on this platform are created by independent 
                  authors and are properly credited to their respective creators. These works are 
                  transformative fan-made content and are not affiliated with, endorsed by, or 
                  associated with the original copyright holders.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  If you are a creator and would like to have your work featured or removed, please 
                  contact us. We respect intellectual property rights and will promptly address any concerns.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-300 via-fuchsia-400 to-rose-300 bg-clip-text text-transparent">
              Ready to Explore?
            </span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Dive into incredible fan-created stories and audiobooks from your favorite universes.
          </p>
          <Link href="/browse">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-shadow"
            >
              Start Reading →
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
