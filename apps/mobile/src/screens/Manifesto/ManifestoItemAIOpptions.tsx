import { apiService } from '@/packages/logic/src/api/service'
import { Statement } from '@/packages/logic/src/statement/statementService'
import { getEnvironment } from '@still/config'
import { useEffect } from 'react'
import AIOptionsModal from '../../shared/AIOptionsModal/AIOptionsModal'
import { useFetchAlternatives } from '../../shared/hooks/useFetchAlternatives'

export const ManifestoItemAIOpptions = ({
  currentStatement,
  setCurrentStatement,
  showAIModal,
  setShowAIModal,
}: {
  currentStatement: Statement
  setCurrentStatement: (statement: Statement) => void
  showAIModal: boolean
  setShowAIModal: (showAIModal: boolean) => void
}) => {
  const env = getEnvironment(true)

  const { alternatives, loading, error, fetchAlternatives, setError } =
    useFetchAlternatives()

  useEffect(() => {
    fetchAlternatives(currentStatement.text)
  }, [currentStatement.text])

  const handleReplace = (text: string) => {
    setCurrentStatement({ ...currentStatement, text })
    setShowAIModal(false)
  }

  const handleAppend = (text: string) => {
    setCurrentStatement({
      ...currentStatement,
      text: currentStatement.text + (currentStatement.text ? ' ' : '') + text,
    })
    setShowAIModal(false)
  }

  const handleRetry = async (tone: string) => {
    setError(null)
    try {
      const config = await apiService.generateAlternative(
        currentStatement.text,
        tone,
      )
      const response = await fetch(`${env.STILL_API_BASE_URL}/api/rephrase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      const data = await response.json()
      if (data.success && data.tone && data.text) {
        setCurrentStatement({
          ...currentStatement,
          text:
            currentStatement.text +
            (currentStatement.text ? ' ' : '') +
            data.text,
        })
        setShowAIModal(false)
      } else {
        setError(data.error || 'Failed to fetch alternative')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alternative')
    }
  }

  return (
    <AIOptionsModal
      visible={showAIModal}
      value={currentStatement.text}
      alternatives={alternatives}
      loading={loading}
      error={error}
      onClose={() => setShowAIModal(false)}
      onReplace={handleReplace}
      onAppend={handleAppend}
      onRetry={handleRetry}
    />
  )
}
