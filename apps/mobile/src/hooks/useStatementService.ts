import { useEffect, useState } from 'react'
import { statementService } from '@still/logic/src/statement/statementService'
import { Statement } from '@still/logic/src/statement/types'

export function useStatementService() {
  const [ready, setReady] = useState(false)
  const [statements, setStatements] = useState<Statement[] | null>(null)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined
    async function initAndLoad() {
      const allStatements = await statementService.init()

      if (!mounted) return

      setReady(true)

      const activeStatements = allStatements.filter(s => s.isActive)
      setStatements(activeStatements)

      unsubscribe = statementService.subscribe((stmts) => {
        if (mounted) setStatements(stmts.filter(s => s.isActive))
      })

    }
    initAndLoad()
    return () => {
      mounted = false
      if (unsubscribe) unsubscribe()
    }
  }, [])

  return { service: ready ? statementService : null, statements }
}
