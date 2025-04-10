import { v4 as uuidv4 } from 'uuid'
import {
  Reframe,
  CreateReframeParams,
  UpdateReframeParams,
  ReframeFilterOptions,
  ReframeSortOption,
} from './types'
import { StorageService, storageService } from '../sync/storage'
import { logger } from '../utils/logger'
import { NotFoundError } from '../utils/error'

/**
 * Service for managing reframes
 */
export class ReframeService {
  private storageService: StorageService
  private storageKey = 'theragpt_reframes'

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  /**
   * Creates a new reframe
   * @param params The reframe creation parameters
   * @returns The created reframe
   */
  public async createReframe(params: CreateReframeParams): Promise<Reframe> {
    const reframe: Reframe = {
      id: uuidv4(),
      userId: params.userId,
      originalThought: params.originalThought,
      distortionId: params.distortionId,
      reframe: params.reframe,
      explanation: params.explanation,
      createdAt: Date.now(),
      lastReviewed: null,
      nextReviewDate: null,
      reviewCount: 0,
      isFavorite: false,
      tags: params.tags || [],
      category: params.category,
    }

    await this.saveReframe(reframe)
    logger.info('Created new reframe', { reframeId: reframe.id })
    return reframe
  }

  /**
   * Updates an existing reframe
   * @param params The reframe update parameters
   * @returns The updated reframe
   */
  public async updateReframe(params: UpdateReframeParams): Promise<Reframe> {
    const reframe = await this.getReframeById(params.id)

    if (!reframe) {
      throw new NotFoundError(`Reframe with ID ${params.id} not found`)
    }

    // Update fields if provided
    if (params.reframe !== undefined) {
      reframe.reframe = params.reframe
    }

    if (params.explanation !== undefined) {
      reframe.explanation = params.explanation
    }

    if (params.isFavorite !== undefined) {
      reframe.isFavorite = params.isFavorite
    }

    if (params.tags !== undefined) {
      reframe.tags = params.tags
    }

    if (params.category !== undefined) {
      reframe.category = params.category
    }

    await this.saveReframe(reframe)
    logger.info('Updated reframe', { reframeId: reframe.id })
    return reframe
  }

  /**
   * Toggles the favorite status of a reframe
   * @param id The reframe ID
   * @returns The updated reframe
   */
  public async toggleFavorite(id: string): Promise<Reframe> {
    const reframe = await this.getReframeById(id)

    if (!reframe) {
      throw new NotFoundError(`Reframe with ID ${id} not found`)
    }

    reframe.isFavorite = !reframe.isFavorite
    await this.saveReframe(reframe)
    logger.info('Toggled reframe favorite status', {
      reframeId: id,
      isFavorite: reframe.isFavorite,
    })
    return reframe
  }

  /**
   * Gets a reframe by ID
   * @param id The reframe ID
   * @returns The reframe or null if not found
   */
  public async getReframeById(id: string): Promise<Reframe | null> {
    const reframes = await this.getAllReframes()
    return reframes.find(r => r.id === id) || null
  }

  /**
   * Gets all reframes matching the filter options
   * @param options The filter options
   * @param sortBy The sort option
   * @returns The matching reframes
   */
  public async getReframes(
    options: ReframeFilterOptions = {},
    sortBy: ReframeSortOption = ReframeSortOption.CREATED_DESC,
  ): Promise<Reframe[]> {
    let reframes = await this.getAllReframes()

    // Apply filters
    if (options.userId) {
      reframes = reframes.filter((r: Reframe) => r.userId === options.userId)
    }

    if (options.distortionId) {
      reframes = reframes.filter(
        (r: Reframe) => r.distortionId === options.distortionId,
      )
    }

    if (options.isFavorite !== undefined) {
      reframes = reframes.filter(
        (r: Reframe) => r.isFavorite === options.isFavorite,
      )
    }

    if (options.tags && options.tags.length > 0) {
      reframes = reframes.filter((r: Reframe) =>
        options.tags!.some(tag => r.tags.includes(tag)),
      )
    }

    if (options.category) {
      reframes = reframes.filter(
        (r: Reframe) => r.category === options.category,
      )
    }

    if (options.searchText) {
      const searchLower = options.searchText.toLowerCase()
      reframes = reframes.filter(
        (r: Reframe) =>
          r.reframe.toLowerCase().includes(searchLower) ||
          r.originalThought.content.toLowerCase().includes(searchLower) ||
          r.explanation.toLowerCase().includes(searchLower),
      )
    }

    if (options.fromDate) {
      reframes = reframes.filter(
        (r: Reframe) => r.createdAt >= options.fromDate!,
      )
    }

    if (options.toDate) {
      reframes = reframes.filter((r: Reframe) => r.createdAt <= options.toDate!)
    }

    // Apply sorting
    reframes.sort((a: Reframe, b: Reframe) => {
      switch (sortBy) {
        case ReframeSortOption.CREATED_ASC:
          return a.createdAt - b.createdAt
        case ReframeSortOption.CREATED_DESC:
          return b.createdAt - a.createdAt
        case ReframeSortOption.LAST_REVIEWED_ASC:
          if (a.lastReviewed === null) return 1
          if (b.lastReviewed === null) return -1
          return a.lastReviewed - b.lastReviewed
        case ReframeSortOption.LAST_REVIEWED_DESC:
          if (a.lastReviewed === null) return 1
          if (b.lastReviewed === null) return -1
          return b.lastReviewed - a.lastReviewed
        case ReframeSortOption.NEXT_REVIEW_DATE_ASC:
          if (a.nextReviewDate === null) return 1
          if (b.nextReviewDate === null) return -1
          return a.nextReviewDate - b.nextReviewDate
        case ReframeSortOption.NEXT_REVIEW_DATE_DESC:
          if (a.nextReviewDate === null) return 1
          if (b.nextReviewDate === null) return -1
          return b.nextReviewDate - a.nextReviewDate
        default:
          return b.createdAt - a.createdAt
      }
    })

    return reframes
  }

  /**
   * Deletes a reframe by ID
   * @param id The reframe ID
   * @returns True if deleted, false if not found
   */
  public async deleteReframe(id: string): Promise<boolean> {
    const reframes = await this.getAllReframes()
    const initialLength = reframes.length
    const updatedReframes = reframes.filter(r => r.id !== id)

    if (updatedReframes.length === initialLength) {
      return false
    }

    await this.saveAllReframes(updatedReframes)
    logger.info('Deleted reframe', { reframeId: id })
    return true
  }

  /**
   * Gets all unique tags from the user's reframes
   * @param userId The user ID
   * @returns Array of unique tags
   */
  public async getAllTags(userId?: string): Promise<string[]> {
    const reframes = await this.getAllReframes()

    const filteredReframes = userId
      ? reframes.filter((r: Reframe) => r.userId === userId)
      : reframes

    const tagSet = new Set<string>()

    filteredReframes.forEach((reframe: Reframe) => {
      reframe.tags.forEach((tag: string) => tagSet.add(tag))
    })

    return Array.from(tagSet)
  }

  /**
   * Gets all unique categories from the user's reframes
   * @param userId The user ID
   * @returns Array of unique categories
   */
  public async getAllCategories(userId?: string): Promise<string[]> {
    const reframes = await this.getAllReframes()

    const filteredReframes = userId
      ? reframes.filter((r: Reframe) => r.userId === userId)
      : reframes

    const categorySet = new Set<string>()

    filteredReframes.forEach((reframe: Reframe) => {
      if (reframe.category) {
        categorySet.add(reframe.category)
      }
    })

    return Array.from(categorySet)
  }

  /**
   * Gets all reframes from storage
   * @returns Array of reframes
   */
  private async getAllReframes(): Promise<Reframe[]> {
    try {
      const data = await this.storageService.getItem<Reframe[]>(this.storageKey)
      return data || []
    } catch (error) {
      logger.error('Error getting reframes from storage', error as Error)
      return []
    }
  }

  /**
   * Saves a reframe to storage
   * @param reframe The reframe to save
   */
  private async saveReframe(reframe: Reframe): Promise<void> {
    const reframes = await this.getAllReframes()
    const index = reframes.findIndex(r => r.id === reframe.id)

    if (index >= 0) {
      reframes[index] = reframe
    } else {
      reframes.push(reframe)
    }

    await this.saveAllReframes(reframes)
  }

  /**
   * Saves all reframes to storage
   * @param reframes The reframes to save
   */
  private async saveAllReframes(reframes: Reframe[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, reframes)
    } catch (error) {
      logger.error('Error saving reframes to storage', error as Error)
    }
  }
}

// Export a singleton instance with the default storage service
export const reframeService = new ReframeService(storageService)
