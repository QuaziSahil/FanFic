'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center border border-violet-500/20">
                <span className="text-violet-400 text-sm">✦</span>
              </div>
              <span className="text-lg font-semibold">FanFic</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your gateway to fan fiction stories and audiobooks from beloved universes.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Navigate</h4>
            <ul className="space-y-2">
              {['Home', 'All Series', 'Audiobooks', 'Latest'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-sm text-hover-underline">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Series */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Popular</h4>
            <ul className="space-y-2">
              {['Harry Potter', 'Marvel', 'Star Wars', 'Anime'].map((series) => (
                <li key={series}>
                  <a href="#" className="text-gray-500 text-sm text-hover-underline">
                    {series}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-4">Stay Updated</h4>
            <p className="text-gray-500 text-sm mb-4">
              Get notified about new stories.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-violet-500/30 transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-violet-500/20 border border-violet-500/20 rounded-lg text-violet-300 text-sm font-medium hover:bg-violet-500/30 transition-all"
              >
                Join
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            © 2026 FanFic. Made with care.
          </p>
          <div className="flex gap-6">
            {['Twitter', 'Discord', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-gray-500 text-xs text-hover-lift"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
