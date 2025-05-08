import { StorageService } from './storage.service'
import { supabaseAuthService } from '../auth/supabase-auth.service'
import { SupabaseClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Storage service implementation that uses Supabase as the backend
 * This requires the user to be authenticated with Supabase
 */
export class SupabaseStorageService implements StorageService {
  private supabase: SupabaseClient
  private tableName = 'entries'

  constructor() {
    this.supabase = supabaseAuthService.getSupabaseClient()
  }

  /**
   * Gets an item from Supabase storage
   * @param key The key to get
   * @returns The item or null if not found
   */
  public async getItem<T>(key: string): Promise<T | null> {
    try {
      // Check if user is authenticated
      if (!supabaseAuthService.isAuthenticated()) {
        console.error('User must be authenticated to use Supabase storage')
        return null
      }

      const userId = supabaseAuthService.getCurrentUser()?.id

      // Query the database for the item with the given key for the current user
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('value')
        .eq('user_id', userId)
        .eq('key', key)
        .single()

      if (error) {
        // If the error is that no rows were returned, return null
        if (error.code === 'PGRST116') {
          return null
        }
        console.error(`Error getting item from Supabase: ${key}`, error)
        return null
      }

      return data ? JSON.parse(data.value) : null
    } catch (error) {
      console.error(`Error getting item from Supabase: ${key}`, error)
      return null
    }
  }

  /**
   * Sets an item in Supabase storage
   * @param key The key to set
   * @param value The value to set
   */
  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      // Check if user is authenticated
      if (!supabaseAuthService.isAuthenticated()) {
        console.error('User must be authenticated to use Supabase storage')
        return
      }

      const userId = supabaseAuthService.getCurrentUser()?.id
      const stringValue = JSON.stringify(value)

      // Check if the item already exists
      const { data: existingData } = await this.supabase
        .from(this.tableName)
        .select('id')
        .eq('user_id', userId)
        .eq('key', key)
        .single()

      if (existingData) {
        // Update existing item
        const { error } = await this.supabase
          .from(this.tableName)
          .update({ value: stringValue, updated_at: new Date().toISOString() })
          .eq('id', existingData.id)

        if (error) {
          console.error(`Error updating item in Supabase: ${key}`, error)
        }
      } else {
        // Insert new item
        const { error } = await this.supabase
          .from(this.tableName)
          .insert({
            id: uuidv4(),
            user_id: userId,
            key,
            value: stringValue,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error(`Error inserting item in Supabase: ${key}`, error)
        }
      }
    } catch (error) {
      console.error(`Error setting item in Supabase: ${key}`, error)
    }
  }

  /**
   * Removes an item from Supabase storage
   * @param key The key to remove
   * @returns True if removed, false if not found or error
   */
  public async removeItem(key: string): Promise<boolean> {
    try {
      // Check if user is authenticated
      if (!supabaseAuthService.isAuthenticated()) {
        console.error('User must be authenticated to use Supabase storage')
        return false
      }

      const userId = supabaseAuthService.getCurrentUser()?.id

      // Delete the item with the given key for the current user
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId)
        .eq('key', key)

      if (error) {
        console.error(`Error removing item from Supabase: ${key}`, error)
        return false
      }

      return true
    } catch (error) {
      console.error(`Error removing item from Supabase: ${key}`, error)
      return false
    }
  }

  /**
   * Gets all keys in Supabase storage for the current user
   * @returns Array of keys
   */
  public async getAllKeys(): Promise<string[]> {
    try {
      // Check if user is authenticated
      if (!supabaseAuthService.isAuthenticated()) {
        console.error('User must be authenticated to use Supabase storage')
        return []
      }

      const userId = supabaseAuthService.getCurrentUser()?.id

      // Query the database for all keys for the current user
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('key')
        .eq('user_id', userId)

      if (error) {
        console.error('Error getting all keys from Supabase', error)
        return []
      }

      return data ? data.map(item => item.key) : []
    } catch (error) {
      console.error('Error getting all keys from Supabase', error)
      return []
    }
  }

  /**
   * Clears all items in Supabase storage for the current user
   */
  public async clear(): Promise<void> {
    try {
      // Check if user is authenticated
      if (!supabaseAuthService.isAuthenticated()) {
        console.error('User must be authenticated to use Supabase storage')
        return
      }

      const userId = supabaseAuthService.getCurrentUser()?.id

      // Delete all items for the current user
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('user_id', userId)

      if (error) {
        console.error('Error clearing Supabase storage', error)
      }
    } catch (error) {
      console.error('Error clearing Supabase storage', error)
    }
  }
}

// Export a singleton instance for convenience
export const supabaseStorageService = new SupabaseStorageService()