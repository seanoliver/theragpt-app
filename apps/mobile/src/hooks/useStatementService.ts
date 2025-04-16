import { useEffect, useState } from 'react'
import { statementService } from '@still/logic/src/statement/StatementService'
import { Statement } from '@still/logic/src/statement/types'

export function useStatementService() {
  const [ready, setReady] = useState(false)
  const [statements, setStatements] = useState<Statement[] | null>(null)

  useEffect(() => {
    let mounted = true
    async function initAndLoad() {
      const allStatements = await statementService.init()
      if (!mounted) return
      setReady(true)
      const activeStatements = allStatements.filter(s => s.isActive)
      setStatements(activeStatements)
    }
    initAndLoad()
    return () => { mounted = false }
  }, [])

  return { service: ready ? statementService : null, statements }
}