import { getSupabaseClient } from '@theragpt/config'
import { EntryService } from './entry.service'
import { Entry } from './types'
import { mapAppEntryToDbEntry, mapAppReframeToDbReframe, mapAppDistortionInstanceToDb } from './type-mappers'

export class MigrationService {
  /**
   * Migrate existing local storage entries to Supabase
   * This should be called once after user authentication
   */
  static async migrateLocalEntriesToSupabase(entryService: EntryService): Promise<void> {
    try {
      const { data: { user } } = await getSupabaseClient().auth.getUser()
      if (!user) {
        // eslint-disable-next-line no-console
        console.warn('User not authenticated, skipping migration')
        return
      }

      // Get existing entries from local storage
      const localEntries = await entryService['getFromLocalStorage']()
      if (localEntries.length === 0) {
        // eslint-disable-next-line no-console
        console.log('No local entries to migrate')
        return
      }

      // Check if user already has entries in Supabase
      const { data: existingEntries } = await getSupabaseClient()
        .from('entries')
        .select('id')
        .limit(1)

      if (existingEntries && existingEntries.length > 0) {
        // eslint-disable-next-line no-console
        console.log('User already has entries in Supabase, skipping migration')
        return
      }

      // eslint-disable-next-line no-console
      console.log(`Starting migration of ${localEntries.length} entries...`)

      // Migrate each entry
      for (const entry of localEntries) {
        await this.migrateEntry(entry, user.id)
      }

      // eslint-disable-next-line no-console
      console.log('Migration completed successfully')
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  }

  private static async migrateEntry(entry: Entry, userId: string): Promise<void> {
    // Insert the main entry
    const dbEntry = mapAppEntryToDbEntry(entry)
    const { error: entryError } = await getSupabaseClient()
      .from('entries')
      .insert({ ...dbEntry, user_id: userId })

    if (entryError) {
      console.error(`Failed to migrate entry ${entry.id}:`, entryError)
      return
    }

    // Insert reframe if exists
    if (entry.reframe) {
      const dbReframe = mapAppReframeToDbReframe(entry.reframe)
      const { error: reframeError } = await getSupabaseClient()
        .from('reframes')
        .insert(dbReframe)

      if (reframeError) {
        console.warn(`Failed to migrate reframe for entry ${entry.id}:`, reframeError)
      }
    }

    // Insert distortion instances if exist
    if (entry.distortions && entry.distortions.length > 0) {
      const dbDistortions = entry.distortions.map(d => mapAppDistortionInstanceToDb(d, entry.id))
      const { error: distortionsError } = await getSupabaseClient()
        .from('distortion_instances')
        .insert(dbDistortions)

      if (distortionsError) {
        console.warn(`Failed to migrate distortions for entry ${entry.id}:`, distortionsError)
      }
    }
  }

  /**
   * Clear local storage after successful migration
   * Call this only after confirming migration was successful
   */
  static async clearLocalStorageAfterMigration(entryService: EntryService): Promise<void> {
    try {
      await entryService['storageService'].removeItem('theragpt_entries')
      // eslint-disable-next-line no-console
      console.log('Local storage cleared after migration')
    } catch (error) {
      console.error('Failed to clear local storage:', error)
    }
  }
}