export interface User {
  id: string
  createdAt: number
  email?: string
  preferredTone?: 'rational' | 'warm' | 'stoic' // TODO: add more
  memory?: string // AI maintained log of preferences & history
}

export type UserInput = {
  id: string
  createdAt: number
}