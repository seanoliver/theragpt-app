import { useEffect, useState } from 'react'
import { statementService } from '@still/logic/src/statement/StatementService'

export function useStatementService() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let mounted = true
    statementService.init().then(() => {
      if (mounted) setReady(true)
    })
    return () => { mounted = false }
  }, [])

  return ready ? statementService : null
}