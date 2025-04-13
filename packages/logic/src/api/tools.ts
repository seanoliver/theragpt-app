export const TOOLS = [
  {
    "type": "function",
    "name": "analyze_thought",
    "description": "Identify the cognitive distortions present in a thought.",
    "parameters": {
      "type": "object",
      "properties": {
        "thought": {
          "type": "string",
          "description": "The thought to analyze"
        },
        "context": {
          "type": "string",
          "description": "Additional context for the thought"
        },
      },
      required: ['thought'],
    },
  },
]