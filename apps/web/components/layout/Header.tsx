import Link from 'next/link'
import { Button } from '../ui/button'
import { ThemeToggle } from './theme/ThemeToggle'
import { TrackedLink } from './TrackedLink'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import TheraGPTLogo from '@/apps/web/public/assets/theragpt-logo.svg'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/apps/web/components/ui/navigation-menu'

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
            {MENU_ITEMS.map(item => (
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
          </NavigationMenuList>
        </NavigationMenu>

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
              {MENU_ITEMS.map(item => (
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
