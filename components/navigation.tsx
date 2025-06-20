'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Menu,
  Home,
  CheckSquare,
  DollarSign,
  UtensilsCrossed,
  Activity,
  Calendar,
  TrendingUp,
  PiggyBank
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Finance', href: '/finance', icon: DollarSign },
  { name: 'Budget', href: '/budget', icon: PiggyBank },
  { name: 'Meals', href: '/meals', icon: UtensilsCrossed },
  { name: 'Fitness', href: '/fitness', icon: Activity },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
]

export function Navigation() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg hover-glow">
                  <span className="text-white font-bold text-lg">J</span>
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl gradient-text">Jarvis</span>
                <span className="text-xs text-muted-foreground -mt-1">AI Assistant</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {session && (
              <div className="flex items-center space-x-1">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className="group relative flex items-center space-x-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-xl hover:bg-white/10"
                      >
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="relative">
                          {item.name}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {session ? (
              <>
                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                        <AvatarFallback>
                          {getInitials(session.user?.name || 'User')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {session.user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Navigation</SheetTitle>
                        <SheetDescription>
                          Access all features of your self-development app
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        {navigationItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center space-x-2 text-sm font-medium p-2 rounded-md hover:bg-accent"
                            >
                              <Icon className="h-4 w-4" />
                              <span>{item.name}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}