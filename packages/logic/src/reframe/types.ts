import { Entry } from '../entry'

export interface Reframe {
  id: string
  entryId: Entry['id']
  text: string
  timestamp: number
  source: 'ai' | 'user-edit'
  style?: string // TBD: enum for 'rational' | 'encouraging' etc.
  explanation?: string // Explanation of why this reframe works
  feedback?: 'accepted' | 'edited' | 'rejected'
  rejectionReason?: string // TODO: Optional enum for standard reasons
}

export interface ReframeInput {
  entryId: Entry['id']
  text: string
  source: 'ai' | 'user-edit'
  style?: string
  explanation?: string
}

export interface ReframeListener {
  (reframes: Reframe[]): void
}
