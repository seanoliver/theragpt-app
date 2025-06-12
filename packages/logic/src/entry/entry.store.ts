import { cloneDeep, merge } from 'lodash'
import { create } from 'zustand'
import { entryService } from './entry.service'
import { Entry } from './types'

export interface EntryStore {
  // State
  entries: Entry[]
  isLoading: boolean

  error: string | null
  hasInitialized: boolean

  streamingEntryId: string | null
  setStreamingEntryId: (id: string | null) => void

  // Sync/Init
  initialize: () => Promise<void>
  setEntries: (entries: Entry[]) => void

  // Mutations
  addEntry: (params: Entry) => Promise<Entry | undefined>
  updateEntry: (entry: Entry) => Promise<void>
  deleteEntry: (id: string) => Promise<void>
  updateEntryById: (id: string, patch: Partial<Entry>) => Promise<void>

  // Local state only (optional, nice to have)
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getEntryById: (id: string) => Entry | undefined
}

let unsubscribe: (() => void) | undefined

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,
  hasInitialized: false,
  streamingEntryId: null,
  setStreamingEntryId: (id: string | null) => set({ streamingEntryId: id }),

  initialize: async () => {
    // Prevent duplicate initializations
    if (get().hasInitialized) return

    set({ isLoading: true })
    try {
      const entries = await entryService.init()
      set({ entries, isLoading: false, hasInitialized: true })

      // Prevent duplicate listeners by un- and re-subscribing
      unsubscribe?.()
      unsubscribe = entryService.subscribe(entries => {
        set({ entries })
      })
    } catch (error) {
      console.error('Failed to initialize entry store', error)
      set({
        isLoading: false,
        error: 'Initialization failed',
        hasInitialized: false,
      })
    }
  },

  setEntries: entries => set({ entries }),

  addEntry: async params => {
    try {
      const newEntry = await entryService.create(params)
      set(state => {
        const alreadyExists = state.entries.some(
          entry => entry.id === newEntry.id,
        )
        if (alreadyExists) {
          return state
        }
        return { entries: [...state.entries, newEntry] }
      })
      return newEntry
    } catch (error) {
      set({ error: 'Failed to add entry' })
      console.error('Error adding entry: ', error)
      return undefined
    }
  },

  updateEntry: async params => {
    try {
      const updatedEntry = await entryService.update(params)
      set(state => ({
        entries: state.entries.map(entry =>
          entry.id === params.id ? updatedEntry : entry,
        ),
      }))
    } catch (error) {
      set({ error: 'Failed to update entry' })
      console.error('Error updating entry: ', error)
    }
  },

  updateEntryById: async (id, patch) => {
    set(state => {
      const entryIndex = state.entries.findIndex(entry => entry.id === id)

      if (entryIndex === -1) {
        // Entry not found in store - this can happen during streaming
        console.warn(`Entry with ID ${id} not found in store, creating new entry`)
        const newEntry = {
          id,
          ...patch,
          createdAt: patch.createdAt || Date.now(),
          updatedAt: Date.now(),
        } as Entry

        return {
          entries: [...state.entries, newEntry]
        }
      }

      // Entry found, update it
      return {
        entries: state.entries.map(entry => {
          if (entry.id !== id) return entry
          const cleanedPatch = { ...patch, id }
          const entryCopy = cloneDeep(entry)
          merge(entryCopy, cleanedPatch)
          return entryCopy
        }),
      }
    })
  },

  deleteEntry: async id => {
    try {
      await entryService.deleteEntry(id)
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id),
      }))
    } catch (error) {
      set({ error: 'Failed to delete entry' })
      console.error('Error deleting entry: ', error)
    }
  },

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  getEntryById: id => get().entries.find(entry => entry.id === id),
}))
