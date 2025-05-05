'use client'

import { Card } from '@/apps/web/components/ui/card'
import { motion } from 'motion/react'
import {
  LineChart,
  BarChart,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
} from 'lucide-react'
import Image from 'next/image'

export const ProgressSection = () => {
  return (
    <div>
      <div className="relative">
        {/* Decorative elements specific to this section */}
        <div className="absolute -top-20 right-0 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-0 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Track Your Progress
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Build resilience over time by tracking your journey and celebrating
            your growth.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-3 order-2 md:order-1">
          <div className="relative">
            <Card className="glass-panel p-6 overflow-hidden border-indigo-200/50 dark:border-indigo-800/30 shadow-xl">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Your Emotional Journey
                  </h3>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Last 30 Days
                    </span>
                  </div>
                </div>

                <div className="aspect-[16/9] w-full relative">
                  <Image
                    src="/placeholder.svg?height=400&width=800"
                    alt="Progress chart showing emotional trends over time"
                    width={800}
                    height={400}
                    className="rounded-lg"
                  />

                  {/* Overlay elements to make the chart look interactive */}
                  <div className="absolute bottom-10 left-1/4 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-slate-800"></div>
                  <div className="absolute bottom-20 left-1/2 w-4 h-4 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-800"></div>
                  <div className="absolute bottom-16 left-3/4 w-4 h-4 rounded-full bg-purple-500 border-2 border-white dark:border-slate-800"></div>

                  <motion.div
                    className="absolute bottom-12 right-10 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-slate-800"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  ></motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      68%
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Reduction in Catastrophizing
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      12
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Day Journaling Streak
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      24
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Positive Reframes
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 order-1 md:order-2">
          <Card className="glass-panel p-6 border-indigo-200/50 dark:border-indigo-800/30 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-purple-500" />
              Measure Your Growth
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Visualize your progress with detailed analytics that show how your
              thinking patterns evolve over time.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <LineChart className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Mood tracking
                </span>
              </div>
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Distortion trends
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Journaling streaks
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Goal tracking
                </span>
              </div>
            </div>
          </Card>

          <motion.div
            className="glass-panel p-6 rounded-lg border border-purple-200 dark:border-purple-800 bg-white/70 dark:bg-black/50 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
              <Award className="mr-2 h-5 w-5 text-purple-500" />
              Celebrate Milestones
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Stay motivated with achievement badges, streaks, and personalized
              insights that recognize your progress.
            </p>

            <div className="mt-4 flex justify-around">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
                  whileHover={{ y: -5 }}
                >
                  <Award className="h-6 w-6 text-white" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
