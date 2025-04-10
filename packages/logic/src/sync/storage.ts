// Import AsyncStorage conditionally to avoid issues in web environments
// Define a type for AsyncStorage to avoid using 'any'
interface AsyncStorageType {
  getItem: (key: string) => Promise<string | null>
  setItem: (key: string, value: string) => Promise<void>
  removeItem: (key: string) => Promise<void>
  getAllKeys: () => Promise<readonly string[]>
  clear: () => Promise<void>
}

let AsyncStorage: AsyncStorageType | undefined
try {
  // This will only succeed in a React Native environment
  // Use dynamic import instead of require
  import('@react-native-async-storage/async-storage').then(module => {
    AsyncStorage = module.default
  })
} catch {
  // AsyncStorage is not available, we're in a web environment
}

/**
 * Determines if we're running in a React Native environment
 */
const isReactNative = (): boolean => {
  return typeof AsyncStorage !== 'undefined'
}

/**
 * Interface for the storage service
 */
export interface StorageService {
  /**
   * Gets an item from storage
   * @param key The key to get
   * @returns The item or null if not found
   */
  getItem<T>(key: string): Promise<T | null>

  /**
   * Sets an item in storage
   * @param key The key to set
   * @param value The value to set
   */
  setItem<T>(key: string, value: T): Promise<void>

  /**
   * Removes an item from storage
   * @param key The key to remove
   * @returns True if removed, false if not found
   */
  removeItem(key: string): Promise<boolean>

  /**
   * Gets all keys in storage
   * @returns Array of keys
   */
  getAllKeys(): Promise<string[]>

  /**
   * Clears all items in storage
   */
  clear(): Promise<void>
}

/**
 * Storage service implementation that works in both web and mobile environments
 */
export class CrossPlatformStorageService implements StorageService {
  /**
   * Gets an item from storage
   * @param key The key to get
   * @returns The item or null if not found
   */
  public async getItem<T>(key: string): Promise<T | null> {
    try {
      let data: string | null = null

      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        data = (await AsyncStorage?.getItem(key)) || null
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        data = localStorage.getItem(key)
      }

      return data ? JSON.parse(data) : null
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
      const data = JSON.stringify(value)

      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        await AsyncStorage?.setItem(key, data)
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        localStorage.setItem(key, data)
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
      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        await AsyncStorage?.removeItem(key)
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        localStorage.removeItem(key)
      }
      return true
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
      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        const keys = (await AsyncStorage?.getAllKeys()) || []
        // Convert readonly array to mutable array
        return [...keys]
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        const keys: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            keys.push(key)
          }
        }
        return keys
      }
      return []
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
      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        await AsyncStorage?.clear()
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        localStorage.clear()
      }
    } catch (error) {
      console.error('Error clearing storage', error)
    }
  }
}

// Export a singleton instance for convenience
export const storageService = new CrossPlatformStorageService()
