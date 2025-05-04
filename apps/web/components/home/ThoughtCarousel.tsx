'use client'

import { useState, useEffect } from 'react'

interface ThoughtCarouselProps {
  interval?: number
}

export const ThoughtCarousel = ({ interval = 5000 }: ThoughtCarouselProps): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Carousel content
  const carouselThoughts = [
    {
      distortedThought: "If I make a mistake in this presentation, my career is over.",
      reframedThought: "One mistake won't define my career. I can learn and improve from it."
    },
    {
      distortedThought: "If I don't get an A on this test, I'm a complete failure.",
      reframedThought: "My grades don't define my worth. I can still succeed even without perfect scores."
    },
    {
      distortedThought: "My friend didn't text back. They must be mad at me.",
      reframedThought: "There could be many reasons they haven't responded. I'll check in with them directly."
    },
    {
      distortedThought: "I feel anxious about this meeting, so it's going to be a disaster.",
      reframedThought: "My feelings don't predict outcomes. I can handle this meeting regardless of my anxiety."
    },
    {
      distortedThought: "I got feedback on my project, but they pointed out one flaw, so it's terrible.",
      reframedThought: "I can appreciate the positive feedback while addressing the constructive criticism."
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselThoughts.length - 1 ? 0 : prevIndex + 1
      )
    }, interval)

    return () => clearInterval(timer)
  }, [interval, carouselThoughts.length])

  const currentThought = carouselThoughts[currentIndex]

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Reframed thought (MOST prominent) */}
        <p className="text-slate-800 dark:text-slate-100 font-medium text-xl mb-6">
          "{currentThought.reframedThought}"
        </p>

        {/* Original thought with strikethrough */}
        <p className="text-slate-500 dark:text-slate-400 italic text-sm line-through">
          "{currentThought.distortedThought}"
        </p>
      </div>

      <div className="flex mt-8 gap-2">
        {carouselThoughts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex
                ? 'bg-purple-500'
                : 'bg-purple-200 dark:bg-purple-800'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}