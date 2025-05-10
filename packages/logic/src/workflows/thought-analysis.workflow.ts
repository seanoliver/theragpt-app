import { AnalysisResponse, AnalysisResult } from './types'
import JSON5 from 'json5'

export const fetchPromptOutput = async (
  prompt: string,
): Promise<AnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to analyze thought')
    }

    const data: AnalysisResponse = await response.json()
    return data.result
  } catch (error) {
    console.error('Error analyzing thought:', error)
    throw new Error('Failed to analyze thought')
  }
}

export const extractJsonKeysFromPartial = (input: string): Set<string> => {
  const keyRegex = /"([^"]+)"(?=\s*:)/g
  const result = new Set<string>()

  type StackFrame = { key: string | null; index?: number }
  const stack: StackFrame[] = []

  let match: RegExpExecArray | null
  let lastIndex = 0
  const currentArrayIndexStack: number[] = []

  while ((match = keyRegex.exec(input)) !== null) {
    const key = match[1]
    const preceding = input.slice(lastIndex, match.index)
    lastIndex = keyRegex.lastIndex

    // Count structure characters to track stack behavior
    const openBraces = (preceding.match(/{/g) || []).length
    const closeBraces = (preceding.match(/}/g) || []).length
    const openBrackets = (preceding.match(/\[/g) || []).length
    const closeBrackets = (preceding.match(/]/g) || []).length
    const commas = (preceding.match(/,/g) || []).length

    // Handle open brackets (start of array)
    for (let i = 0; i < openBrackets; i++) {
      currentArrayIndexStack.push(0)
      stack.push({ key: null, index: 0 }) // placeholder for array
    }

    // Handle open braces (start of object)
    for (let i = 0; i < openBraces; i++) {
      stack.push({ key }) // push current key as context
    }

    // Handle commas inside arrays: bump the top array index
    for (let i = 0; i < commas; i++) {
      if (currentArrayIndexStack.length > 0) {
        const last = currentArrayIndexStack.length - 1
        currentArrayIndexStack[last] += 1

        // update the top array stack frame with new index
        for (let j = stack.length - 1; j >= 0; j--) {
          if (stack[j].index !== undefined) {
            stack[j].index = currentArrayIndexStack[last]
            break
          }
        }
      }
    }

    // Handle key path
    const parts = stack.map(({ key, index }) => {
      if (key === null) return `[${index}]`
      return index !== undefined ? `${key}[${index}]` : key
    })

    parts.push(key)
    const fullPath = parts.join('.')
    result.add(fullPath)

    // Handle closing brackets/braces (pop context)
    for (let i = 0; i < closeBraces; i++) {
      while (stack.length && stack[stack.length - 1].index === undefined) {
        stack.pop()
      }
    }

    for (let i = 0; i < closeBrackets; i++) {
      while (stack.length && stack[stack.length - 1].index !== undefined) {
        stack.pop()
      }
      currentArrayIndexStack.pop()
    }
  }

  return result
}

export const extractJsonKeysDotNotation = (input: string): Set<string> => {
  const result = new Set<string>()

  const traverse = (value: any, path: string[] = []) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        const nextPath = [...path, `[${index}]`]
        result.add(nextPath.join('.'))
        traverse(item, nextPath)
      })
    } else if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
        const nextPath = [...path, key]
        result.add(nextPath.join('.'))
        traverse(value[key], nextPath)
      }
    }
  }

  try {
    const parsed = JSON5.parse(input)
    traverse(parsed)
  } catch (e) {
    console.warn(
      'Could not parse partial JSON:',
      e instanceof Error ? e.message : 'Unknown error',
    )
  }

  return result
}
