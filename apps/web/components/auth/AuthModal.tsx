'use client'

import { useState } from 'react'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'
import { ResetPasswordForm } from './ResetPasswordForm'

type AuthMode = 'signin' | 'signup' | 'reset'

interface AuthModalProps {
  defaultMode?: AuthMode
  onSuccess?: () => void
  onClose?: () => void
}

export const AuthModal = ({ defaultMode = 'signin', onSuccess, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode)

  const handleSuccess = () => {
    onSuccess?.()
    onClose?.()
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        {mode === 'signin' && (
          <SignInForm
            onSuccess={handleSuccess}
            onSwitchToSignUp={() => setMode('signup')}
            onSwitchToReset={() => setMode('reset')}
          />
        )}
        
        {mode === 'signup' && (
          <SignUpForm
            onSuccess={handleSuccess}
            onSwitchToSignIn={() => setMode('signin')}
          />
        )}
        
        {mode === 'reset' && (
          <ResetPasswordForm
            onBack={() => setMode('signin')}
          />
        )}
      </div>
    </div>
  )
}