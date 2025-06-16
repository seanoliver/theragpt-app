'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const BackgroundTexture = () => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Enable animations after a short delay to ensure DOM is stable
    const timer = setTimeout(() => {
      setAnimationsEnabled(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Use resolvedTheme for better theme detection, fallback to system preference
  const isDark = mounted ? (resolvedTheme === 'dark' || theme === 'dark') : 
    (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient background - always visible */}
      <div className="absolute inset-0 bg-gradient-radial from-white to-slate-50 dark:from-slate-950 dark:to-slate-900" />
      
      {/* Animated base gradient background - only when animations are enabled */}
      {animationsEnabled && (
        <div className="absolute inset-0 animate-gradient-slow">
          <div className="absolute inset-0 bg-gradient-radial from-white -translate-x-[15%] translate-y-[10%] to-slate-50 dark:from-slate-950 dark:to-slate-900 opacity-0 animate-gradient-pulse" />
          <div className="absolute inset-0 bg-gradient-radial from-white translate-x-[15%] translate-y-[10%] to-slate-50 dark:from-slate-950 dark:to-slate-900 opacity-0 animate-gradient-pulse-delay" />
        </div>
      )}

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

      {/* Gradient blobs - always visible, animations only when enabled */}
      <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-100/50 dark:bg-purple-900/30 blur-[80px]" 
           style={{ animation: animationsEnabled ? 'blob-enhanced 20s infinite alternate' : 'none' }} />
      <div
        className="absolute top-[40%] right-[15%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 blur-[80px]"
        style={{ 
          animation: animationsEnabled ? 'blob-enhanced 20s infinite alternate' : 'none',
          animationDelay: animationsEnabled ? '2s' : '0s',
        }}
      />
      <div
        className="absolute bottom-[10%] left-[35%] w-[35vw] h-[35vw] max-w-[550px] max-h-[550px] rounded-full bg-blue-100/40 dark:bg-blue-900/25 blur-[80px]"
        style={{ 
          animation: animationsEnabled ? 'blob-enhanced 20s infinite alternate' : 'none',
          animationDelay: animationsEnabled ? '4s' : '0s',
        }}
      />
      <div
        className="absolute top-[60%] left-[10%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] rounded-full bg-pink-100/30 dark:bg-pink-900/20 blur-[80px]"
        style={{ 
          animation: animationsEnabled ? 'blob-enhanced 20s infinite alternate' : 'none',
          animationDelay: animationsEnabled ? '6s' : '0s',
        }}
      />

      {/* Enhanced floating particles - only when animations are enabled and mounted */}
      {animationsEnabled && mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => {
            // Reduce particle count for better performance
            const isGlowParticle = i % 3 === 0
            const useAltAnimation = i % 2 === 0

            const size = isGlowParticle ? 4 : 3 // Fixed sizes to avoid layout shifts

            const colors = [
              'bg-purple-400/60 dark:bg-purple-300/60',
              'bg-indigo-400/60 dark:bg-indigo-300/60',
              'bg-blue-400/60 dark:bg-blue-300/60',
              'bg-pink-400/60 dark:bg-pink-300/60',
            ]

            const colorIndex = i % colors.length

            // Fixed positions to avoid layout shifts
            const positions = [
              { top: 10, left: 20 },
              { top: 30, left: 70 },
              { top: 60, left: 15 },
              { top: 80, left: 85 },
              { top: 20, left: 50 },
              { top: 50, left: 30 },
              { top: 70, left: 80 },
              { top: 40, left: 10 },
            ]

            const position = positions[i]

            return (
              <div
                key={i}
                className={`absolute rounded-full ${colors[colorIndex]} ${isGlowParticle ? 'shadow-sm' : ''}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  top: `${position.top}%`,
                  left: `${position.left}%`,
                  animation: `${useAltAnimation ? 'float-particle-alt' : 'float-particle'} ${25 + i * 3}s linear infinite`,
                  animationDelay: `${i * 2}s`,
                }}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}