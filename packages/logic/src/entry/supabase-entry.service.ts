import { v4 as uuidv4 } from 'uuid'
import { supabaseAuthService } from '../auth/supabase-auth.service'
import { SupabaseClient } from '@supabase/supabase-js'
import { Entry } from './types'
import { BaseEntryService } from './base-entry.service'

/**
 * Service for managing entries in Supabase
 */
export class SupabaseEntryService extends BaseEntryService {
  private supabase: SupabaseClient

  constructor() {
    super()
    this.supabase = supabaseAuthService.getSupabaseClient()
  }

  /**
   * Initialize the service
   * @returns All entries for the current user
   */
  async init(): Promise<Entry[]> {
    try {
      // Initialize entries
      const existingEntries = await this.getAll()
      this.notifyListeners(existingEntries)
      return existingEntries
    } catch (error) {
      console.error('Error initializing entries', error as Error)
      return []
    }
  }

  /**
   * Create a new entry
   * @param params Entry data
   * @returns The created entry
   */
  async create(params: Entry): Promise<Entry> {
    if (!supabaseAuthService.isAuthenticated()) {
      throw new Error('User must be authenticated to create entries')
    }

    const userId = supabaseAuthService.getCurrentUser()?.id

    const entry: Entry = {
      ...params,
      id: uuidv4(),
      createdAt: Date.now(),
    }

    // Insert the entry into the therapy_entries table
    const { error: entryError } = await this.supabase
      .from('therapy_entries')
      .insert({
        id: entry.id,
        user_id: userId,
        title: entry.title,
        category: entry.category,
        raw_text: entry.rawText,
        strategies: entry.strategies || [],
        created_at: entry.createdAt,
        updated_at: entry.updatedAt,
        is_pinned: entry.isPinned
      })

    if (entryError) {
      console.error('Error creating entry', entryError)
      throw entryError
    }

    // If the entry has a reframe, insert it
    if (entry.reframe) {
      const { error: reframeError } = await this.supabase
        .from('reframes')
        .insert({
          id: entry.reframe.id || uuidv4(),
          entry_id: entry.id,
          text: entry.reframe.text,
          explanation: entry.reframe.explanation
        })

      if (reframeError) {
        console.error('Error creating reframe', reframeError)
      }
    }

    // If the entry has distortions, insert them
    if (entry.distortions && entry.distortions.length > 0) {
      const distortionInserts = entry.distortions.map(distortion => ({
        id: distortion.id || uuidv4(),
        entry_id: entry.id,
        distortion_id: distortion.distortionId,
        label: distortion.label,
        description: distortion.description,
        confidence_score: distortion.confidenceScore
      }))

      const { error: distortionsError } = await this.supabase
        .from('distortion_instances')
        .insert(distortionInserts)

      if (distortionsError) {
        console.error('Error creating distortions', distortionsError)
      }
    }

    // Update the cache
    const entries = await this.getAll()
    this.notifyListeners(entries)

    return entry
  }

  /**
   * Update an existing entry
   * @param params Entry data with updated fields
   * @returns The updated entry
   */
  async update(params: Entry): Promise<Entry> {
    if (!supabaseAuthService.isAuthenticated()) {
      throw new Error('User must be authenticated to update entries')
    }

    const userId = supabaseAuthService.getCurrentUser()?.id

    // Get the existing entry
    const { data: existingEntry, error: fetchError } = await this.supabase
      .from('therapy_entries')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error(`Entry with ID ${params.id} not found`, fetchError)
      throw new Error(`Entry with ID ${params.id} not found`)
    }

    // Update the entry
    const { error: updateError } = await this.supabase
      .from('therapy_entries')
      .update({
        title: params.title !== undefined ? params.title : existingEntry.title,
        category: params.category !== undefined ? params.category : existingEntry.category,
        raw_text: params.rawText !== undefined ? params.rawText : existingEntry.raw_text,
        strategies: params.strategies !== undefined ? params.strategies : existingEntry.strategies,
        updated_at: Date.now(),
        is_pinned: params.isPinned !== undefined ? params.isPinned : existingEntry.is_pinned
      })
      .eq('id', params.id)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Error updating entry', updateError)
      throw updateError
    }

    // Handle reframe updates
    if (params.reframe) {
      // Check if a reframe already exists
      const { data: existingReframe } = await this.supabase
        .from('reframes')
        .select('id')
        .eq('entry_id', params.id)
        .single()

      if (existingReframe) {
        // Update existing reframe
        const { error: reframeUpdateError } = await this.supabase
          .from('reframes')
          .update({
            text: params.reframe.text,
            explanation: params.reframe.explanation
          })
          .eq('id', existingReframe.id)

        if (reframeUpdateError) {
          console.error('Error updating reframe', reframeUpdateError)
        }
      } else {
        // Insert new reframe
        const { error: reframeInsertError } = await this.supabase
          .from('reframes')
          .insert({
            id: params.reframe.id || uuidv4(),
            entry_id: params.id,
            text: params.reframe.text,
            explanation: params.reframe.explanation
          })

        if (reframeInsertError) {
          console.error('Error creating reframe', reframeInsertError)
        }
      }
    }

    // Handle distortion updates
    if (params.distortions) {
      // Delete existing distortions
      const { error: deleteDistortionsError } = await this.supabase
        .from('distortion_instances')
        .delete()
        .eq('entry_id', params.id)

      if (deleteDistortionsError) {
        console.error('Error deleting existing distortions', deleteDistortionsError)
      }

      // Insert new distortions
      if (params.distortions.length > 0) {
        const distortionInserts = params.distortions.map(distortion => ({
          id: distortion.id || uuidv4(),
          entry_id: params.id,
          distortion_id: distortion.distortionId,
          label: distortion.label,
          description: distortion.description,
          confidence_score: distortion.confidenceScore
        }))

        const { error: distortionsInsertError } = await this.supabase
          .from('distortion_instances')
          .insert(distortionInserts)

        if (distortionsInsertError) {
          console.error('Error creating distortions', distortionsInsertError)
        }
      }
    }

    // Update the cache and notify listeners
    const entries = await this.getAll()
    this.notifyListeners(entries)

    // Find the updated entry in the cache
    const updatedEntry = entries.find(e => e.id === params.id)
    if (!updatedEntry) {
      throw new Error(`Entry with ID ${params.id} not found after update`)
    }

    return updatedEntry
  }

  /**
   * Get all entries for the current user
   * @returns Array of entries
   */
  async getAll(): Promise<Entry[]> {
    if (this.entryCache) return this.entryCache

    if (!supabaseAuthService.isAuthenticated()) {
      return []
    }

    try {
      const userId = supabaseAuthService.getCurrentUser()?.id

      // Get all entries for the current user
      const { data: entriesData, error: entriesError } = await this.supabase
        .from('therapy_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (entriesError) {
        console.error('Error fetching entries', entriesError)
        return []
      }

      if (!entriesData || entriesData.length === 0) {
        this.updateCache([])
        return []
      }

      // Get all reframes for these entries
      const entryIds = entriesData.map(entry => entry.id)
      const { data: reframesData, error: reframesError } = await this.supabase
        .from('reframes')
        .select('*')
        .in('entry_id', entryIds)

      if (reframesError) {
        console.error('Error fetching reframes', reframesError)
      }

      // Get all distortion instances for these entries
      const { data: distortionsData, error: distortionsError } = await this.supabase
        .from('distortion_instances')
        .select('*')
        .in('entry_id', entryIds)

      if (distortionsError) {
        console.error('Error fetching distortions', distortionsError)
      }

      // Map the data to Entry objects
      const entries: Entry[] = entriesData.map(entryData => {
        // Find reframe for this entry
        const reframe = reframesData?.find(r => r.entry_id === entryData.id)

        // Find distortions for this entry
        const distortions = distortionsData
          ?.filter(d => d.entry_id === entryData.id)
          .map(d => ({
            id: d.id,
            label: d.label,
            distortionId: d.distortion_id,
            description: d.description,
            confidenceScore: d.confidence_score
          }))

        return {
          id: entryData.id,
          title: entryData.title,
          category: entryData.category,
          rawText: entryData.raw_text,
          reframe: reframe ? {
            id: reframe.id,
            entryId: reframe.entry_id,
            text: reframe.text,
            explanation: reframe.explanation
          } : undefined,
          distortions: distortions?.length ? distortions : undefined,
          strategies: entryData.strategies,
          createdAt: entryData.created_at,
          updatedAt: entryData.updated_at,
          isPinned: entryData.is_pinned
        }
      })

      this.updateCache(entries)
      return entries
    } catch (error) {
      console.error('Error getting entries from Supabase', error)
      return []
    }
  }

  /**
   * Get an entry by ID
   * @param id Entry ID
   * @returns The entry or undefined if not found
   */
  async getById(id: string): Promise<Entry | undefined> {
    if (this.entryMap.size === 0) {
      const entries = await this.getAll()
      return entries.find(a => a.id === id)
    } else {
      return this.entryMap.get(id)
    }
  }

  /**
   * Delete an entry
   * @param id Entry ID
   */
  async deleteEntry(id: string): Promise<void> {
    if (!supabaseAuthService.isAuthenticated()) {
      throw new Error('User must be authenticated to delete entries')
    }

    const userId = supabaseAuthService.getCurrentUser()?.id

    // Delete the entry (cascade will delete related reframes and distortions)
    const { error } = await this.supabase
      .from('therapy_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting entry', error)
      throw error
    }

    // Update the cache and notify listeners
    const entries = await this.getAll()
    this.notifyListeners(entries)
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.entryCache = null
    this.entryMap.clear()
  }
}

// Export a singleton instance for convenience
export const supabaseEntryService = new SupabaseEntryService()