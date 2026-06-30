import { useAnimationState } from './useAnimationState'
import { useState, useCallback } from 'react'
import { sendChatMessage, type ChatResponse } from '@/services/api'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  thinkingTime?: number
}

export function usePixieChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setIsThinking } = useAnimationState()

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return

    try {
      setError(null)
      setIsLoading(true)
      setIsThinking(true)

      // Add user message to chat
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

      // Call FastAPI backend directly via HTTP
      const response: ChatResponse = await sendChatMessage(userMessage)

      // Add Pixie's response
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.response,
          thinkingTime: response.thinking_time,
        },
      ])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
      setIsThinking(false)
    }
  }, [setIsThinking])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    setMessages,
    clearMessages,
  }
}
