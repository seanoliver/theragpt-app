'use client'

import { Card } from '@/apps/web/components/ui/card'
import { Button } from '@/apps/web/components/ui/button'
import { motion } from 'motion/react'
import { Shield, Lock, FileText, Download, Trash2 } from 'lucide-react'
import Link from 'next/link'

export function PrivacySection() {
  return (
    <div>
      <div className="relative">
        {/* Decorative elements specific to this section */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-green-100/30 dark:bg-green-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold gradient-text mb-6">
            Your Privacy Matters
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            We're committed to protecting your data and providing you with
            complete control over your information.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="glass-panel p-8 relative overflow-hidden border-green-200/50 dark:border-green-800/30 shadow-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-xl"></div>

          <div className="mb-6 flex justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            >
              <Shield className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center">
            Secure by Design
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-center">
            Your journal entries are encrypted and protected with
            industry-leading security standards.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                End-to-end encryption
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Secure cloud storage
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                <Lock className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Regular security audits
              </span>
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-8 relative overflow-hidden border-blue-200/50 dark:border-blue-800/30 shadow-xl">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100/30 dark:bg-purple-900/10 rounded-full blur-xl"></div>

          <div className="mb-6 flex justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <FileText className="h-8 w-8 text-white" />
            </motion.div>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center">
            Your Data, Your Control
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-center">
            Export or delete your data at any time. We believe in complete
            transparency and user control.
          </p>

          <div className="mt-6 flex justify-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-900 dark:hover:bg-red-900/20"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Data
            </Button>
          </div>
        </Card>

        <Card className="glass-panel p-8 relative overflow-hidden border-purple-200/50 dark:border-purple-800/30 shadow-xl">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-100/30 dark:bg-indigo-900/10 rounded-full blur-xl"></div>

          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 text-center">
            Clear Policies
          </h3>

          <p className="text-slate-600 dark:text-slate-300 text-center">
            Our privacy policy and terms of service are written in plain
            language, so you always know how your data is used.
          </p>

          <div className="mt-6 space-y-3">
            <Link href="/privacy" className="block">
              <div className="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <FileText className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Privacy Policy
                </span>
              </div>
            </Link>
            <Link href="/terms" className="block">
              <div className="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <FileText className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Terms of Service
                </span>
              </div>
            </Link>
            <Link href="/faq" className="block">
              <div className="flex items-center p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                <FileText className="h-5 w-5 text-purple-500 mr-3" />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  FAQ
                </span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
