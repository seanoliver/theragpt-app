import { useEffect, useState } from 'react'
import { statementService } from '@still/logic/src/statement/statementService'
import { Statement } from '@still/logic/src/statement/statementService'

export const useStatementService = (archived: boolean = false) => {
  const [ready, setReady] = useState(false)
  const [statements, setStatements] = useState<Statement[] | null>(null)

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    const initAndLoad = async () => {
      await statementService.init()
      if (!mounted) return

      setReady(true)

      const fetchedStatements = archived
        ? statementService.getArchived
        : statementService.getActive

      // Need to .call(service) to bind 'this' to the service instance
      setStatements(await fetchedStatements.call(statementService))

      unsubscribe = statementService.subscribe(stmts => {
        if (mounted)
          setStatements(
            archived
              ? statementService.filterArchived(stmts)
              : statementService.filterActive(stmts),
          )
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
