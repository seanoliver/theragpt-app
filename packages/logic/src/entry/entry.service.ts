import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'
import { getSupabaseClient } from '@theragpt/config'
import { Entry, EntryListener } from './types'
import {
  mapDbEntryToAppEntry,
  mapAppEntryToDbEntry,
} from './type-mappers'

export class EntryService {
  private storageService: StorageService
  private storageKey = 'theragpt_entries'
  private entryCache: Entry[] | null = null
  private entryMap: Map<string, Entry> = new Map()
  private listeners: EntryListener[] = []
  private isOnline: boolean = true

  constructor(storageService: StorageService) {
    this.storageService = storageService
    this.checkOnlineStatus()
  }

  /**
   * Sets the current online status of the user. This is used in the service
   * to determine whether to fetch and save to Supabase or local storage.
   */
  private checkOnlineStatus() {
    if (typeof navigator !== 'undefined' && typeof window !== 'undefined') {
      this.isOnline = navigator.onLine
      window.addEventListener('online', () => { this.isOnline = true })
      window.addEventListener('offline', () => { this.isOnline = false })
    }
  }

  subscribe(listener: EntryListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener) // Function reference is used to filter the listener
    }
  }

  private notifyListeners(entries: Entry[]) {
    this.listeners.forEach(listener => listener(entries))
  }

  async init(): Promise<Entry[]> {
    try {
      let entries: Entry[] = []

      if (this.isOnline) {
        // Try to fetch from Supabase first
        try {
          const { data: { user } } = await getSupabaseClient().auth.getUser()
          if (user) {
            entries = await this.fetchFromSupabase()
            // Cache to local storage for offline access
            await this.saveToLocalStorage(entries)
          } else {
            // No user, fall back to local storage
            entries = await this.getFromLocalStorage()
          }
        } catch (supabaseError) {
          console.warn('Failed to fetch from Supabase, falling back to local storage', supabaseError)
          entries = await this.getFromLocalStorage()
        }
      } else {
        // Offline, use local storage
        entries = await this.getFromLocalStorage()
      }

      this.updateCache(entries)
      this.notifyListeners(entries)
      return entries
    } catch (error) {
      console.error('Error initializing entries', error as Error)
      return []
    }
  }

  async create(params: Entry): Promise<Entry> {
    const entry: Entry = {
      ...params,
      id: uuidv4(),
      createdAt: Date.now(),
    }

    try {
      if (this.isOnline) {
        const { data: { user } } = await getSupabaseClient().auth.getUser()
        if (user) {
          await this.saveEntryToSupabase(entry)
        }
      }
    } catch (error) {
      console.warn('Failed to save to Supabase, saving locally', error)
    }

    // Always save to local storage as backup
    const entries = await this.getAll()
    entries.push(entry)
    await this.saveToLocalStorage(entries)
    this.updateCache(entries)
    this.notifyListeners(entries)

    return entry
  }

  async update(params: Entry): Promise<Entry> {
    const entries = await this.getAll()
    const index = entries.findIndex(a => a.id === params.id)

    let updatedEntry: Entry

    if (index === -1) {
      // Entry not found in local cache - this can happen during streaming
      // Create the entry with the provided params
      console.warn(`Entry with ID ${params.id} not found in cache, creating new entry`)
      updatedEntry = {
        ...params,
        updatedAt: Date.now(),
      }

      // Add to local cache
      entries.push(updatedEntry)
    } else {
      // Entry found, update it
      const entry = entries[index]
      updatedEntry = {
        ...entry,
        rawText: params.rawText ?? entry.rawText,
        distortions: params.distortions ?? entry.distortions,
        reframeText: params.reframeText ?? entry.reframeText,
        reframeExplanation: params.reframeExplanation ?? entry.reframeExplanation,
        title: params.title ?? entry.title,
        category: params.category ?? entry.category,
        createdAt: params.createdAt ?? entry.createdAt,
        strategies: params.strategies ?? entry.strategies,
        isPinned: params.isPinned ?? entry.isPinned,
        updatedAt: Date.now(),
      }

      // Update in local cache
      entries[index] = updatedEntry
    }

    try {
      if (this.isOnline) {
        const { data: { user } } = await getSupabaseClient().auth.getUser()
        if (user) {
          // Update in Supabase
          await this.updateEntryInSupabase(updatedEntry)
        }
      }
    } catch (error) {
      console.warn('Failed to update in Supabase, updating locally', error)
    }

    // Always update local storage
    await this.saveToLocalStorage(entries)
    this.updateCache(entries)
    this.notifyListeners(entries)

    return updatedEntry
  }

  async getAll(): Promise<Entry[]> {
    if (this.entryCache) return this.entryCache

    try {
      let entries: Entry[] = []

      if (this.isOnline) {
        try {
          const { data: { user } } = await getSupabaseClient().auth.getUser()
          if (user) {
            entries = await this.fetchFromSupabase()
            // Cache to local storage
            await this.saveToLocalStorage(entries)
          } else {
            entries = await this.getFromLocalStorage()
          }
        } catch (supabaseError) {
          console.warn('Failed to fetch from Supabase, using local storage', supabaseError)
          entries = await this.getFromLocalStorage()
        }
      } else {
        entries = await this.getFromLocalStorage()
      }

      this.updateCache(entries)
      return entries
    } catch (error) {
      console.error('Error getting entries', error as Error)
      return []
    }
  }

  async getById(id: string): Promise<Entry | undefined> {
    if (this.entryMap.size === 0) {
      const entries = await this.getAll()
      return entries.find(a => a.id === id)
    } else {
      return this.entryMap.get(id)
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      if (this.isOnline) {
        const { data: { user } } = await getSupabaseClient().auth.getUser()
        if (user) {
          // Delete from Supabase
          await this.deleteEntryFromSupabase(id)
        }
      }
    } catch (error) {
      console.warn('Failed to delete from Supabase, deleting locally', error)
    }

    // Always delete from local storage
    const entries = await this.getAll()
    const index = entries.findIndex(a => a.id === id)
    if (index !== -1) {
      entries.splice(index, 1)
      await this.saveToLocalStorage(entries)
      this.updateCache(entries)
      this.notifyListeners(entries)
    }
  }

  // Local storage methods
  private async saveToLocalStorage(entries: Entry[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, entries)
    } catch (error) {
      console.error('Error saving entries to storage', error as Error)
    }
  }

  private async getFromLocalStorage(): Promise<Entry[]> {
    try {
      const data = await this.storageService.getItem<Entry[]>(this.storageKey)
      return data || []
    } catch (error) {
      console.error('Error getting entries from storage', error as Error)
      return []
    }
  }

  // Supabase methods
  private async fetchFromSupabase(): Promise<Entry[]> {
    const { data, error } = await getSupabaseClient()
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return data.map(dbEntry => mapDbEntryToAppEntry(dbEntry))
  }

  private async saveEntryToSupabase(entry: Entry): Promise<void> {
    const { data: { user } } = await getSupabaseClient().auth.getUser()
    if (!user) throw new Error('User not authenticated')

    // Insert the entry with all data in one table
    const dbEntry = mapAppEntryToDbEntry(entry)
    const { error } = await getSupabaseClient()
      .from('entries')
      .insert({ ...dbEntry, user_id: user.id })

    if (error) throw error
  }

  private async updateEntryInSupabase(entry: Entry): Promise<void> {
    const dbEntry = mapAppEntryToDbEntry(entry)
    const { error } = await getSupabaseClient()
      .from('entries')
      .update(dbEntry)
      .eq('id', entry.id)

    if (error) throw error
  }

  private async deleteEntryFromSupabase(id: string): Promise<void> {
    const { error } = await getSupabaseClient()
      .from('entries')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  private updateCache(entries: Entry[]): void {
    this.entryCache = entries
    this.entryMap = new Map(entries.map(entry => [entry.id, entry]))
  }
}

export const entryService = new EntryService(storageService)
