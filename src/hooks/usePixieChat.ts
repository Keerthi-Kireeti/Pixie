import { useAnimationState } from './useAnimationState'
import { useState } from 'react'

interface ChatResponse {
  success: boolean
  data?: {
    response: string
  }
  error?: string
}

// Helper to safely invoke Tauri commands, with fallback for browser-only dev mode
async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const { invoke } = await import('@tauri-apps/api/tauri')
    return await invoke<T>(command, args)
  } catch {
    // Running in browser without Tauri — return mock data
    console.warn(`[Pixie] Tauri not available. Command "${command}" mocked.`)
    if (command === 'pixie_chat') {
      return {
        success: true,
        data: {
          response: `Hi! I'm Pixie 🧚 (running in browser dev mode — Tauri not connected). You said: "${(args as Record<string, string>)?.message ?? ''}"`,
        },
      } as unknown as T
    }
    throw new Error('Tauri runtime not available')
  }
}

export function usePixieChat() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setIsThinking } = useAnimationState()

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return

    try {
      setError(null)
      setIsLoading(true)
      setIsThinking(true)

      // Add user message to chat
      setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

      // Call Tauri command which forwards to Python backend
      const response = await tauriInvoke<ChatResponse>('pixie_chat', { message: userMessage })

      if (response.success && response.data) {
        // Add Pixie's response
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data!.response }])
      } else {
        setError(response.error || 'Failed to get response from Pixie')
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMsg)
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
      setIsThinking(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    setMessages,
  }
}
