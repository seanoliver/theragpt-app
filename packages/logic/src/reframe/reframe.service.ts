import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'
import { Reframe } from './types'
import { Entry, entryService } from '../entry'

export interface ReframeInput {
  entryId: Entry['id']
  text: string
  source: 'ai' | 'user-edit'
  style?: string
}

export interface ReframeListener {
  (reframes: Reframe[]): void
}

/**
 * Service for managing reframes in the application.
 *
 * This service is responsible for CRUD operations on reframes only.
 * It does NOT update entries when reframes change - that responsibility
 * belongs to the EntryService.
 *
 * The relationship between entries and reframes is:
 * - Each reframe belongs to exactly one entry (via entryId)
 * - An entry can have multiple reframes (stored in its reframes array)
 *
 * When using this service directly:
 * - You must manually update the corresponding entry's reframes array
 * - Consider using EntryService methods instead for most operations
 */
export class ReframeService {
  private storageService: StorageService
  private storageKey = 'theragpt_reframes'
  private reframeCache: Reframe[] | null = null
  private reframeMap: Map<string, Reframe> = new Map()
  private listeners: ReframeListener[] = []

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  /**
   * Subscribes a listener to be notified of reframe changes.
   *
   * This method allows components or other services to be notified
   * when reframes are created, updated, or deleted. It returns an
   * unsubscribe function that can be called to remove the listener.
   *
   * @param listener The function to call when reframes change
   * @returns A function to unsubscribe the listener
   */
  subscribe(listener: ReframeListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  /**
   * Notifies all listeners of reframe changes.
   *
   * This method is called whenever reframes are created, updated, or deleted.
   * It calls all registered listeners with the updated reframes array.
   *
   * @param reframes The updated reframes array
   */
  private notifyListeners(reframes: Reframe[]) {
    this.listeners.forEach(listener => listener(reframes))
  }

  /**
   * Initializes the ReframeService.
   *
   * This method loads all reframes from storage and notifies any listeners.
   * It should be called before using the service, typically by EntryService.init().
   *
   * Note: Unlike EntryService, this service doesn't need to initialize any other
   * services, as reframes don't depend on other entities.
   *
   * @returns A promise that resolves to the loaded reframes
   */
  async init(): Promise<Reframe[]> {
    try {
      const existingReframes = await this.getAll()
      this.notifyListeners(existingReframes)
      return existingReframes
    } catch (error) {
      console.error('Error initializing reframes', error as Error)
      return []
    }
  }

  /**
   * Creates a new reframe.
   *
   * This method creates a new reframe with the provided input data and
   * saves it to storage. It does NOT update the associated entry's reframes array.
   *
   * Important: When using this method directly, you must manually update the
   * corresponding entry's reframes array. Consider using EntryService.addReframe()
   * instead, which handles both creating the reframe and updating the entry.
   *
   * @param params The reframe input data
   * @returns The created reframe
   */
  async create(params: ReframeInput): Promise<Reframe> {
    const reframe: Reframe = {
      id: uuidv4(),
      entryId: params.entryId,
      text: params.text,
      timestamp: Date.now(),
      source: params.source,
      style: params.style,
    }

    const reframes = await this.getAll()
    reframes.push(reframe)
    await this.saveAllReframes(reframes)
    this.notifyListeners(reframes)

    return reframe
  }

  /**
   * Updates an existing reframe.
   *
   * This method updates an existing reframe with the provided data and
   * saves it to storage. It does NOT update the associated entry's reframes array.
   *
   * Important: When using this method directly, you must manually update the
   * corresponding entry's reframes array. Consider using EntryService.updateReframe()
   * instead, which handles both updating the reframe and updating the entry.
   *
   * @param params The reframe update data (must include id)
   * @returns The updated reframe
   */
  async update(params: Partial<Reframe> & { id: string }): Promise<Reframe> {
    const reframes = await this.getAll()
    const index = reframes.findIndex(r => r.id === params.id)

    if (index === -1) {
      throw new Error(`Reframe with ID ${params.id} not found`)
    }

    const reframe = reframes[index]
    reframes[index] = {
      ...reframe,
      text: params.text ?? reframe.text,
      source: params.source ?? reframe.source,
      style: params.style ?? reframe.style,
      feedback: params.feedback ?? reframe.feedback,
      rejectionReason: params.rejectionReason ?? reframe.rejectionReason,
    }

    await this.saveAllReframes(reframes)
    this.notifyListeners(reframes)

    return reframes[index]
  }

  /**
   * Retrieves all reframes from storage or cache.
   *
   * This method first checks if reframes are already cached. If they are,
   * it returns the cached reframes. Otherwise, it loads reframes from storage,
   * updates the cache, and returns them.
   *
   * Note: This method does not update entries with their reframes. That
   * responsibility belongs to the EntryService.
   *
   * @returns A promise that resolves to all reframes
   */
  async getAll(): Promise<Reframe[]> {
    if (this.reframeCache) return this.reframeCache
    try {
      const data = await this.storageService.getItem<Reframe[]>(this.storageKey)
      this.updateCache(data || [])
      return this.reframeCache!
    } catch (error) {
      console.error('Error getting reframes from storage', error as Error)
      return []
    }
  }

  /**
   * Retrieves a reframe by its ID.
   *
   * This method uses the reframeMap for fast lookups by ID. The map is
   * maintained by the updateCache method, which is called whenever reframes
   * are loaded from storage or modified.
   *
   * @param id The ID of the reframe to retrieve
   * @returns A promise that resolves to the reframe, or undefined if not found
   */
  async getById(id: string): Promise<Reframe | undefined> {
    return this.reframeMap.get(id)
  }

  /**
   * Retrieves all reframes associated with a specific entry.
   *
   * This method is used by EntryService to load reframes for an entry.
   * It filters all reframes to find those with the specified entryId.
   *
   * @param entryId The ID of the entry whose reframes to retrieve
   * @returns A promise that resolves to an array of reframes for the entry
   */
  async getByEntryId(entryId: string): Promise<Reframe[]> {
    const reframes = await this.getAll()
    return reframes.filter(reframe => reframe.entryId === entryId)
  }

  /**
   * Deletes a reframe by ID.
   *
   * This method deletes a reframe from storage. It does NOT update the
   * associated entry's reframes array.
   *
   * Important: When using this method directly, you must manually update the
   * corresponding entry's reframes array. Consider using EntryService.deleteReframe()
   * instead, which handles both deleting the reframe and updating the entry.
   *
   * @param id The ID of the reframe to delete
   */
  async deleteReframe(id: string): Promise<void> {
    const reframes = await this.getAll()
    const index = reframes.findIndex(r => r.id === id)
    if (index !== -1) {
      reframes.splice(index, 1)
      await this.saveAllReframes(reframes)
      this.notifyListeners(reframes)
    }
  }

  /**
   * Deletes all reframes associated with an entry.
   *
   * This method deletes all reframes for a specific entry from storage.
   * It is typically called by EntryService.deleteEntry() when an entry is deleted.
   *
   * Note: When called from EntryService.deleteEntry(), the entry itself is being
   * deleted, so there's no need to update the entry's reframes array. However,
   * if you call this method directly and the entry still exists, you must manually
   * update the entry's reframes array to an empty array.
   *
   * @param entryId The ID of the entry whose reframes should be deleted
   */
  async deleteByEntryId(entryId: string): Promise<void> {
    const reframes = await this.getAll()
    const filteredReframes = reframes.filter(r => r.entryId !== entryId)

    if (filteredReframes.length !== reframes.length) {
      await this.saveAllReframes(filteredReframes)
      this.notifyListeners(filteredReframes)
    }
  }

  /**
   * Saves all reframes to storage and updates the cache.
   *
   * This method is called whenever reframes are created, updated, or deleted.
   * It persists the changes to storage and updates the cache to reflect the changes.
   *
   * @param reframes The reframes to save
   */
  private async saveAllReframes(reframes: Reframe[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, reframes)
      this.updateCache(reframes)
    } catch (error) {
      console.error('Error saving reframes to storage', error as Error)
    }
  }

  /**
   * Updates the reframe cache and map with the provided reframes.
   *
   * This method is called after retrieving reframes from storage or after
   * making changes to reframes. It:
   *
   * 1. Updates the reframeCache with the provided reframes
   * 2. Rebuilds the reframeMap for fast lookups by ID
   *
   * Unlike EntryService.updateCache, this method does not need to load
   * additional data, as reframes don't depend on other entities.
   *
   * @param reframes The reframes to update the cache with
   */
  private updateCache(reframes: Reframe[]): void {
    this.reframeCache = reframes
    this.reframeMap = new Map(reframes.map(reframe => [reframe.id, reframe]))
  }

}

export const reframeService = new ReframeService(storageService)