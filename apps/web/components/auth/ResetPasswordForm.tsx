'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePasswordReset } from '@theragpt/logic'

interface ResetPasswordFormProps {
  onBack?: () => void
}

export const ResetPasswordForm = ({ onBack }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState('')
  const { resetPassword, isLoading, error, isSuccess, clearState } = usePasswordReset()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      return
    }

    await resetPassword(email)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) clearState()
  }

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent a password reset link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md mb-4">
            <p>If you don't see the email in your inbox, please check your spam folder.</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={onBack}
              variant="outline"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !email}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-primary underline"
              disabled={isLoading}
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}