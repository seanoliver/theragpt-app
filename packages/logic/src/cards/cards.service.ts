import { v4 as uuidv4 } from 'uuid'
import { StorageService, storageService } from '../storage/storage.service'

export interface Card {
  id: string
  text: string
  createdAt: number
  lastReviewed: number | null
  isActive: boolean
  isFavorite: boolean
  tags?: string[]
  upvotes?: number
  downvotes?: number
  reviews?: number
}

export interface UpdateCardParams {
  id: string
  text?: string
  isActive?: boolean
  isFavorite?: boolean
  tags?: string[]
  category?: string
  upvotes?: number
  downvotes?: number
  reviews?: number
  lastReviewed?: number
}

export interface CreateCardParams {
  text: string
  tags?: string[]
  isActive?: boolean
  category?: string
}

const DEFAULT_CARDS = [
  'I know the key to success is always to take action, even when I don\'t feel ready for it.',
  'I know that what I react to in others, I strengthen in myself. I focus all of my energy on the current moment, so that I can consistently act with calm, intention, and thoughtfulness.',
  'I know which actions bring me closer to my goals and which ones take me away from them. I focus on the former and work to eliminate the latter. Currently, these actions include:\n- excercise,\n- meditation,\n- conscious and purposeful eating,\n- taking exceptional notes,\n- writing,\n- setting a realistic and achievable daily to do list, and\n- reading this personal manifesto with the knowing conviction that its words are true.',
  'I know that alcohol and drugs take me away from my goals by sapping my energy, my creativity, my compassion, and my capacity for mindfulness.',
  'I create positive habits, and I know that progress comes little by little. By making a 1% improvement every day, I will change my life dramatically over time.',
  'I do not get down about my mistakes as they are proof that I am trying. The more I practice trying, failing, and learning, the easier it will become. I know the only thing that counts is what I do from now on.',
  'I know that working on a problem reduces my resistance to it. It is harder to fear things when I am making progress on them—even if that progress is imperfect and slow. Action relieves anxiety.',
  'I know that when I embrace discomfort, I embrace progress. It is only by challenging myself that I will continue to grow toward my dreams.',
  'I strongly believe in the path I am on. I do not judge others, nor do I compare myself to others. Everyone is on their own path, and I will focus on mine.',
  'I know that how I do anything is how I do everything and that challenge today leads to change tomorrow. I get stronger with each good choice I make, and my dreams will not work unless I do.',
]

type CardsListener = (cards: Card[]) => void

export class CardService {
  private storageService: StorageService
  private storageKey = 'still_cards'
  private listeners: CardsListener[] = []
  private cardsCache: Card[] | null = null
  private cardsMap: Map<string, Card> = new Map()

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  subscribe(listener: CardsListener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners(cards: Card[]) {
    this.listeners.forEach(listener => listener(cards))
  }

  /**
   * Initializes the service with default cards if none exist
   * NOTE: Must be called before using the service
   */
  async init(): Promise<Card[]> {
    try {
      const existingCards = await this.getAll()
      if (existingCards.length === 0) {
        const defaultCards = DEFAULT_CARDS.map(text => ({
          id: uuidv4(),
          text,
          createdAt: Date.now(),
          lastReviewed: null,
          isActive: true,
          isFavorite: false,
          tags: [],
        }))
        await this.saveAllCards(defaultCards)
        this.notifyListeners(defaultCards)
        return defaultCards
      }
      this.notifyListeners(existingCards)
      return existingCards
    } catch (error) {
      console.error('Error initializing default cards', error as Error)
      return []
    }
  }

  async create(params: CreateCardParams): Promise<Card> {
    const card: Card = {
      id: uuidv4(),
      text: params.text,
      createdAt: Date.now(),
      lastReviewed: null,
      isActive: params.isActive ?? true,
      isFavorite: false,
      tags: params.tags || [],
      upvotes: 0,
      downvotes: 0,
      reviews: 0,
    }

    const cards = await this.getAll()
    cards.push(card)
    await this.saveAllCards(cards)
    this.notifyListeners(cards)

    return card
  }

  async update(params: UpdateCardParams): Promise<Card> {
    const cards = await this.getAll()
    const index = cards.findIndex(a => a.id === params.id)

    if (index === -1) {
      throw new Error(`Card with ID ${params.id} not found`)
    }

    const card = cards[index]
    cards[index] = {
      ...card,
      text: params.text ?? card.text,
      isActive: params.isActive ?? card.isActive,
      isFavorite: params.isFavorite ?? card.isFavorite,
      tags: params.tags ?? card.tags,
      upvotes: params.upvotes ?? card.upvotes,
      downvotes: params.downvotes ?? card.downvotes,
      reviews: params.reviews ?? card.reviews,
      lastReviewed: params.lastReviewed ?? card.lastReviewed,
    }

    await this.saveAllCards(cards)
    this.notifyListeners(cards)
    return cards[index]
  }

  async getAll(): Promise<Card[]> {
    if (this.cardsCache) return this.cardsCache
    try {
      const data = await this.storageService.getItem<Card[]>(this.storageKey)
      this.updateCache(data || [])
      return this.cardsCache!
    } catch (error) {
      console.error('Error getting cards from storage', error as Error)
      return []
    }
  }

  async getActive(): Promise<Card[]> {
    const cards = await this.getAll()
    return cards.filter(a => a.isActive)
  }

  async getArchived(): Promise<Card[]> {
    const cards = await this.getAll()
    return cards.filter(a => !a.isActive)
  }

  async deleteCard(id: string): Promise<void> {
    const cards = await this.getAll()
    const index = cards.findIndex(a => a.id === id)
    if (index !== -1) {
      cards.splice(index, 1)
      await this.saveAllCards(cards)
      this.notifyListeners(cards)
    }
  }

  private async saveAllCards(cards: Card[]): Promise<void> {
    try {
      await this.storageService.setItem(this.storageKey, cards)
      this.updateCache(cards)
    } catch (error) {
      console.error('Error saving cards to storage', error as Error)
    }
  }

  /**
   * Filter cards to only include active ones.
   * Unlike getActive(), this method works on an in-memory array without accessing storage,
   * making it more efficient for subscription handlers that already have the data.
   */
  filterActive(cards: Card[]): Card[] {
    return cards.filter(s => s.isActive)
  }

  /**
   * Filter cards to only include archived ones.
   * Unlike getArchived(), this method works on an in-memory array without accessing storage,
   * making it more efficient for subscription handlers that already have the data.
   */
  filterArchived(cards: Card[]): Card[] {
    return cards.filter(s => !s.isActive)
  }

  private updateCache(cards: Card[]) {
    this.cardsCache = cards
    this.cardsMap = new Map(cards.map(card => [card.id, card]))
  }

  getCardById(id: string): Card | undefined {
    return this.cardsMap.get(id)
  }
}

export const cardService = new CardService(storageService)
