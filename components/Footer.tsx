'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 px-6 border-t border-pink-500/10 bg-gradient-to-b from-transparent to-pink-950/10">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-fuchsia-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-3 mb-4 cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-fuchsia-500/20 flex items-center justify-center border border-pink-500/30 group-hover:border-pink-500/50 transition-colors">
                  <span className="text-pink-400 text-lg">✦</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                  FanFic
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your gateway to fan fiction stories and audiobooks from beloved universes.
            </p>
            <p className="mt-3 text-xs text-pink-400/60">
              Made with ♡ for fans
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <span className="text-pink-400">📍</span> Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/', icon: '🏠' },
                { name: 'Browse All', href: '/browse', icon: '📚' },
                { name: 'Audiobooks', href: '/audiobooks', icon: '🎧' },
                { name: 'About', href: '/about', icon: '✨' },
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-pink-300 transition-colors flex items-center gap-2 group"
                  >
                    <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Series */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <span className="text-pink-400">⭐</span> Featured Series
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/browse"
                  className="text-gray-400 text-sm hover:text-pink-300 transition-colors flex items-center gap-2 group"
                >
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">⚔️</span>
                  <span>Shadow Slave</span>
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-gray-500 italic">
              More series coming soon...
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
              <span className="text-pink-400">💌</span> Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get notified about new stories and chapters.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-pink-500/20 rounded-xl text-sm focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-gray-500"
              />
              <button className="px-5 py-2.5 bg-gradient-to-r from-pink-500/20 to-fuchsia-500/20 border border-pink-500/30 rounded-xl text-pink-300 text-sm font-medium hover:from-pink-500/30 hover:to-fuchsia-500/30 active:scale-95 transition-all">
                Join
              </button>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              No spam, only story updates ✨
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-pink-500/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-pink-400">♥</span>
            <p className="text-gray-500 text-xs">
              © {currentYear} FanFic. All stories belong to their respective creators.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {[
              { name: 'Twitter', icon: '𝕏' },
              { name: 'Discord', icon: '💬' },
              { name: 'GitHub', icon: '🐙' },
            ].map((social) => (
              <a
                key={social.name}
                href="#"
                className="text-gray-500 text-xs hover:text-pink-400 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>{social.icon}</span>
                <span>{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Credits */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-600">
            Original stories by <span className="text-pink-400/80">Necroz2002</span> • 
            Site by <span className="text-fuchsia-400/80">QuaziSahil</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
