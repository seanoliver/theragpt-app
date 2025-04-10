import { v4 as uuidv4 } from 'uuid'
import { logger } from '../utils/logger'
import { StorageService, storageService } from '../sync/storage'
import {
  Thought,
  CognitiveDistortion,
  ThoughtEntry,
  CreateThoughtParams,
  UpdateThoughtParams,
  AddDistortionParams,
  AssociateReframeParams,
  ThoughtFilterOptions,
  ThoughtSortOption,
} from './types'
import { thoughtValidator } from './validation'
import { NotFoundError, ValidationError } from '../utils/error'

/**
 * Service for managing thought entries
 */
export class ThoughtService {
  private storageService: StorageService
  private storageKey = 'theragpt_thoughts'

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  /**
   * Creates a new thought
   * @param params The thought creation parameters
   * @returns The created thought
   */
  public async createThought(params: CreateThoughtParams): Promise<Thought> {
    // Validate the thought content
    const validationResult = thoughtValidator.validateContent(params.content)
    if (!validationResult.valid) {
      throw new ValidationError(
        validationResult.error || 'Invalid thought content'
      )
    }

    const thought: Thought = {
      id: uuidv4(),
      content: params.content,
      context: params.context,
      userId: params.userId,
      createdAt: Date.now(),
    }

    await this.saveThought(thought)
    logger.info('Created new thought', { thoughtId: thought.id })
    return thought
  }

  /**
   * Creates a new thought entry with optional distortions
   * @param params The thought creation parameters
   * @returns The created thought entry
   */
  public async createThoughtEntry(
    params: CreateThoughtParams
  ): Promise<ThoughtEntry> {
    const thought = await this.createThought(params)

    const thoughtEntry: ThoughtEntry = {
      id: uuidv4(),
      thought,
      distortions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: params.tags || [],
      category: params.category,
    }

    await this.saveThoughtEntry(thoughtEntry)
    logger.info('Created new thought entry', {
      thoughtEntryId: thoughtEntry.id,
    })
    return thoughtEntry
  }

  /**
   * Gets a thought by ID
   * @param id The thought ID
   * @returns The thought or null if not found
   */
  public async getThoughtById(id: string): Promise<Thought | null> {
    const thoughts = await this.getAllThoughts()
    return thoughts.find(t => t.id === id) || null
  }

  /**
   * Gets a thought entry by ID
   * @param id The thought entry ID
   * @returns The thought entry or null if not found
   */
  public async getThoughtEntryById(id: string): Promise<ThoughtEntry | null> {
    const entries = await this.getAllThoughtEntries()
    return entries.find(e => e.id === id) || null
  }

  /**
   * Updates a thought
   * @param params The thought update parameters
   * @returns The updated thought
   */
  public async updateThought(params: UpdateThoughtParams): Promise<Thought> {
    const thought = await this.getThoughtById(params.id)

    if (!thought) {
      throw new NotFoundError(`Thought with ID ${params.id} not found`)
    }

    // Validate content if provided
    if (params.content) {
      const validationResult = thoughtValidator.validateContent(params.content)
      if (!validationResult.valid) {
        throw new ValidationError(
          validationResult.error || 'Invalid thought content'
        )
      }
      thought.content = params.content
    }

    if (params.context !== undefined) {
      thought.context = params.context
    }

    await this.saveThought(thought)

    // Update any thought entries that contain this thought
    const entries = await this.getAllThoughtEntries()
    for (const entry of entries) {
      if (entry.thought.id === thought.id) {
        entry.thought = thought
        entry.updatedAt = Date.now()
        await this.saveThoughtEntry(entry)
      }
    }

    logger.info('Updated thought', { thoughtId: thought.id })
    return thought
  }

  /**
   * Updates a thought entry
   * @param id The thought entry ID
   * @param params The update parameters
   * @returns The updated thought entry
   */
  public async updateThoughtEntry(
    id: string,
    params: { tags?: string[], category?: string }
  ): Promise<ThoughtEntry> {
    const entry = await this.getThoughtEntryById(id)

    if (!entry) {
      throw new NotFoundError(`Thought entry with ID ${id} not found`)
    }

    if (params.tags !== undefined) {
      entry.tags = params.tags
    }

    if (params.category !== undefined) {
      entry.category = params.category
    }

    entry.updatedAt = Date.now()
    await this.saveThoughtEntry(entry)

    logger.info('Updated thought entry', { thoughtEntryId: entry.id })
    return entry
  }

  /**
   * Adds a distortion to a thought entry
   * @param params The distortion parameters
   * @returns The updated thought entry
   */
  public async addDistortion(
    params: AddDistortionParams
  ): Promise<ThoughtEntry> {
    const entry = await this.getThoughtEntryByThoughtId(params.thoughtId)

    if (!entry) {
      throw new NotFoundError(
        `Thought entry with thought ID ${params.thoughtId} not found`
      )
    }

    const distortion: CognitiveDistortion = {
      id: uuidv4(),
      name: params.name,
      explanation: params.explanation,
      confidence: params.confidence,
      reframeIds: [],
    }

    entry.distortions.push(distortion)
    entry.updatedAt = Date.now()

    await this.saveThoughtEntry(entry)
    logger.info('Added distortion to thought entry', {
      thoughtEntryId: entry.id,
      distortionId: distortion.id,
    })

    return entry
  }

  /**
   * Associates a reframe with a distortion
   * @param params The association parameters
   * @returns The updated thought entry
   */
  public async associateReframe(
    params: AssociateReframeParams
  ): Promise<ThoughtEntry> {
    // Find the thought entry containing the distortion
    const entries = await this.getAllThoughtEntries()
    let targetEntry: ThoughtEntry | null = null
    let targetDistortion: CognitiveDistortion | null = null

    for (const entry of entries) {
      const distortion = entry.distortions.find(
        d => d.id === params.distortionId
      )
      if (distortion) {
        targetEntry = entry
        targetDistortion = distortion
        break
      }
    }

    if (!targetEntry || !targetDistortion) {
      throw new NotFoundError(
        `Distortion with ID ${params.distortionId} not found`
      )
    }

    // Check if the reframe is already associated
    if (!targetDistortion.reframeIds.includes(params.reframeId)) {
      targetDistortion.reframeIds.push(params.reframeId)
      targetEntry.updatedAt = Date.now()
      await this.saveThoughtEntry(targetEntry)

      logger.info('Associated reframe with distortion', {
        distortionId: params.distortionId,
        reframeId: params.reframeId,
      })
    }

    return targetEntry
  }

  /**
   * Gets all thoughts matching the filter options
   * @param options The filter options
   * @param sortBy The sort option
   * @returns The matching thoughts
   */
  public async getThoughts(
    options: ThoughtFilterOptions = {},
    sortBy: ThoughtSortOption = ThoughtSortOption.CREATED_DESC
  ): Promise<Thought[]> {
    const entries = await this.getThoughtEntries(options, sortBy)
    return entries.map(entry => entry.thought)
  }

  /**
   * Gets all thought entries matching the filter options
   * @param options The filter options
   * @param sortBy The sort option
   * @returns The matching thought entries
   */
  public async getThoughtEntries(
    options: ThoughtFilterOptions = {},
    sortBy: ThoughtSortOption = ThoughtSortOption.CREATED_DESC
  ): Promise<ThoughtEntry[]> {
    let entries = await this.getAllThoughtEntries()

    // Apply filters
    if (options.userId) {
      entries = entries.filter(e => e.thought.userId === options.userId)
    }

    if (options.tags && options.tags.length > 0) {
      entries = entries.filter(e =>
        options.tags!.some(tag => e.tags.includes(tag))
      )
    }

    if (options.category) {
      entries = entries.filter(e => e.category === options.category)
    }

    if (options.searchText) {
      const searchLower = options.searchText.toLowerCase()
      entries = entries.filter(e =>
        e.thought.content.toLowerCase().includes(searchLower) ||
        (e.thought.context &&
          e.thought.context.toLowerCase().includes(searchLower))
      )
    }

    if (options.fromDate) {
      entries = entries.filter(e => e.createdAt >= options.fromDate!)
    }

    if (options.toDate) {
      entries = entries.filter(e => e.createdAt <= options.toDate!)
    }

    if (options.hasDistortions !== undefined) {
      entries = entries.filter(e =>
        options.hasDistortions
          ? e.distortions.length > 0
          : e.distortions.length === 0
      )
    }

    // Apply sorting
    entries.sort((a, b) => {
      switch (sortBy) {
        case ThoughtSortOption.CREATED_ASC:
          return a.createdAt - b.createdAt
        case ThoughtSortOption.CREATED_DESC:
          return b.createdAt - a.createdAt
        case ThoughtSortOption.UPDATED_ASC:
          return a.updatedAt - b.updatedAt
        case ThoughtSortOption.UPDATED_DESC:
          return b.updatedAt - a.updatedAt
        default:
          return b.createdAt - a.createdAt
      }
    })

    return entries
  }

  /**
   * Gets a thought entry by thought ID
   * @param thoughtId The thought ID
   * @returns The thought entry or null if not found
   */
  public async getThoughtEntryByThoughtId(
    thoughtId: string
  ): Promise<ThoughtEntry | null> {
    const entries = await this.getAllThoughtEntries()
    return entries.find(e => e.thought.id === thoughtId) || null
  }

  /**
   * Deletes a thought and any associated thought entries
   * @param id The thought ID
   * @returns True if deleted, false if not found
   */
  public async deleteThought(id: string): Promise<boolean> {
    const thought = await this.getThoughtById(id)
    if (!thought) {
      return false
    }

    // Delete any thought entries that contain this thought
    const entries = await this.getAllThoughtEntries()
    for (const entry of entries) {
      if (entry.thought.id === id) {
        await this.deleteThoughtEntry(entry.id)
      }
    }

    logger.info('Deleted thought', { thoughtId: id })
    return true
  }

  /**
   * Deletes a thought entry
   * @param id The thought entry ID
   * @returns True if deleted, false if not found
   */
  public async deleteThoughtEntry(id: string): Promise<boolean> {
    const entries = await this.getAllThoughtEntries()
    const initialLength = entries.length
    const updatedEntries = entries.filter(e => e.id !== id)

    if (updatedEntries.length === initialLength) {
      return false
    }

    await this.saveAllThoughtEntries(updatedEntries)
    logger.info('Deleted thought entry', { thoughtEntryId: id })
    return true
  }

  /**
   * Gets all unique tags from the user's thought entries
   * @param userId The user ID
   * @returns Array of unique tags
   */
  public async getAllTags(userId?: string): Promise<string[]> {
    const entries = await this.getAllThoughtEntries()

    const filteredEntries = userId
      ? entries.filter(e => e.thought.userId === userId)
      : entries

    const tagSet = new Set<string>()

    filteredEntries.forEach(entry => {
      entry.tags.forEach(tag => tagSet.add(tag))
    })

    return Array.from(tagSet)
  }

  /**
   * Gets all unique categories from the user's thought entries
   * @param userId The user ID
   * @returns Array of unique categories
   */
  public async getAllCategories(userId?: string): Promise<string[]> {
    const entries = await this.getAllThoughtEntries()

    const filteredEntries = userId
      ? entries.filter(e => e.thought.userId === userId)
      : entries

    const categorySet = new Set<string>()

    filteredEntries.forEach(entry => {
      if (entry.category) {
        categorySet.add(entry.category)
      }
    })

    return Array.from(categorySet)
  }

  /**
   * Gets all thoughts from storage
   * @returns Array of thoughts
   */
  private async getAllThoughts(): Promise<Thought[]> {
    try {
      const thoughtEntries = await this.getAllThoughtEntries()
      const thoughtMap = new Map<string, Thought>()

      // Collect all unique thoughts from thought entries
      thoughtEntries.forEach(entry => {
        thoughtMap.set(entry.thought.id, entry.thought)
      })

      return Array.from(thoughtMap.values())
    } catch (error) {
      logger.error('Error getting thoughts from storage', error as Error)
      return []
    }
  }

  /**
   * Gets all thought entries from storage
   * @returns Array of thought entries
   */
  private async getAllThoughtEntries(): Promise<ThoughtEntry[]> {
    try {
      const data = await this.storageService.getItem<ThoughtEntry[]>(
        this.storageKey
      )
      return data || []
    } catch (error) {
      logger.error('Error getting thought entries from storage', error as Error)
      return []
    }
  }

  /**
   * Saves a thought to storage
   * @param thought The thought to save
   */
  private async saveThought(_thought: Thought): Promise<void> {
    // This is a no-op since thoughts are now stored within thought entries
    // We keep this method for potential future use
  }

  /**
   * Saves a thought entry to storage
   * @param entry The thought entry to save
   */
  private async saveThoughtEntry(entry: ThoughtEntry): Promise<void> {
    const entries = await this.getAllThoughtEntries()
    const index = entries.findIndex(e => e.id === entry.id)

    if (index >= 0) {
      entries[index] = entry
    } else {
      entries.push(entry)
    }

    await this.saveAllThoughtEntries(entries)
  }

  /**
   * Saves all thought entries to storage
   * @param entries The thought entries to save
   */
  private async saveAllThoughtEntries(entries: ThoughtEntry[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, entries)
    } catch (error) {
      logger.error('Error saving thought entries to storage', error as Error)
    }
  }
}

// Export a singleton instance with the default storage service
export const thoughtService = new ThoughtService(storageService)