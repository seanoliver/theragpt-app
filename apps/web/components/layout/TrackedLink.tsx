'use client'

import Link from 'next/link'
import { useTracking } from '@/lib/analytics/useTracking'

interface TrackedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  ctaText?: string
  ctaLocation?: string
}

export const TrackedLink = ({ 
  href, 
  children, 
  className, 
  ctaText, 
  ctaLocation = 'header',
}: TrackedLinkProps) => {
  const { track } = useTracking()

  const handleClick = () => {
    track('cta_clicked', {
      cta_text: ctaText || children?.toString() || 'Unknown',
      cta_location: ctaLocation,
      destination: href,
    })
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}