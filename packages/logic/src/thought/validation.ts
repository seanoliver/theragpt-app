import { z } from 'zod'
import { MAX_THOUGHT_LENGTH } from '@northstar/config'
import { Thought, ValidationResult } from './types'

/**
 * ThoughtValidator class for validating thoughts
 */
export class ThoughtValidator {
  /**
   * Zod schema for validating complete thought objects
   */
  private thoughtSchema = z.object({
    content: z
      .string()
      .min(1, { message: 'Thought cannot be empty' })
      .max(MAX_THOUGHT_LENGTH, {
        message: `Thought exceeds maximum length of ${MAX_THOUGHT_LENGTH} ` +
          'characters',
      }),
    context: z.string().optional(),
    userId: z.string().optional(),
    createdAt: z.number(),
  })

  /**
   * Zod schema for validating thought content only
   */
  private thoughtContentSchema = z
    .string()
    .min(1, { message: 'Thought cannot be empty' })
    .max(MAX_THOUGHT_LENGTH, {
      message: `Thought exceeds maximum length of ${MAX_THOUGHT_LENGTH} ` +
        'characters',
    })

  /**
   * Validates a thought to ensure it meets the requirements
   * @param thought The thought to validate
   * @returns A validation result object
   */
  public validateThought(thought: Thought | string): ValidationResult {
    try {
      // Handle both string and Thought object
      if (typeof thought === 'string') {
        this.thoughtContentSchema.parse(thought)
      } else {
        this.thoughtSchema.parse(thought)
      }

      return { valid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: error.errors[0].message,
        }
      }

      return {
        valid: false,
        error: 'Invalid thought',
      }
    }
  }

  /**
   * Validates thought content only
   * @param content The thought content to validate
   * @returns A validation result object
   */
  public validateContent(content: string): ValidationResult {
    try {
      this.thoughtContentSchema.parse(content)
      return { valid: true }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          error: error.errors[0].message,
        }
      }

      return {
        valid: false,
        error: 'Invalid thought content',
      }
    }
  }
}

// Export a singleton instance for convenience
export const thoughtValidator = new ThoughtValidator()
