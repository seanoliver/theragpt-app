import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../sync/storage'
import { logger } from '../utils/logger'
import { Affirmation, CreateAffirmationParams, UpdateAffirmationParams } from './types'
import { NotFoundError } from '../utils/error'

const DEFAULT_AFFIRMATIONS = [
  'I am finding meaning and purpose in my work',
  'Setbacks are a chance to learn and grow',
  'I have the power to create change in my life',
  'I am capable of achieving my goals',
  'I accept myself unconditionally',
];

/**
 * Service for managing affirmations
 */
export class AffirmationService {
  private storageService: StorageService
  private storageKey = 'still_affirmations'

  constructor(storageService: StorageService) {
    this.storageService = storageService
    this.initializeDefaultAffirmations()
  }

  /**
   * Initializes the service with default affirmations if none exist
   */
  private async initializeDefaultAffirmations(): Promise<void> {
    try {
      const existingAffirmations = await this.getAllAffirmations()
      if (existingAffirmations.length === 0) {
        const defaultAffirmations = DEFAULT_AFFIRMATIONS.map(text => ({
          id: uuidv4(),
          text,
          createdAt: Date.now(),
          lastReviewed: null,
          isActive: true,
          isFavorite: false,
          tags: [],
        }))
        await this.saveAllAffirmations(defaultAffirmations)
      }
    } catch (error) {
      logger.error('Error initializing default affirmations', error as Error)
    }
  }

  /**
   * Creates a new affirmation
   * @param params Affirmation creation parameters
   * @returns The created affirmation
   */
  async createAffirmation(params: CreateAffirmationParams): Promise<Affirmation> {
    const affirmation: Affirmation = {
      id: uuidv4(),
      text: params.text,
      createdAt: Date.now(),
      lastReviewed: null,
      isActive: true,
      isFavorite: false,
      tags: params.tags || [],
    }

    const affirmations = await this.getAllAffirmations()
    affirmations.push(affirmation)
    await this.saveAllAffirmations(affirmations)

    return affirmation
  }

  /**
   * Updates an existing affirmation
   * @param params Affirmation update parameters
   * @returns The updated affirmation
   */
  async updateAffirmation(params: UpdateAffirmationParams): Promise<Affirmation> {
    const affirmations = await this.getAllAffirmations()
    const index = affirmations.findIndex(a => a.id === params.id)

    if (index === -1) {
      throw new NotFoundError(`Affirmation with ID ${params.id} not found`)
    }

    const affirmation = affirmations[index]
    affirmations[index] = {
      ...affirmation,
      text: params.text ?? affirmation.text,
      isActive: params.isActive ?? affirmation.isActive,
      isFavorite: params.isFavorite ?? affirmation.isFavorite,
      tags: params.tags ?? affirmation.tags,
    }

    await this.saveAllAffirmations(affirmations)
    return affirmations[index]
  }

  /**
   * Gets all affirmations
   * @returns Array of affirmations
   */
  async getAllAffirmations(): Promise<Affirmation[]> {
    try {
      const data = await this.storageService.getItem<Affirmation[]>(this.storageKey)
      return data || []
    } catch (error) {
      logger.error('Error getting affirmations from storage', error as Error)
      return []
    }
  }

  /**
   * Gets active affirmations
   * @returns Array of active affirmations
   */
  async getActiveAffirmations(): Promise<Affirmation[]> {
    const affirmations = await this.getAllAffirmations()
    return affirmations.filter(a => a.isActive)
  }

  /**
   * Saves all affirmations to storage
   * @param affirmations The affirmations to save
   */
  private async saveAllAffirmations(affirmations: Affirmation[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, affirmations)
    } catch (error) {
      logger.error('Error saving affirmations to storage', error as Error)
    }
  }
}

export const affirmationService = new AffirmationService(storageService)