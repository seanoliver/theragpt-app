import { useState, useEffect } from 'react'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

export interface IMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
}

export interface AssistantMessage {
  content: string
  triggerAfterUserMessage?: boolean
}

export interface ConversationConfig {
  initialMessage: AssistantMessage
  followUpMessages: AssistantMessage[]
}

export const useConversationThread = (config: ConversationConfig) => {
  const [conversationThread, setConversationThread] = useState<IMessage[]>([])
  const [userMessageCount, setUserMessageCount] = useState(0)

  useEffect(() => {
    // Add initial assistant message
    setConversationThread([
      {
        id: uuidv4(),
        content: config.initialMessage.content,
        role: 'assistant'
      }
    ])
  }, [config.initialMessage.content])

  const addMessage = (message: IMessage) => {
    setConversationThread(prev => [...prev, message])
    setUserMessageCount(prev => prev + 1)
  }

  const addFollowUpMessage = () => {
    const nextMessage = config.followUpMessages[userMessageCount - 1]
    if (nextMessage) {
      setConversationThread(prev => [
        ...prev,
        {
          id: uuidv4(),
          content: nextMessage.content,
          role: 'assistant'
        }
      ])
    }
  }

  return { conversationThread, addMessage, addFollowUpMessage }
}
