import React from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FooterProps {
  className?: string
}

export const Footer = ({ className }: FooterProps) => {
  return (
    <footer
      className={cn(
        'bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm',
        className,
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} TheraGPT. All rights reserved.</p>
        <p>
          Built with ♥ by{' '}
          <Link
            href="https://x.com/SeanOliver"
            className="text-purple-500 hover:text-purple-600"
          >
            Sean Oliver
          </Link>
          .
        </p>
      </div>
    </footer>
  )
}
