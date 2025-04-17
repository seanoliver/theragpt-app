import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../sync/storage'
import { NotFoundError } from '../utils/error'
import { logger } from '../utils/logger'

export interface Statement {
  id: string
  text: string
  createdAt: number
  lastReviewed: number | null
  isActive: boolean
  isFavorite: boolean
  tags: string[]
}

export interface UpdateStatementParams {
  id: string
  text?: string
  isActive?: boolean
  isFavorite?: boolean
  tags?: string[]
}

export interface CreateStatementParams {
  text: string
  tags?: string[]
  isActive?: boolean
}

const DEFAULT_STATEMENTS = [
  `I know the key to success is always to take action, **even when I don't feel ready for it**.`,
  `I know that **what I react to in others, I strengthen in myself**. I focus all of my energy on the current moment, so that I can consistently act with **calm, intention, and thoughtfulness**.`,
  `I know which actions bring me closer to my goals and which ones take me away from them. I focus on the former and work to eliminate the latter. Currently, these actions include:\n- **excercise**,\n- **meditation**,\n- **conscious and purposeful** eating,\n- taking **exceptional** notes,\n- **writing**,**\n- setting a **realistic and achievable** daily to do list, and\n- reading this personal manifesto with the **knowing conviction** that its words are true.`,
  `I know that **alcohol and drugs take me away from my goals** by sapping my energy, my creativity, my compassion, and my capacity for mindfulness.`,
  `I create positive habits, and I know that **progress comes little by little**. By making a 1% improvement every day, I will change my life dramatically over time.`,
  `I do not get down about my mistakes as they are proof that I am trying. The more I practice trying, failing, and learning, the easier it will become. I know **the only thing that counts is what I do from now on**.`,
  `I know that working on a problem reduces my resistance to it. It is harder to fear things when I am making progress on them—even if that progress is imperfect and slow. **Action relieves anxiety**.`,
  `I know that **when I embrace discomfort, I embrace progress**. It is only by challenging myself that I will continue to grow toward my dreams.`,
  `I strongly believe in the path I am on. I do not judge others, nor do I compare myself to others. **Everyone is on their own path, and I will focus on mine**.`,
  `I know that how I do anything is how I do everything and that challenge today leads to change tomorrow. I get stronger with each good choice I make, and **my dreams will not work unless I do**.`,
]

type StatementsListener = (statements: Statement[]) => void

export class StatementService {
  private storageService: StorageService
  private storageKey = 'still_statements'
  private listeners: StatementsListener[] = []

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  subscribe(listener: StatementsListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(statements: Statement[]) {
    this.listeners.forEach(listener => listener(statements))
  }

  /**
   * Initializes the service with default statements if none exist
   * NOTE: Must be called before using the service
   */
  async init(): Promise<Statement[]> {
    try {
      const existingStatements = await this.getAll()
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
        this.notifyListeners(defaultStatements)
        return defaultStatements
      }
      this.notifyListeners(existingStatements)
      return existingStatements
    } catch (error) {
      logger.error('Error initializing default statements', error as Error)
      return []
    }
  }

  async create(params: CreateStatementParams): Promise<Statement> {
    const statement: Statement = {
      id: uuidv4(),
      text: params.text,
      createdAt: Date.now(),
      lastReviewed: null,
      isActive: params.isActive ?? true,
      isFavorite: false,
      tags: params.tags || [],
    }

    const statements = await this.getAll()
    statements.push(statement)
    await this.saveAllStatements(statements)
    this.notifyListeners(statements)

    return statement
  }

  async update(params: UpdateStatementParams): Promise<Statement> {
    const statements = await this.getAll()
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
    this.notifyListeners(statements)
    return statements[index]
  }

  async getAll(): Promise<Statement[]> {
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

  async getActive(): Promise<Statement[]> {
    const statements = await this.getAll()
    return statements.filter(a => a.isActive)
  }

  async getArchived(): Promise<Statement[]> {
    const statements = await this.getAll()
    return statements.filter(a => !a.isActive)
  }

  async deleteStatement(id: string): Promise<void> {
    const statements = await this.getAll()
    const index = statements.findIndex(a => a.id === id)
    if (index !== -1) {
      statements.splice(index, 1)
      await this.saveAllStatements(statements)
      this.notifyListeners(statements)
    }
  }

  private async saveAllStatements(statements: Statement[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, statements)
    } catch (error) {
      logger.error('Error saving statements to storage', error as Error)
    }
  }

  /**
   * Filter statements to only include active ones.
   * Unlike getActive(), this method works on an in-memory array without accessing storage,
   * making it more efficient for subscription handlers that already have the data.
   */
  filterActive(statements: Statement[]): Statement[] {
    return statements.filter(s => s.isActive)
  }

  /**
   * Filter statements to only include archived ones.
   * Unlike getArchived(), this method works on an in-memory array without accessing storage,
   * making it more efficient for subscription handlers that already have the data.
   */
  filterArchived(statements: Statement[]): Statement[] {
    return statements.filter(s => !s.isActive)
  }
}

export const statementService = new StatementService(storageService)
