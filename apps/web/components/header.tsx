import Link from 'next/link'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-10 glass-panel shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold gradient-text">TheraGPT</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/new-entry"
            className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            New Entry
          </Link>
          <Link
            href="/journal"
            className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Journal
          </Link>
          <Link
            href="/distortions"
            className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Cognitive Distortions
          </Link>
          <ThemeToggle />
        </nav>

        <div className="md:hidden flex items-center">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/new-entry">New Entry</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/journal">Journal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cognitive-distortions">Cognitive Distortions</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
