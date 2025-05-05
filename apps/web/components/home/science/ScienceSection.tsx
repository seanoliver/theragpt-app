'use client'

import { Card } from '@/apps/web/components/ui/card'
import { motion } from 'motion/react'
import { Brain, ArrowRight, Lightbulb, Zap } from 'lucide-react'

export function ScienceSection() {
  return (
    <div>
      <div className="relative">
        {/* Decorative elements specific to this section */}
        <div className="absolute -top-20 -left-40 w-80 h-80 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-40 w-80 h-80 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
            The Science Behind TheraGPT
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto subheading">
            Based on decades of research in Cognitive Behavioral Therapy (CBT),
            one of the most effective and well-researched therapeutic
            approaches.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Card className="glass-panel p-8 relative overflow-hidden border-purple-200/50 dark:border-purple-800/30 shadow-xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-xl"></div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 relative z-10">
              How CBT Works
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Identify Thought Patterns
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    CBT helps you recognize automatic negative thoughts and
                    cognitive distortions that contribute to emotional distress.
                  </p>
                </div>
              </div>

              <motion.div
                className="flex justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <ArrowRight className="h-6 w-6 text-purple-500 transform rotate-90" />
              </motion.div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Challenge Distortions
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Learn to question and evaluate negative thoughts, examining
                    evidence for and against them.
                  </p>
                </div>
              </div>

              <motion.div
                className="flex justify-center"
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.5,
                }}
              >
                <ArrowRight className="h-6 w-6 text-purple-500 transform rotate-90" />
              </motion.div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                    Develop New Perspectives
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Replace distorted thoughts with more balanced, realistic
                    alternatives that promote emotional well-being.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-lg border border-purple-200 dark:border-purple-800 bg-white/70 dark:bg-black/50 shadow-lg">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Research-Backed Results
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              CBT has been extensively studied and proven effective for a wide
              range of concerns including anxiety, depression, stress, and
              negative thought patterns.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">94%</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  of users report improved awareness of thought patterns
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">87%</div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  experience reduced negative thinking after 2 weeks
                </p>
              </div>
            </div>
          </div>

          <motion.div
            className="glass-panel p-6 rounded-lg border border-purple-200 dark:border-purple-800 bg-white/70 dark:bg-black/50 shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
              AI-Enhanced Therapy
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              TheraGPT combines proven CBT techniques with advanced AI to
              provide personalized insights and reframing suggestions tailored
              to your unique thought patterns.
            </p>

            <div className="mt-4 flex items-center justify-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
                >
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center">
                    <Zap className="h-3 w-3 text-purple-600 dark:text-purple-300" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
