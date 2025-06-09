'use client'

import Link from 'next/link'
import { Button } from '../ui/button'
import { ThemeToggle } from './theme/ThemeToggle'
import { TrackedLink } from './TrackedLink'
import { UserMenu } from '../auth/UserMenu'
import { Menu, LogIn, UserPlus } from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import TheraGPTLogo from '@/public/assets/theragpt-logo.svg'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useIsAuthenticated, useAuthLoading } from '@theragpt/logic'

const MENU_ITEMS = [
  {
    label: 'New Entry',
    href: '/new-entry',
  },
  {
    label: 'Journal',
    href: '/journal',
  },
]

export const Header = () => {
  const isAuthenticated = useIsAuthenticated()
  const { isInitialized } = useAuthLoading()

  // Filter menu items based on authentication state
  const visibleMenuItems = isAuthenticated
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.href === '/') // Only show home for unauthenticated users

  const renderAuthButtons = () => {
    if (!isInitialized) {
      return (
        <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      )
    }

    if (isAuthenticated) {
      return <UserMenu />
    }

    return (
      <div className="flex items-center gap-2">
        <Link href="/signin">
          <Button variant="ghost" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm" className="gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border-0">
            <UserPlus className="h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    )
  }

  const renderMobileAuthItems = () => {
    if (!isInitialized) return null

    if (isAuthenticated) {
      return null // UserMenu handles mobile auth for authenticated users
    }

    return (
      <>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <TrackedLink
            href="/signin"
            ctaText="Sign In"
            ctaLocation="header_mobile_menu"
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </TrackedLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <TrackedLink
            href="/signup"
            ctaText="Sign Up"
            ctaLocation="header_mobile_menu"
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Sign Up
          </TrackedLink>
        </DropdownMenuItem>
      </>
    )
  }

  return (
    <header className="sticky top-0 z-10 glass-panel shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={TheraGPTLogo}
            alt="TheraGPT Logo"
            width={32}
            height={32}
          />
          <span className="text-2xl font-bold gradient-text font-heading">
            TheraGPT
          </span>
        </Link>

        <NavigationMenu className="hidden md:flex items-center space-x-8">
          <NavigationMenuList>
            {visibleMenuItems.map(item => (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  className={navigationMenuTriggerStyle()}
                  asChild
                >
                  <TrackedLink
                    href={item.href}
                    className="text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-body"
                    ctaText={item.label}
                    ctaLocation="header_nav"
                  >
                    {item.label}
                  </TrackedLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
            <NavigationMenuItem>
              {renderAuthButtons()}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="md:hidden flex items-center gap-2">
          {isAuthenticated && <UserMenu />}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-panel">
              {visibleMenuItems.map(item => (
                <DropdownMenuItem asChild key={item.href}>
                  <TrackedLink
                    href={item.href}
                    ctaText={item.label}
                    ctaLocation="header_mobile_menu"
                  >
                    {item.label}
                  </TrackedLink>
                </DropdownMenuItem>
              ))}
              {renderMobileAuthItems()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
