import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-0 md:px-0 border-t">
      <div className="max-w-screen-xl mx-auto w-full flex flex-col gap-2 sm:flex-row items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-teal-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Still App. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm text-gray-500 hover:underline underline-offset-4 dark:text-gray-400"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-sm text-gray-500 hover:underline underline-offset-4 dark:text-gray-400"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-sm text-gray-500 hover:underline underline-offset-4 dark:text-gray-400"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
