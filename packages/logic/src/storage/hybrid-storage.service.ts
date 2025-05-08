import { StorageService, CrossPlatformStorageService } from './storage.service'
import { SupabaseStorageService } from './supabase-storage.service'
import { supabaseAuthService } from '../auth/supabase-auth.service'
import { User } from '@supabase/supabase-js'

/**
 * Storage mode enum
 */
export enum StorageMode {
  DEVICE_ONLY = 'device_only',
  HYBRID = 'hybrid',
}

/**
 * Hybrid storage service that can use both device storage and Supabase
 * - When authenticated, it stores data in both device storage and Supabase by default
 * - When not authenticated, it falls back to device storage only
 * - On sign-up, it copies data from device to Supabase
 * - On sign-in, it merges data from device to Supabase
 */
export class HybridStorageService implements StorageService {
  private deviceStorage: StorageService
  private supabaseStorage: SupabaseStorageService
  private mode: StorageMode = StorageMode.HYBRID
  private isAuthenticated: boolean = false
  private unsubscribeAuth: (() => void) | null = null

  constructor() {
    this.deviceStorage = new CrossPlatformStorageService()
    this.supabaseStorage = new SupabaseStorageService()

    // Initialize authentication state
    this.isAuthenticated = supabaseAuthService.isAuthenticated()

    // Subscribe to auth state changes
    this.unsubscribeAuth = supabaseAuthService.onAuthStateChange(this.handleAuthStateChange.bind(this))
  }

  /**
   * Handle authentication state changes
   * @param user The authenticated user or null if signed out
   */
  private async handleAuthStateChange(user: User | null): Promise<void> {
    const wasAuthenticated = this.isAuthenticated
    this.isAuthenticated = !!user

    // If user just signed in (wasn't authenticated before but is now)
    if (!wasAuthenticated && this.isAuthenticated) {
      // Check if this is a new user (sign-up) or existing user (sign-in)
      const isNewUser = user?.app_metadata?.provider === 'email' &&
                        user?.created_at === user?.updated_at

      if (isNewUser) {
        // For new users, copy data from device to Supabase
        await this.copyFromDeviceToSupabase()
      } else {
        // For existing users, merge data from device to Supabase
        await this.mergeFromDeviceToSupabase()
      }
    }
  }

  /**
   * Copy all data from device storage to Supabase
   */
  private async copyFromDeviceToSupabase(): Promise<void> {
    try {
      // Get all keys from device storage
      const keys = await this.deviceStorage.getAllKeys()

      // Copy each item to Supabase
      for (const key of keys) {
        const value = await this.deviceStorage.getItem(key)
        if (value !== null) {
          await this.supabaseStorage.setItem(key, value)
        }
      }

      console.log('Successfully copied data from device to Supabase')
    } catch (error) {
      console.error('Error copying data from device to Supabase:', error)
    }
  }

  /**
   * Merge data from device storage to Supabase
   * This will keep the newest version of each item based on timestamps
   * or add items that don't exist in Supabase
   */
  private async mergeFromDeviceToSupabase(): Promise<void> {
    try {
      // Get all keys from device storage
      const deviceKeys = await this.deviceStorage.getAllKeys()

      // For each key in device storage
      for (const key of deviceKeys) {
        const deviceValue = await this.deviceStorage.getItem(key)
        if (deviceValue === null) continue

        // Check if the item exists in Supabase
        const supabaseValue = await this.supabaseStorage.getItem(key)

        // If the item doesn't exist in Supabase, add it
        if (supabaseValue === null) {
          await this.supabaseStorage.setItem(key, deviceValue)
          continue
        }

        // If both exist, compare timestamps if available
        if (deviceValue && typeof deviceValue === 'object' && 'updatedAt' in deviceValue &&
            supabaseValue && typeof supabaseValue === 'object' && 'updatedAt' in supabaseValue) {
          // Keep the newer version
          const deviceTimestamp = (deviceValue as any).updatedAt
          const supabaseTimestamp = (supabaseValue as any).updatedAt

          if (deviceTimestamp > supabaseTimestamp) {
            await this.supabaseStorage.setItem(key, deviceValue)
          }
        } else {
          // If no timestamps, just keep the device version (user's latest work)
          await this.supabaseStorage.setItem(key, deviceValue)
        }
      }

      console.log('Successfully merged data from device to Supabase')
    } catch (error) {
      console.error('Error merging data from device to Supabase:', error)
    }
  }

  /**
   * Set the storage mode
   * @param mode The storage mode to use
   */
  public setMode(mode: StorageMode): void {
    this.mode = mode
  }

  /**
   * Get the current storage mode
   * @returns The current storage mode
   */
  public getMode(): StorageMode {
    return this.mode
  }

  /**
   * Gets an item from storage
   * @param key The key to get
   * @returns The item or null if not found
   */
  public async getItem<T>(key: string): Promise<T | null> {
    try {
      // Always try to get from device storage first
      const deviceValue = await this.deviceStorage.getItem<T>(key)

      // If authenticated and in hybrid mode, also check Supabase
      if (this.isAuthenticated && this.mode === StorageMode.HYBRID) {
        const supabaseValue = await this.supabaseStorage.getItem<T>(key)

        // If both exist, compare timestamps if available
        if (deviceValue && typeof deviceValue === 'object' && 'updatedAt' in deviceValue &&
            supabaseValue && typeof supabaseValue === 'object' && 'updatedAt' in supabaseValue) {
          // Return the newer version
          const deviceTimestamp = (deviceValue as any).updatedAt
          const supabaseTimestamp = (supabaseValue as any).updatedAt

          return deviceTimestamp > supabaseTimestamp ? deviceValue : supabaseValue
        }

        // If Supabase has a value but device doesn't, return Supabase value
        if (deviceValue === null && supabaseValue !== null) {
          return supabaseValue
        }
      }

      // Default to device value
      return deviceValue
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error)
      return null
    }
  }

  /**
   * Sets an item in storage
   * @param key The key to set
   * @param value The value to set
   */
  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      // Always store in device storage
      await this.deviceStorage.setItem(key, value)

      // If authenticated and in hybrid mode, also store in Supabase
      if (this.isAuthenticated && this.mode === StorageMode.HYBRID) {
        await this.supabaseStorage.setItem(key, value)
      }
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error)
    }
  }

  /**
   * Removes an item from storage
   * @param key The key to remove
   * @returns True if removed, false if not found
   */
  public async removeItem(key: string): Promise<boolean> {
    try {
      // Always remove from device storage
      const deviceResult = await this.deviceStorage.removeItem(key)

      // If authenticated and in hybrid mode, also remove from Supabase
      if (this.isAuthenticated && this.mode === StorageMode.HYBRID) {
        await this.supabaseStorage.removeItem(key)
      }

      return deviceResult
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error)
      return false
    }
  }

  /**
   * Gets all keys in storage
   * @returns Array of keys
   */
  public async getAllKeys(): Promise<string[]> {
    try {
      // Get keys from device storage
      const deviceKeys = await this.deviceStorage.getAllKeys()

      // If authenticated and in hybrid mode, also get keys from Supabase
      if (this.isAuthenticated && this.mode === StorageMode.HYBRID) {
        const supabaseKeys = await this.supabaseStorage.getAllKeys()

        // Combine keys and remove duplicates
        return [...new Set([...deviceKeys, ...supabaseKeys])]
      }

      return deviceKeys
    } catch (error) {
      console.error('Error getting all keys from storage', error)
      return []
    }
  }

  /**
   * Clears all items in storage
   */
  public async clear(): Promise<void> {
    try {
      // Always clear device storage
      await this.deviceStorage.clear()

      // If authenticated and in hybrid mode, also clear Supabase
      if (this.isAuthenticated && this.mode === StorageMode.HYBRID) {
        await this.supabaseStorage.clear()
      }
    } catch (error) {
      console.error('Error clearing storage', error)
    }
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.unsubscribeAuth) {
      this.unsubscribeAuth()
      this.unsubscribeAuth = null
    }
  }
}

// Export a singleton instance for convenience
export const hybridStorageService = new HybridStorageService()