import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import { getSupabaseConfig } from '@theragpt/config'
import type { Database } from '@theragpt/config/src/database.types'

// Get configuration from shared config
const config = getSupabaseConfig()

// Custom storage adapter for React Native using Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient<Database>(config.url, config.anonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // We don't want this on mobile
  },
})

// Lazy client instance for consistency with web
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!_supabaseClient) {
    _supabaseClient = supabase
  }
  return _supabaseClient
}