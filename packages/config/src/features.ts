// Feature flags for the application
export type FeatureFlags = {
  enableOfflineMode: boolean
  enableDataSync: boolean
  enableNotifications: boolean
  enableAnalytics: boolean
  enableDarkMode: boolean
  maxSavedReframes: number
}

// Default feature flags for development
export const DEV_FEATURE_FLAGS: FeatureFlags = {
  enableOfflineMode: true,
  enableDataSync: false,
  enableNotifications: true,
  enableAnalytics: false,
  enableDarkMode: true,
  maxSavedReframes: 100,
}

// Feature flags for production
export const PROD_FEATURE_FLAGS: FeatureFlags = {
  enableOfflineMode: true,
  enableDataSync: false, // Will be enabled in future with Supabase
  enableNotifications: true,
  enableAnalytics: true,
  enableDarkMode: true,
  maxSavedReframes: 1000,
}

// Get feature flags based on environment
export const getFeatureFlags = (): FeatureFlags => {
  const isDev = process.env.NODE_ENV !== 'production'
  return isDev ? DEV_FEATURE_FLAGS : PROD_FEATURE_FLAGS
}