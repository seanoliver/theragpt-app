import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../sync/storage'
import { logger } from '../utils/logger'
import {
  Statement,
  CreateStatementParams,
  UpdateStatementParams,
} from './types'
import { NotFoundError } from '../utils/error'

const DEFAULT_STATEMENTS = [
  `I know the key to success is always to take action, **even when I don't feel ready for it**.`,
  `I know that **what I react to in others, I strengthen in myself**. I focus all of my energy on the current moment, so that I can consistently act with **calm, intention, and thoughtfulness**.`,
  `I know which actions bring me closer to my goals and which ones take me away from them. I focus on the former and work to eliminate the latter. Currently, these actions include:\n- spending **high quality time** with Tina, Mika, and Kai,\n- giving Tina's reactions and feedback the **sincere attention** they deserve,\n- **physical fitness**,\n- **mindful meditation**,\n- **conscious and purposeful eating**,\n- **curating exceptional notes**,\n- **writing**,\n- **building and learning,**\n- setting a **realistic and achievable daily intention**, and\n- reading this personal manifesto with the **knowing conviction** that its words are true.`,
  `I know that **alcohol and drugs take me away from my goals** by sapping my energy, my creativity, my compassion, and my capacity for mindfulness.`,
  `I create positive habits, and I know that **progress comes little by little**. By making a 1% improvement every day, I will change my life dramatically over time.`,
  `I do not get down about my mistakes as they are proof that I am trying. The more I practice trying, failing, and learning, the easier it will become. I know **the only thing that counts is what I do from now on**.`,
  `I know that working on a problem reduces my resistance to it. It is harder to fear things when I am making progress on them—even if that progress is imperfect and slow. **Action relieves anxiety**.`,
  `I know that **when I embrace discomfort, I embrace progress**. It is only by challenging myself that I will continue to grow toward my dreams.`,
  `I strongly believe in the path I am on. I do not judge others, nor do I compare myself to others. **Everyone is on their own path, and I will focus on mine**.`,
  `I know that how I do anything is how I do everything and that challenge today leads to change tomorrow. I get stronger with each good choice I make, and **my dreams will not work unless I do**.`,
]

export class StatementService {
  private storageService: StorageService
  private storageKey = 'still_statements'

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  /**
   * Initializes the service with default statements if none exist
   * NOTE: Must be called before using the service
   */
  public async init(): Promise<void> {
    try {
      const existingStatements = await this.getAllStatements()
      if (existingStatements.length === 0) {
        const defaultStatements = DEFAULT_STATEMENTS.map(text => ({
          id: uuidv4(),
          text,
          createdAt: Date.now(),
          lastReviewed: null,
          isActive: true,
          isFavorite: false,
          tags: [],
        }))
        await this.saveAllStatements(defaultStatements)
      }
    } catch (error) {
      logger.error('Error initializing default statements', error as Error)
    }
  }

  /**
   * Creates a new statement
   * @param params Statement creation parameters
   * @returns The created statement
   */
  async createStatement(params: CreateStatementParams): Promise<Statement> {
    const statement: Statement = {
      id: uuidv4(),
      text: params.text,
      createdAt: Date.now(),
      lastReviewed: null,
      isActive: true,
      isFavorite: false,
      tags: params.tags || [],
    }

    const statements = await this.getAllStatements()
    statements.push(statement)
    await this.saveAllStatements(statements)

    return statement
  }

  /**
   * Updates an existing statement
   * @param params Statement update parameters
   * @returns The updated statement
   */
  async updateStatement(params: UpdateStatementParams): Promise<Statement> {
    const statements = await this.getAllStatements()
    const index = statements.findIndex(a => a.id === params.id)

    if (index === -1) {
      throw new NotFoundError(`Statement with ID ${params.id} not found`)
    }

    const statement = statements[index]
    statements[index] = {
      ...statement,
      text: params.text ?? statement.text,
      isActive: params.isActive ?? statement.isActive,
      isFavorite: params.isFavorite ?? statement.isFavorite,
      tags: params.tags ?? statement.tags,
    }

    await this.saveAllStatements(statements)
    return statements[index]
  }

  /**
   * Gets all statements
   * @returns Array of statements
   */
  async getAllStatements(): Promise<Statement[]> {
    try {
      const data = await this.storageService.getItem<Statement[]>(
        this.storageKey,
      )
      return data || []
    } catch (error) {
      logger.error('Error getting statements from storage', error as Error)
      return []
    }
  }

  /**
   * Gets active statements
   * @returns Array of active statements
   */
  async getActiveStatements(): Promise<Statement[]> {
    const statements = await this.getAllStatements()
    return statements.filter(a => a.isActive)
  }

  /**
   * Saves all statements to storage
   * @param statements The statements to save
   */
  private async saveAllStatements(statements: Statement[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, statements)
    } catch (error) {
      logger.error('Error saving statements to storage', error as Error)
    }
  }
}

export const statementService = new StatementService(storageService)
