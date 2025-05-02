import { Entry } from '../entry'

export interface Reframe {
  id: string
  entryId: Entry['id']
  text: string
  timestamp: number
  source: 'ai' | 'user-edit'
  style?: string // TBD: enum for 'rational' | 'encouraging' etc.
  feedback?: 'accepted' | 'edited' | 'rejected'
  rejectionReason?: string // TODO: Optional enum for standard reasons
}
