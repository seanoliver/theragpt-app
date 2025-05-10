import { BaseUserService } from './base-user.service'
import { supabaseUserService } from './supabase-user.service'

/**
 * Service provider that manages user authentication services
 */
export class UserServiceProvider {
  public static instance = new UserServiceProvider()
  private currentService: BaseUserService
  private listeners: Array<(service: BaseUserService) => void> = []

  private constructor() {
    // Default to Supabase user service
    this.currentService = supabaseUserService

    // Initialize the service
    this.initialize()
  }

  /**
   * Initialize the user service
   */
  private async initialize(): Promise<void> {
    try {
      await this.currentService.init()
    } catch (error) {
      console.error('Failed to initialize user service', error)
    }
  }

  /**
   * Get the current user service
   * @returns The current user service
   */
  public getCurrentService(): BaseUserService {
    return this.currentService
  }

  /**
   * Subscribe to service changes
   * @param listener Function to call when service changes
   * @returns Unsubscribe function
   */
  public subscribe(listener: (service: BaseUserService) => void): () => void {
    this.listeners.push(listener)
    // Immediately notify the listener of the current service
    listener(this.currentService)

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of service changes
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentService))
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    // Any cleanup needed
  }
}

// TODO: Remove this exported constant and use UserServiceProvider.instance directly.
// This will require updating imports throughout the codebase.
// Export a singleton instance for convenience
export const userServiceProvider = UserServiceProvider.instance