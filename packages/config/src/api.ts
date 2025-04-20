import { getEnvironment } from './environment'

// API endpoints
export const API_ENDPOINTS = {
  OPENAI: {
    CHAT_COMPLETIONS: '/chat/completions',
  },
}

// API configuration
export const getApiConfig = (serverSide = false) => {
  const env = getEnvironment(serverSide)

  return {
    openai: {
      baseUrl: env.OPENAI_API_URL,
      apiKey: serverSide ? env.OPENAI_API_KEY : undefined,
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 1000,
    },
  }
}

// API request headers
export const getApiHeaders = (serverSide = false) => {
  const config = getApiConfig(serverSide)

  return {
    openai: {
      'Content-Type': 'application/json',
      ...(serverSide && config.openai.apiKey
        ? { Authorization: `Bearer ${config.openai.apiKey}` }
        : {}),
    },
  }
}

export const getStillApiBaseUrl = (serverSide = false) => {
  const env = getEnvironment(serverSide)
  return env.STILL_API_BASE_URL
}