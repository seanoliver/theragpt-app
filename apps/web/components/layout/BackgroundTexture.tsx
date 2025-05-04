'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const BackgroundTexture = () => {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed inset-0 bg-gradient-radial from-white to-slate-50 dark:from-slate-950 dark:to-slate-900" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Animated base gradient background */}
      <div className="absolute inset-0 animate-gradient-slow">
        <div className="absolute inset-0 bg-gradient-radial from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 opacity-100" />
        <div className="absolute inset-0 bg-gradient-radial from-white -translate-x-[15%] translate-y-[10%] to-slate-50 dark:from-slate-950 dark:to-slate-900 opacity-0 animate-gradient-pulse" />
        <div className="absolute inset-0 bg-gradient-radial from-white translate-x-[15%] translate-y-[10%] to-slate-50 dark:from-slate-950 dark:to-slate-900 opacity-0 animate-gradient-pulse-delay" />
      </div>

      {/* Subtle texture overlay - different settings for light/dark mode */}
      {!isDark ? (
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundSize: '200px 200px',
          }}
        />
      ) : (
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
            backgroundSize: '300px 300px',
          }}
        />
      )}

      {/* Gradient blobs for light mode with enhanced animation */}
      {!isDark && (
        <>
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-100/50 blur-[80px] animate-blob-enhanced" />
          <div
            className="absolute top-[40%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-100/50 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-[10%] left-[35%] w-[35vw] h-[35vw] max-w-[550px] max-h-[550px] rounded-full bg-blue-100/40 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '4s' }}
          />
          <div
            className="absolute top-[60%] left-[10%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-pink-100/30 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '6s' }}
          />
        </>
      )}

      {/* Gradient blobs for dark mode with enhanced animation */}
      {isDark && (
        <>
          <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-900/30 blur-[80px] animate-blob-enhanced" />
          <div
            className="absolute top-[40%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-900/30 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '2s' }}
          />
          <div
            className="absolute bottom-[10%] left-[35%] w-[35vw] h-[35vw] max-w-[550px] max-h-[550px] rounded-full bg-blue-900/25 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '4s' }}
          />
          <div
            className="absolute top-[60%] left-[10%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-pink-900/20 blur-[80px] animate-blob-enhanced"
            style={{ animationDelay: '6s' }}
          />
        </>
      )}

      {/* Enhanced floating particles with more visibility and variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => {
          // Determine if this will be a "glow" particle (more visible)
          const isGlowParticle = i % 3 === 0
          // Use alternate animation for some particles
          const useAltAnimation = i % 2 === 0

          const size = isGlowParticle
            ? Math.random() * 5 + 3
            : Math.random() * 4 + 2

          // Different colors for variety
          const lightModeColors = [
            'bg-purple-400', 'bg-indigo-400', 'bg-blue-400', 'bg-pink-400',
          ]
          const darkModeColors = [
            'dark:bg-purple-300', 'dark:bg-indigo-300', 'dark:bg-blue-300', 'dark:bg-pink-300',
          ]

          const colorIndex = i % lightModeColors.length

          // Randomize starting positions more
          const topPosition = Math.random() * 120 - 20 // -20% to 100%
          const leftPosition = Math.random() * 120 - 10 // -10% to 110%

          return (
            <div
              key={i}
              className={`absolute rounded-full ${lightModeColors[colorIndex]} ${darkModeColors[colorIndex]} ${useAltAnimation ? 'animate-float-particle-alt' : 'animate-float-particle'} ${isGlowParticle ? 'shadow-md' : ''}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${topPosition}%`,
                left: `${leftPosition}%`,
                opacity: isGlowParticle ? 0.8 : 0.6,
                filter: isGlowParticle ? 'blur(0.5px)' : 'none',
                animationDuration: `${Math.random() * 15 + 15}s`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}