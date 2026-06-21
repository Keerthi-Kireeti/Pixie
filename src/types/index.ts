// TypeScript Type Definitions for Pixie Frontend

// Animation States
export type AnimationState = 'idle' | 'thinking' | 'happy' | 'listening' | 'sleeping' | 'walking'

// Chat Types
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  messages: Message[]
  created_at: Date
  updated_at: Date
}

// API Response Types
export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ChatResponse {
  response: string
  conversation_id: string
  thinking_time: number
}

export interface HealthResponse {
  status: 'ok' | 'warning'
  backend: boolean
  ollama: boolean
  database: boolean
}

// Reminder Types
export interface Reminder {
  id: number
  title: string
  description?: string
  scheduled_time: string
  created_at: string
  is_completed: boolean
}

// Component Props
export interface PixieCharacterProps {
  state: AnimationState
  onClick: () => void
}

export interface ChatBubbleProps {
  isOpen: boolean
  onClose: () => void
}

export interface PixieWindowProps {
  x?: number
  y?: number
}
