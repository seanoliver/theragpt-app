'use client'

import Link from 'next/link'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { useAuthPageProtection, useAuthRedirect } from '@/lib/auth-utils'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLoadingSpinner } from '@/components/auth/AuthLoadingSpinner'

const SignUpPageContent = () => {
  const { shouldShowLoading, shouldRender } = useAuthPageProtection()
  const { redirectAfterAuth, getRedirectPath } = useAuthRedirect()

  // Don't render anything while checking auth state
  if (shouldShowLoading) {
    return <AuthLoadingSpinner />
  }

  // Don't render if authenticated (will redirect)
  if (!shouldRender) {
    return null
  }

  const handleSignUpSuccess = () => {
    redirectAfterAuth()
  }

  const handleSwitchToSignIn = () => {
    // Preserve redirect parameter when switching to signin
    const redirectPath = getRedirectPath()
    const signinUrl = redirectPath !== '/journal'
      ? `/signin?redirect=${encodeURIComponent(redirectPath)}`
      : '/signin'
    window.location.href = signinUrl
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with back button */}
      <header className="p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <SignUpForm
            onSuccess={handleSignUpSuccess}
            onSwitchToSignIn={handleSwitchToSignIn}
          />

          {/* Additional navigation */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <AuthProvider>
      <SignUpPageContent />
    </AuthProvider>
  )
}