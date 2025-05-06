import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'
import { Entry, EntryListener } from './types'

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

  async init(): Promise<Entry[]> {
    try {
      // Then initialize entries
      const existingEntries = await this.getAll()
      this.notifyListeners(existingEntries)
      return existingEntries
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
      reframe: params.reframe ?? entry.reframe,
      title: params.title ?? entry.title,
      category: params.category ?? entry.category,
      createdAt: params.createdAt ?? entry.createdAt,
      strategies: params.strategies ?? entry.strategies,
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
      console.log('data', data)
      this.updateCache(data || [])
      return this.entryCache!
    } catch (error) {
      console.error('Error getting entries from storage', error as Error)
      return []
    }
  }

  async getById(id: string): Promise<Entry | undefined> {
    if (this.entryMap.size === 0) {
      console.log('entryMap is empty, loading entries from storage')
      const entries = await this.getAll()
      console.log('entries', entries)
      return entries.find(a => a.id === id)
    } else {
      return this.entryMap.get(id)
    }
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
