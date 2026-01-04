'use client'

import { memo } from 'react'

// Memoized component for better performance - static backgrounds only, no animations
const ParticleBackground = memo(function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Static background */}
      <div className="absolute inset-0 bg-[#050507]" />
      
      {/* Static gradient orbs - NO animations to prevent mobile blinking */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.1) 0%, transparent 70%)',
          top: '40%',
          left: '30%',
        }}
      />

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  )
})

export default ParticleBackground
