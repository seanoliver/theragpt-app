import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  Card,
  cardService,
  CreateCardParams,
  UpdateCardParams,
  cardInteractionService,
} from '@theragpt/logic'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface CardStore {
  // State
  cards: Card[]
  isLoading: boolean
  error: string | null

  // Actions
  initialize: () => Promise<void>
  setCards: (cards: Card[]) => void
  addCard: (params: CreateCardParams) => Promise<Card | undefined>
  updateCard: (params: UpdateCardParams) => Promise<void>
  deleteCard: (id: string) => Promise<void>

  // Card interaction actions
  upvoteCard: (id: string) => Promise<void>
  downvoteCard: (id: string) => Promise<void>
  reviewCard: (id: string) => Promise<void>
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  getCardById: (id: string) => Card | undefined
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      cards: [],
      isLoading: false,
      error: null,

      initialize: async () => {
        try {
          set({ isLoading: true, error: null })
          const cards = await cardService.init()
          set({ cards, isLoading: false })
        } catch (error) {
          set({ error: 'Failed to initialize cards', isLoading: false })
          console.error('Error initializing cards:', error)
        }
      },

      setCards: cards => set({ cards }),

      addCard: async params => {
        try {
          // Always create a new card with blank text and unique id
          const newCard = await cardService.create({ ...params, text: '' })
          set(state => {
            const alreadyExists = state.cards.some(
              card => card.id === newCard.id,
            )
            if (alreadyExists) {
              return state
            }
            return { cards: [...state.cards, newCard] }
          })
          return newCard
        } catch (error) {
          set({ error: 'Failed to add card' })
          console.error('Error adding card:', error)
          return undefined
        }
      },

      updateCard: async params => {
        try {
          const updatedCard = await cardService.update(params)
          set(state => ({
            cards: state.cards.map(card =>
              card.id === params.id ? updatedCard : card,
            ),
          }))
        } catch (error) {
          set({ error: 'Failed to update card' })
          console.error('Error updating card:', error)
        }
      },

      deleteCard: async id => {
        try {
          await cardService.deleteCard(id)
          set(state => ({
            cards: state.cards.filter(card => card.id !== id),
          }))
        } catch (error) {
          set({ error: 'Failed to delete card' })
          console.error('Error deleting card:', error)
        }
      },

      // Card interaction actions
      upvoteCard: async id => {
        try {
          await cardInteractionService.logVote(id, 'upvote')
          const totals = await cardInteractionService.getTotals(id)
          await cardService.update({
            id,
            upvotes: totals.upvotes,
            downvotes: totals.downvotes,
          })
          set(state => ({
            cards: state.cards.map(card =>
              card.id === id
                ? {
                    ...card,
                    upvotes: totals.upvotes,
                    downvotes: totals.downvotes,
                  }
                : card,
            ),
          }))
        } catch (error) {
          set({ error: 'Failed to upvote card' })
          console.error('Error upvoting card:', error)
        }
      },

      downvoteCard: async id => {
        try {
          await cardInteractionService.logVote(id, 'downvote')
          const totals = await cardInteractionService.getTotals(id)
          await cardService.update({
            id,
            upvotes: totals.upvotes,
            downvotes: totals.downvotes,
          })
          set(state => ({
            cards: state.cards.map(card =>
              card.id === id
                ? {
                    ...card,
                    upvotes: totals.upvotes,
                    downvotes: totals.downvotes,
                  }
                : card,
            ),
          }))
        } catch (error) {
          set({ error: 'Failed to downvote card' })
          console.error('Error downvoting card:', error)
        }
      },

      reviewCard: async id => {
        try {
          await cardInteractionService.logReview(id)
          const totals = await cardInteractionService.getTotals(id)
          await cardService.update({
            id,
            reviews: totals.reviews,
            lastReviewed: Date.now(),
          })
          set(state => ({
            cards: state.cards.map(card =>
              card.id === id
                ? {
                    ...card,
                    reviews: totals.reviews,
                    lastReviewed: Date.now(),
                  }
                : card,
            ),
          }))
        } catch (error) {
          console.error('Error reviewing card:', error)
        }
      },

      getCardById: id => get().cards.find(card => card.id === id),

      setLoading: isLoading => set({ isLoading }),

      setError: error => set({ error }),
    }),
    {
      name: 'card-storage', // unique name for localStorage
      partialize: state => ({ cards: state.cards }), // only persist cards
      storage: createJSONStorage(() => AsyncStorage), // Use AsyncStorage for React Native
    },
  ),
)
