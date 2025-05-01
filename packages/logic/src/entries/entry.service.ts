import { v4 as uuidv4 } from 'uuid'
import { storageService, StorageService } from '../storage'

export interface Distortion {
  id: string
  icon: string
  label: string
  text: string
}

export interface DistortionInstance {
  id: string
  distortionId: Distortion['id']
  text: string
  timestamp?: number
}

export interface ConversationTurn {
  role: 'user' | 'ai'
  message: string
  timestamp?: number
  model?: string
}

export interface Entry {
  id: string
  entryText: string
  distortions?: DistortionInstance[]
  reframedThought?: string
  tags?: string[]
  createdAt: number
  updatedAt?: number
  reviewedAt?: number
  reviewCount?: number
  conversation?: ConversationTurn[]
  isPinned?: boolean
}

export interface EntryInput {
  id: string
  entryText: string
  createdAt: number
}

type EntryListener = (entries: Entry[]) => void

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
      entryText: params.entryText,
      createdAt: Date.now(),
    }

    const entries = await this.getAll()
    entries.push(entry)
    await this.saveAllEntries(entries)
    this.notifyListeners(entries)

    return entry
  }

  // update

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

  // get by id

  // delete

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