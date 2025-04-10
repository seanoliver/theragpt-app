import { Reframe } from '../reframe/types'

// Import AsyncStorage conditionally to avoid issues in web environments
let AsyncStorage: any
try {
  // This will only succeed in a React Native environment
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
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
   * Saves a reframe to storage
   * @param reframe The reframe to save
   */
  saveReframe(reframe: Reframe): Promise<void>

  /**
   * Gets a reframe by ID
   * @param id The reframe ID
   * @returns The reframe or null if not found
   */
  getReframeById(id: string): Promise<Reframe | null>

  /**
   * Gets all reframes from storage
   * @returns Array of reframes
   */
  getAllReframes(): Promise<Reframe[]>

  /**
   * Deletes a reframe by ID
   * @param id The reframe ID
   * @returns True if deleted, false if not found
   */
  deleteReframe(id: string): Promise<boolean>

  /**
   * Clears all reframes from storage
   */
  clearReframes(): Promise<void>
}

/**
 * Storage service implementation that works in both web and mobile environments
 */
export class CrossPlatformStorageService implements StorageService {
  private storageKey = 'theragpt_reframes'

  /**
   * Saves a reframe to storage
   * @param reframe The reframe to save
   */
  public async saveReframe(reframe: Reframe): Promise<void> {
    const reframes = await this.getAllReframes()
    const index = reframes.findIndex(r => r.id === reframe.id)

    if (index >= 0) {
      // Update existing reframe
      reframes[index] = reframe
    } else {
      // Add new reframe
      reframes.push(reframe)
    }

    await this.saveReframes(reframes)
  }

  /**
   * Gets a reframe by ID
   * @param id The reframe ID
   * @returns The reframe or null if not found
   */
  public async getReframeById(id: string): Promise<Reframe | null> {
    const reframes = await this.getAllReframes()
    return reframes.find(r => r.id === id) || null
  }

  /**
   * Gets all reframes from storage
   * @returns Array of reframes
   */
  public async getAllReframes(): Promise<Reframe[]> {
    try {
      let data: string | null = null

      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        data = await AsyncStorage.getItem(this.storageKey)
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        data = localStorage.getItem(this.storageKey)
      }

      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error getting reframes from storage', error)
      return []
    }
  }

  /**
   * Deletes a reframe by ID
   * @param id The reframe ID
   * @returns True if deleted, false if not found
   */
  public async deleteReframe(id: string): Promise<boolean> {
    const reframes = await this.getAllReframes()
    const initialLength = reframes.length
    const filteredReframes = reframes.filter(r => r.id !== id)

    if (filteredReframes.length === initialLength) {
      return false
    }

    await this.saveReframes(filteredReframes)
    return true
  }

  /**
   * Clears all reframes from storage
   */
  public async clearReframes(): Promise<void> {
    try {
      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        await AsyncStorage.removeItem(this.storageKey)
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        localStorage.removeItem(this.storageKey)
      }
    } catch (error) {
      console.error('Error clearing reframes from storage', error)
    }
  }

  /**
   * Saves reframes to storage
   * @param reframes The reframes to save
   */
  private async saveReframes(reframes: Reframe[]): Promise<void> {
    try {
      const data = JSON.stringify(reframes)

      if (isReactNative()) {
        // React Native environment - use AsyncStorage
        await AsyncStorage.setItem(this.storageKey, data)
      } else if (typeof localStorage !== 'undefined') {
        // Browser environment - use localStorage
        localStorage.setItem(this.storageKey, data)
      }
    } catch (error) {
      console.error('Error saving reframes to storage', error)
    }
  }
}

// Export a singleton instance for convenience
export const storageService = new CrossPlatformStorageService()