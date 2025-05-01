import { Reframe } from '../reframes/types'

export interface Distortion {
  id: string
  icon: string
  label: string
  text: string
}

export interface DistortionInstance {
  id: string
  distortionId: Distortion['id']
  text: string
  timestamp?: number
}

export interface Entry {
  id: string
  rawText: string
  distortions?: DistortionInstance[]
  reframes?: Reframe[]
  tags?: string[]
  createdAt: number
  updatedAt?: number
  reviewedAt?: number
  reviewCount?: number
  isPinned?: boolean
}

export interface EntryInput {
  id: string
  rawText: string
  createdAt: number
}

export type EntryListener = (entries: Entry[]) => void
