import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - TheraGPT',
  description: 'Sign in to your TheraGPT account to access your AI-assisted CBT journal and continue your mental health journey.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}