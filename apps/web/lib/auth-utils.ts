'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useIsAuthenticated, useAuthLoading } from '@theragpt/logic'

/**
 * Configuration for route protection
 */
export interface RouteProtectionConfig {
  /** Redirect path for unauthenticated users */
  redirectTo?: string
  /** Whether to show loading state during auth check */
  showLoading?: boolean
  /** Custom loading component */
  loadingComponent?: React.ComponentType
}

/**
 * Hook for protecting routes that require authentication
 * Redirects unauthenticated users to signin page
 */
export const useRouteProtection = (config: RouteProtectionConfig = {}) => {
  const {
    redirectTo = '/signin',
    showLoading = true,
  } = config

  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const { isInitialized } = useAuthLoading()

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      // Store the current path as intended destination
      const currentPath = window.location.pathname + window.location.search
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [isAuthenticated, isInitialized, router, redirectTo])

  const shouldShowLoading = !isInitialized && showLoading
  const shouldRender = isInitialized && isAuthenticated

  return {
    isAuthenticated,
    isInitialized,
    shouldShowLoading,
    shouldRender,
  }
}

/**
 * Hook for handling authentication redirects
 * Extracts and handles redirect parameter from URL
 */
export const useAuthRedirect = () => {
  const router = useRouter()

  const getRedirectPath = (): string => {
    if (typeof window === 'undefined') return '/journal'

    const urlParams = new URLSearchParams(window.location.search)
    const redirectPath = urlParams.get('redirect')

    // Validate redirect path to prevent open redirects
    if (redirectPath && redirectPath.startsWith('/') && !redirectPath.startsWith('//')) {
      return redirectPath
    }

    return '/journal'
  }

  const redirectAfterAuth = () => {
    const redirectPath = getRedirectPath()
    console.debug('redirectAfterAuth redirectPath', redirectPath)
    router.push(redirectPath)
  }

  return {
    getRedirectPath,
    redirectAfterAuth,
  }
}

/**
 * Hook for preventing authenticated users from accessing auth pages
 * Redirects authenticated users away from signin/signup pages
 */
export const useAuthPageProtection = (redirectTo: string = '/journal') => {
  const router = useRouter()
  const isAuthenticated = useIsAuthenticated()
  const { isInitialized } = useAuthLoading()

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isInitialized, router, redirectTo])

  return {
    isAuthenticated,
    isInitialized,
    shouldRender: isInitialized && !isAuthenticated,
    shouldShowLoading: !isInitialized,
  }
}