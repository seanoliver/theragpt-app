import { Entry } from '@theragpt/logic'
import { useEffect, useRef, useState } from 'react'

interface UseStreamEntryProps {
  endpoint: string
  prompt: string
  thought: string
  onComplete?: (finalEntry: Partial<Entry>) => void
  onPatch?: (patch: Partial<Entry>) => void
}

export const useStreamEntry = ({
  endpoint,
  prompt,
  thought,
  onComplete,
  onPatch,
}: UseStreamEntryProps) => {
  const [entryText, setEntryText] = useState('')
  const [rawThought, setRawThought] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasStreamedRef = useRef(false)
  const controllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!prompt || !thought || hasStreamedRef.current) return

    hasStreamedRef.current = true
    const start = async () => {
      setIsStreaming(true)
      setError(null)
      setEntryText('')
      setRawThought('')

      const controller = new AbortController()
      controllerRef.current = controller

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, thought }),
          signal: controller.signal,
        })

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        let buffer = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          buffer += chunk

          const events = buffer.split('\n\n')

          for (const rawEvent of events) {
            if (!rawEvent.startsWith('data: ')) continue

            const prefix = 'data: '
            const json = rawEvent.startsWith(prefix)
              ? JSON.parse(rawEvent.slice(prefix.length))
              : JSON.parse(rawEvent)

            if (!json) continue

            const { type, content, field, value } = json

            if (type === 'thought') {
              setRawThought(content)
              if (onPatch) {
                onPatch({ [field]: value })
              }
            } else if (type === 'complete') {
              if (onComplete) onComplete(content)
              setIsStreaming(false)
              return
            } else if (type === 'error') {
              setError(content)
              setIsStreaming(false)
              return
            }
          }

          buffer = events[events.length - 1]
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError(err.message || 'Streaming failed')
          setIsStreaming(false)
        } else {
          setError(
            err instanceof Error ? err.message : 'An unknown error occurred',
          )
          setIsStreaming(false)
        }
      } finally {
        setIsStreaming(false)
      }
    }

    start()

    return () => {
      if (controllerRef.current && !controllerRef.current.signal.aborted) {
        controllerRef.current.abort()
      }
    }
  }, [endpoint, prompt, thought, onComplete, onPatch])

  return {
    entryText,
    rawThought,
    isStreaming,
    error,
  }
}
