import { v4 as uuidv4 } from 'uuid'
import { Thought } from '../thought/types'
import {
  Reframe,
  CreateReframeParams,
  UpdateReframeParams,
  ReframeFilterOptions,
  ReframeSortOption,
} from './types'
import { StorageService, storageService } from '../sync/storage'

/**
 * Service for managing reframes
 */
export class ReframeService {
  private storageService: StorageService

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

    await this.storageService.saveReframe(reframe)
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
      throw new Error(`Reframe with ID ${params.id} not found`)
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

    await this.storageService.saveReframe(reframe)
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
      throw new Error(`Reframe with ID ${id} not found`)
    }

    reframe.isFavorite = !reframe.isFavorite
    await this.storageService.saveReframe(reframe)
    return reframe
  }

  /**
   * Gets a reframe by ID
   * @param id The reframe ID
   * @returns The reframe or null if not found
   */
  public async getReframeById(id: string): Promise<Reframe | null> {
    return this.storageService.getReframeById(id)
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
    let reframes = await this.storageService.getAllReframes()

    // Apply filters
    if (options.userId) {
      reframes = reframes.filter((r: Reframe) => r.userId === options.userId)
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
    return this.storageService.deleteReframe(id)
  }

  /**
   * Gets all unique tags from the user's reframes
   * @param userId The user ID
   * @returns Array of unique tags
   */
  public async getAllTags(userId?: string): Promise<string[]> {
    const reframes = await this.storageService.getAllReframes()

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
    const reframes = await this.storageService.getAllReframes()

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
}

// Export a singleton instance with the default storage service
export const reframeService = new ReframeService(storageService)
