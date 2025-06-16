import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up - TheraGPT',
  description: 'Create your TheraGPT account to start your AI-assisted CBT journal and begin your mental health journey with personalized insights.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}