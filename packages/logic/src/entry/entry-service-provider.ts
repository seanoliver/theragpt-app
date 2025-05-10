import { supabaseAuthService } from '../auth/supabase-auth.service'
import { BaseEntryService } from './base-entry.service'
import { entryService } from './entry.service'
import { supabaseEntryService } from './supabase-entry.service'

/**
 * Service provider that selects the appropriate entry service based on authentication state
 */
export class EntryServiceProvider {
  public static instance = new EntryServiceProvider()
  private currentService: BaseEntryService
  private unsubscribeAuth: (() => void) | null = null

  private constructor() {
    // Default to local entry service
    this.currentService = entryService

    // Subscribe to auth state changes
    this.unsubscribeAuth = supabaseAuthService.onAuthStateChange(this.handleAuthStateChange.bind(this))

    // Initialize with current auth state
    this.handleAuthStateChange(supabaseAuthService.getCurrentUser())
  }

  /**
   * Handle authentication state changes
   * @param user The authenticated user or null if signed out
   */
  private handleAuthStateChange(user: any | null): void {
    if (user) {
      // If authenticated, use Supabase entry service
      this.currentService = supabaseEntryService
    } else {
      // If not authenticated, use local entry service
      this.currentService = entryService
    }
  }

  /**
   * Get the current entry service
   * @returns The current entry service
   */
  public getCurrentService(): BaseEntryService {
    return this.currentService
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

// TODO: Remove this exported constant and use EntryServiceProvider.instance directly.
// This will require updating imports throughout the codebase.
// Export a singleton instance for convenience
export const entryServiceProvider = EntryServiceProvider.instance