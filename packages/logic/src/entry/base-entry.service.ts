import { Entry, EntryListener } from './types'

/**
 * Base abstract class for entry services
 */
export abstract class BaseEntryService {
  protected entryCache: Entry[] | null = null
  protected entryMap: Map<string, Entry> = new Map()
  protected listeners: EntryListener[] = []

  /**
   * Subscribe to entry changes
   * @param listener Function to call when entries change
   * @returns Unsubscribe function
   */
  subscribe(listener: EntryListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notify all listeners of entry changes
   * @param entries Updated entries
   */
  protected notifyListeners(entries: Entry[]) {
    this.listeners.forEach(listener => listener(entries))
  }

  /**
   * Initialize the service
   * @returns All entries for the current user
   */
  abstract init(): Promise<Entry[]>

  /**
   * Create a new entry
   * @param params Entry data
   * @returns The created entry
   */
  abstract create(params: Entry): Promise<Entry>

  /**
   * Update an existing entry
   * @param params Entry data with updated fields
   * @returns The updated entry
   */
  abstract update(params: Entry): Promise<Entry>

  /**
   * Get all entries
   * @returns Array of entries
   */
  abstract getAll(): Promise<Entry[]>

  /**
   * Get an entry by ID
   * @param id Entry ID
   * @returns The entry or undefined if not found
   */
  abstract getById(id: string): Promise<Entry | undefined>

  /**
   * Delete an entry
   * @param id Entry ID
   */
  abstract deleteEntry(id: string): Promise<void>

  /**
   * Update the cache with new entries
   * @param entries New entries
   */
  protected updateCache(entries: Entry[]): void {
    this.entryCache = entries
    this.entryMap = new Map(entries.map(entry => [entry.id, entry]))
  }
}