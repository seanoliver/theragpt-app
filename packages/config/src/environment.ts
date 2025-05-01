import { z } from 'zod'

// Define environment schema
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  OPENAI_API_URL: z.string().url().default('https://api.openai.com/v1'),
  // API keys only available server-side
  OPENAI_API_KEY: z.string().optional(),
  THERAGPT_API_BASE_URL: z.string().url().optional(),
})

// Type for the environment variables
export type Environment = z.infer<typeof envSchema>

// Function to get environment variables with validation
export const getEnvironment = (serverSide = false): Environment => {
  const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    OPENAI_API_URL: process.env.OPENAI_API_URL || 'https://api.openai.com/v1',
    // Only include API key if server-side
    ...(serverSide ? { OPENAI_API_KEY: process.env.OPENAI_API_KEY } : {}),
    THERAGPT_API_BASE_URL:
      process.env.THERAGPT_API_BASE_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://example.com'
        : 'http://localhost:3000'),
  }

  // Validate environment
  const result = envSchema.safeParse(env)

  if (!result.success) {
    console.error('Invalid environment configuration:', result.error)
    throw new Error('Invalid environment configuration')
  }

  return result.data
}
