import { useState, useEffect, useCallback } from 'react'
import { useStatementService } from '../../hooks/useStatementService'
import { Statement } from '@/packages/logic/src/statement/statementService'

export interface DisplayStatement {
  id: string
  text: string
  category?: string
  lastReviewed?: string
  netVotes?: number
  frequency?: 'More' | 'Less' | 'Normal'
  reviews?: number
}

interface UseManifestoDataResult {
  data: DisplayStatement[]
  loading: boolean
  error: string | null
  createStatement: () => Promise<void>
}

export const useManifestoData = (): UseManifestoDataResult => {
  const { service, statements } = useStatementService()
  const [loading, setLoading] = useState(!statements)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(!statements)
  }, [statements])

  // Map raw statements to UI Statement type
  const mapStatement = (s: Statement): DisplayStatement => {
    const netVotes = s.upvotes && s.downvotes ? s.upvotes - s.downvotes : 0
    const frequency =
      netVotes === 0 ? undefined : netVotes > 0 ? 'More' : 'Less'
    const category = s.tags ? s.tags[0] : undefined

    return {
      id: s.id,
      text: s.text,
      category,
      lastReviewed: s.lastReviewed
        ? new Date(s.lastReviewed).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : '',
      netVotes,
      frequency,
      reviews: s.reviews ?? 0,
    }
  }

  const mappedStatements = (statements || []).map(mapStatement)

  const createStatement = useCallback(async () => {
    if (!service) return
    try {
      setLoading(true)
      await service.create({ text: '', isActive: true })
      setLoading(false)
    } catch (err) {
      setError('Failed to create statement')
      setLoading(false)
    }
  }, [service])

  return {
    data: mappedStatements,
    loading,
    error,
    createStatement,
  }
}
