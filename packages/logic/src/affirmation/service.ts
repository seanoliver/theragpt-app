import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../sync/storage'
import { logger } from '../utils/logger'
import { Affirmation, CreateAffirmationParams, UpdateAffirmationParams } from './types'
import { NotFoundError } from '../utils/error'

const DEFAULT_AFFIRMATIONS = [
  `I know the key to success is always to take action, **even when I don't feel ready for it**.`,
  `I know that **what I react to in others, I strengthen in myself**. I focus all of my energy on the current moment, so that I can consistently act with **calm, intention, and thoughtfulness**.`,
  `I know which actions bring me closer to my goals and which ones take me away from them. I focus on the former and work to eliminate the latter. Currently, these actions include:\n- spending **high quality time** with Tina, Mika, and Kai,\n- giving Tina's reactions and feedback the **sincere attention** they deserve,\n- **physical fitness**,\n- **mindful meditation**,\n- **conscious and purposeful eating**,\n- **curating exceptional notes**,\n- **writing**,\n- **building and learning,**\n- setting a **realistic and achievable daily intention**, and\n- reading this personal manifesto with the **knowing conviction** that its words are true.`,
  `I know that **alcohol and drugs take me away from my goals** by sapping my energy, my creativity, my compassion, and my capacity for mindfulness.`,
  `I create positive habits, and I know that **progress comes little by little**. By making a 1% improvement every day, I will change my life dramatically over time.`,
  `I do not get down about my mistakes as they are proof that I am trying. The more I practice trying, failing, and learning, the easier it will become. I know **the only thing that counts is what I do from now on**.`,
  `I know that working on a problem reduces my resistance to it. It is harder to fear things when I am making progress on them—even if that progress is imperfect and slow. **Action relieves anxiety**.`,
  `I know that **when I embrace discomfort, I embrace progress**. It is only by challenging myself that I will continue to grow toward my dreams.`,
  `I strongly believe in the path I am on. I do not judge others, nor do I compare myself to others. **Everyone is on their own path, and I will focus on mine**.`,
  `I know that how I do anything is how I do everything and that challenge today leads to change tomorrow. I get stronger with each good choice I make, and **my dreams will not work unless I do**.`
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