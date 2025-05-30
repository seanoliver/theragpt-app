# PostHog LLM Observability

This module provides comprehensive observability for LLM API calls using PostHog's analytics platform.

## Features

- **Request Tracking**: Captures model, provider, prompt details, and configuration
- **Response Tracking**: Records response length, duration, and token usage
- **Error Tracking**: Captures and reports errors with full stack traces
- **Streaming Support**: Tracks streaming responses with sampled chunk monitoring
- **User Attribution**: Links LLM calls to specific users when user ID is provided

## Events Tracked

### `llm_request_start`
Fired when an LLM request begins. Properties include:
- `model`: The LLM model being used (e.g., "gpt-4o")
- `provider`: The provider (e.g., "openai")
- `request_id`: Unique identifier for the request
- `prompt_length`: Length of the input prompt
- `prompt_preview`: First 100 characters of the prompt
- `has_system_prompt`: Whether a system prompt was provided
- `temperature`: Temperature setting
- `max_tokens`: Maximum tokens requested

### `llm_request_success`
Fired when an LLM request completes successfully. Properties include:
- All properties from `llm_request_start`
- `response_length`: Length of the response
- `duration_ms`: Time taken for the request
- `prompt_tokens`: Tokens used in the prompt (if available)
- `completion_tokens`: Tokens used in the completion (if available)
- `total_tokens`: Total tokens used (if available)

### `llm_request_error`
Fired when an LLM request fails. Properties include:
- All properties from `llm_request_start`
- `duration_ms`: Time until failure
- `error_message`: The error message
- `error_stack`: Stack trace (in development)

### `llm_stream_chunk`
Fired periodically during streaming responses (every 10th chunk). Properties include:
- `model`, `provider`, `request_id`
- `chunk_index`: Index of the chunk
- `chunk_length`: Length of the chunk

## Configuration

Set these environment variables:

```env
# Required for PostHog
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-api-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Enable LLM tracing
POSTHOG_LLM_TRACING_ENABLED=true
```

## Usage

The tracing is automatically applied when you create an LLM registry with tracing enabled:

```typescript
const registry = createClientRegistry({
  openAIApiKey: process.env.OPENAI_API_KEY,
  tracing: {
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    enabled: process.env.POSTHOG_LLM_TRACING_ENABLED === 'true',
  },
})
```

### With User Attribution

Pass a user ID to attribute LLM calls to specific users:

```typescript
const response = await callLLM(LLMModel.GPT_4O, registry, {
  prompt: "Hello, world!",
  userId: "user-123",
  temperature: 0.7,
})
```

## Privacy Considerations

- Only the first 100 characters of prompts are included in events
- Full prompt/response content is never sent to PostHog
- User IDs are optional and default to "anonymous"
- Error stack traces are only included in development

## Performance Impact

- Minimal overhead: Events are sent asynchronously
- Streaming chunks are sampled (every 10th chunk) to reduce volume
- PostHog client is configured for immediate flushing to avoid memory buildup