import { createClient } from '@supabase/supabase-js'
import { getEnvironment } from './environment'
import type { Database } from './database.types'

// Get Supabase configuration
export const getSupabaseConfig = () => {
  const env = getEnvironment()
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
    )
  }

  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  }
}

// Create Supabase client
export const createSupabaseClient = () => {
  const config = getSupabaseConfig()
  
  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Lazy client instance
let _supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (!_supabaseClient) {
    _supabaseClient = createSupabaseClient()
  }
  return _supabaseClient
}