'use client'

import Link from 'next/link'
import { SignInForm } from '@/components/auth/SignInForm'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { useAuthPageProtection, useAuthRedirect } from '@/lib/auth-utils'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthLoadingSpinner } from '@/components/auth/AuthLoadingSpinner'

const SignInPageContent = () => {
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

  const handleSignInSuccess = () => {
    redirectAfterAuth()
  }

  const handleSwitchToSignUp = () => {
    // Preserve redirect parameter when switching to signup
    const redirectPath = getRedirectPath()
    const signupUrl = redirectPath !== '/journal'
      ? `/signup?redirect=${encodeURIComponent(redirectPath)}`
      : '/signup'
    window.location.href = signupUrl
  }

  const handleSwitchToReset = () => {
    // TODO: Implement password reset page
    console.warn('Password reset not implemented yet')
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
          <SignInForm
            onSuccess={handleSignInSuccess}
            onSwitchToSignUp={handleSwitchToSignUp}
            onSwitchToReset={handleSwitchToReset}
          />

          {/* Additional navigation */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              New to TheraGPT?{' '}
              <Link
                href="/signup"
                className="text-primary hover:underline font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignInPageContent />
    </AuthProvider>
  )
}