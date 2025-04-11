import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
export interface IMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
}

export interface ConversationThread {
  id: string
  messages: IMessage[]
}

export const useConversationThread = () => {
  const [conversationThread, setConversationThread] = useState<
    ConversationThread[]
  >([])

  const addMessage = (message: IMessage) => {
    setConversationThread(prev => [
      ...prev,
      { id: uuidv4(), messages: [message] },
    ])
  }

  return { conversationThread, addMessage }
}
