import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'
import { Entry, EntryListener, EntryInput } from './types'
import { reframeService } from '../reframe'

/**
 * Service for managing entries and their relationships with reframes.
 *
 * This service is responsible for:
 * 1. CRUD operations on entries
 * 2. Managing the relationship between entries and reframes
 * 3. Ensuring data consistency between entries and their reframes
 *
 * The relationship between entries and reframes is:
 * - Each reframe belongs to exactly one entry (via entryId)
 * - An entry can have multiple reframes (stored in its reframes array)
 *
 * When working with entries and reframes:
 * - Use this service's methods (addReframe, updateReframe, deleteReframe)
 *   instead of directly using ReframeService when you need to maintain
 *   the relationship between entries and reframes
 * - These methods ensure that both the reframe and the entry are updated correctly
 * - The loadReframesForEntries method ensures entries have their reframes loaded
 */
export class EntryService {
  private storageService: StorageService
  private storageKey = 'theragpt_entries'
  private entryCache: Entry[] | null = null
  private entryMap: Map<string, Entry> = new Map()
  private listeners: EntryListener[] = []

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  subscribe(listener: EntryListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(entries: Entry[]) {
    this.listeners.forEach(listener => listener(entries))
  }

  /**
   * Initializes the EntryService and ReframeService.
   *
   * This method must be called before using either service to ensure that
   * both entries and reframes are properly loaded from storage. The initialization
   * process follows these steps:
   *
   * 1. Initialize the ReframeService first to ensure reframes are available
   * 2. Load all entries from storage
   * 3. Notify listeners about the loaded entries
   *
   * The order is important because entries depend on reframes, so reframes
   * must be initialized first.
   *
   * @returns A promise that resolves to the loaded entries
   */
  async init(): Promise<Entry[]> {
    try {
      // Initialize reframes first
      await reframeService.init()

      // Then initialize entries
      const existingEntries = await this.getAll()
      this.notifyListeners(existingEntries)
      return existingEntries
    } catch (error) {
      console.error('Error initializing entries', error as Error)
      return []
    }
  }

  async create(params: EntryInput): Promise<Entry> {
    const entry: Entry = {
      id: uuidv4(),
      rawText: params.rawText,
      createdAt: Date.now(),
    }

    const entries = await this.getAll()
    entries.push(entry)
    await this.saveAllEntries(entries)
    this.notifyListeners(entries)

    return entry
  }

  async update(params: Entry): Promise<Entry> {
    const entries = await this.getAll()
    const index = entries.findIndex(a => a.id === params.id)

    if (index === -1) {
      throw new Error(`Entry with ID ${params.id} not found`)
    }

    const entry = entries[index]
    entries[index] = {
      ...entry,
      rawText: params.rawText ?? entry.rawText,
      distortions: params.distortions ?? entry.distortions,
      reframes: params.reframes ?? entry.reframes,
      tags: params.tags ?? entry.tags,
      reviewedAt: params.reviewedAt ?? entry.reviewedAt,
      reviewCount: params.reviewCount ?? entry.reviewCount,
      isPinned: params.isPinned ?? entry.isPinned,
      updatedAt: Date.now(),
    }

    await this.saveAllEntries(entries)
    this.notifyListeners(entries)

    return entries[index]
  }

  async getAll(): Promise<Entry[]> {
    if (this.entryCache) return this.entryCache
    try {
      const data = await this.storageService.getItem<Entry[]>(this.storageKey)
      this.updateCache(data || [])
      return this.entryCache!
    } catch (error) {
      console.error('Error getting entries from storage', error as Error)
      return []
    }
  }

  async getById(id: string): Promise<Entry | undefined> {
    return this.entryMap.get(id)
  }

  /**
   * Deletes an entry and all its associated reframes.
   *
   * This method ensures that both the entry and its reframes are properly deleted,
   * maintaining data consistency. The deletion process follows these steps:
   *
   * 1. Clear the entry's reframes array (using clearEntryReframes)
   * 2. Delete all reframes associated with the entry from storage (using ReframeService)
   * 3. Delete the entry itself from storage
   * 4. Notify listeners about the updated entries list
   *
   * @param id The ID of the entry to delete
   */
  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getAll()
    const index = entries.findIndex(a => a.id === id)
    if (index !== -1) {
      // Clear the entry's reframes array first
      await this.clearEntryReframes(id)

      // Delete all reframes associated with this entry
      await reframeService.deleteByEntryId(id)

      // Delete the entry
      entries.splice(index, 1)
      await this.saveAllEntries(entries)
      this.notifyListeners(entries)
    }
  }

  /**
   * Clears an entry's reframes array by setting it to an empty array.
   *
   * This method is used internally by deleteEntry to ensure that the entry's
   * reframes array is cleared before deleting the entry. It only updates the
   * entry object and does not delete the actual reframe objects from storage.
   *
   * @param entryId The ID of the entry to clear reframes for
   */
  async clearEntryReframes(entryId: string): Promise<void> {
    const entry = await this.getById(entryId)
    if (entry) {
      await this.update({
        ...entry,
        reframes: [], // Set to empty array
      })
    }
  }

  private async saveAllEntries(entries: Entry[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, entries)
      this.updateCache(entries)
    } catch (error) {
      console.error('Error saving entries to storage', error as Error)
    }
  }

  /**
   * Updates the entry cache and map with the provided entries.
   *
   * This method is called after retrieving entries from storage or after
   * making changes to entries. It:
   *
   * 1. Updates the entryCache with the provided entries
   * 2. Rebuilds the entryMap for fast lookups by ID
   * 3. Ensures each entry has its reframes loaded by calling loadReframesForEntries
   *
   * The loadReframesForEntries call is important for maintaining the relationship
   * between entries and reframes, ensuring that entries always have their associated
   * reframes available when needed.
   *
   * @param entries The entries to update the cache with
   */
  private updateCache(entries: Entry[]): void {
    this.entryCache = entries
    this.entryMap = new Map(entries.map(entry => [entry.id, entry]))

    // Ensure each entry has its reframes loaded
    this.loadReframesForEntries(entries).catch(error => {
      console.error('Error loading reframes for entries', error as Error)
    })
  }

  /**
   * Loads reframes for each entry and updates the entry objects in-place.
   *
   * This method is called automatically by updateCache to ensure that entries
   * have their reframes loaded when they are retrieved from storage. It only
   * loads reframes for entries that don't already have them.
   *
   * The method:
   * 1. Checks each entry to see if it has reframes loaded
   * 2. If not, fetches reframes for that entry from ReframeService
   * 3. Updates the entry object in-place with the fetched reframes
   *
   * @param entries The entries to load reframes for
   */
  private async loadReframesForEntries(entries: Entry[]): Promise<void> {
    // For each entry, load its reframes
    for (const entry of entries) {
      if (!entry.reframes) {
        const reframes = await reframeService.getByEntryId(entry.id)
        if (reframes.length > 0) {
          entry.reframes = reframes
        }
      }
    }
  }

  /**
   * Adds a reframe to an entry and saves it.
   *
   * This method handles both creating the reframe and updating the entry's reframes array,
   * ensuring data consistency between the two. It's the recommended way to create reframes
   * instead of using ReframeService.create() directly.
   *
   * Flow:
   * 1. Validates the entry exists
   * 2. Creates the reframe using ReframeService
   * 3. Gets all reframes for the entry (including the new one)
   * 4. Updates the entry with the complete reframes array
   * 5. Returns the updated entry with the new reframe included
   *
   * @param entryId The ID of the entry to add the reframe to
   * @param reframeInput The reframe input data
   * @returns The updated entry with the new reframe
   */
  async addReframe(entryId: string, reframeInput: Omit<import('../reframe').ReframeInput, 'entryId'>): Promise<Entry> {
    // Get the entry first
    const entry = await this.getById(entryId)
    if (!entry) {
      throw new Error(`Entry with ID ${entryId} not found`)
    }

    // Create the reframe
    await reframeService.create({
      ...reframeInput,
      entryId,
    })

    // Get all reframes for this entry (including the new one)
    const allReframes = await reframeService.getByEntryId(entryId)

    // Explicitly update the entry with the reframes
    const updatedEntry = await this.update({
      ...entry,
      reframes: allReframes,
    })

    return updatedEntry
  }

  /**
   * Updates a reframe associated with an entry.
   *
   * This method handles both updating the reframe and updating the entry's reframes array,
   * ensuring data consistency between the two. It's the recommended way to update reframes
   * instead of using ReframeService.update() directly.
   *
   * Flow:
   * 1. Gets the reframe to find its entryId
   * 2. Validates the entry exists
   * 3. Updates the reframe using ReframeService
   * 4. Gets all reframes for the entry (including the updated one)
   * 5. Updates the entry with the complete reframes array
   * 6. Returns the updated entry with the updated reframe included
   *
   * @param reframeId The ID of the reframe to update
   * @param updateData The data to update the reframe with
   * @returns The updated entry with the updated reframe
   */
  async updateReframe(reframeId: string, updateData: Partial<import('../reframe').Reframe>): Promise<Entry> {
    // Get the reframe to find its entryId
    const reframe = await reframeService.getById(reframeId)
    if (!reframe) {
      throw new Error(`Reframe with ID ${reframeId} not found`)
    }

    const entryId = reframe.entryId

    // Get the entry
    const entry = await this.getById(entryId)
    if (!entry) {
      throw new Error(`Entry with ID ${entryId} not found`)
    }

    // Update the reframe
    await reframeService.update({
      id: reframeId,
      ...updateData,
    })

    // Get all reframes for this entry (including the updated one)
    const allReframes = await reframeService.getByEntryId(entryId)

    // Explicitly update the entry with the reframes
    const updatedEntry = await this.update({
      ...entry,
      reframes: allReframes,
    })

    return updatedEntry
  }

  /**
   * Deletes a reframe associated with an entry.
   *
   * This method handles both deleting the reframe and updating the entry's reframes array,
   * ensuring data consistency between the two. It's the recommended way to delete reframes
   * instead of using ReframeService.deleteReframe() directly.
   *
   * Flow:
   * 1. Gets the reframe to find its entryId
   * 2. Validates the entry exists
   * 3. Deletes the reframe using ReframeService
   * 4. Gets all remaining reframes for the entry
   * 5. Updates the entry with the remaining reframes array
   * 6. Returns the updated entry without the deleted reframe
   *
   * @param reframeId The ID of the reframe to delete
   * @returns The updated entry without the deleted reframe
   */
  async deleteReframe(reframeId: string): Promise<Entry> {
    // Get the reframe to find its entryId
    const reframe = await reframeService.getById(reframeId)
    if (!reframe) {
      throw new Error(`Reframe with ID ${reframeId} not found`)
    }

    const entryId = reframe.entryId

    // Get the entry
    const entry = await this.getById(entryId)
    if (!entry) {
      throw new Error(`Entry with ID ${entryId} not found`)
    }

    // Delete the reframe
    await reframeService.deleteReframe(reframeId)

    // Get all remaining reframes for this entry (after deletion)
    const remainingReframes = await reframeService.getByEntryId(entryId)

    // Explicitly update the entry with the remaining reframes
    const updatedEntry = await this.update({
      ...entry,
      reframes: remainingReframes,
    })

    return updatedEntry
  }
}

export const entryService = new EntryService(storageService)
