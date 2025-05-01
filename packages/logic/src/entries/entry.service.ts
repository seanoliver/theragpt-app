import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'
import { Entry, EntryListener, EntryInput } from './types'

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

  async deleteEntry(id: string): Promise<void> {
    const entries = await this.getAll()
    const index = entries.findIndex(a => a.id === id)
    if (index !== -1) {
      entries.splice(index, 1)
      await this.saveAllEntries(entries)
      this.notifyListeners(entries)
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

  private updateCache(entries: Entry[]): void {
    this.entryCache = entries
    this.entryMap = new Map(entries.map(entry => [entry.id, entry]))
  }
}

export const entryService = new EntryService(storageService)
