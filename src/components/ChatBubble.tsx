import { useState, useRef, useEffect } from 'react'
import { usePixieChat } from '@/hooks/usePixieChat'
import { useAnimationState } from '@/hooks/useAnimationState'
import { resetChat } from '@/services/api'
import './ChatBubble.css'

interface ChatBubbleProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatBubble({ isOpen, onClose }: ChatBubbleProps) {
  const [inputValue, setInputValue] = useState('')
  const { messages, sendMessage, isLoading, error, clearMessages } = usePixieChat()
  const { setAnimationState } = useAnimationState()
  const chatHistoryRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const msg = inputValue
    setInputValue('')
    setAnimationState('thinking')

    await sendMessage(msg)

    setAnimationState('happy')
    setTimeout(() => setAnimationState('idle'), 2500)
  }

  const handleResetChat = async () => {
    try {
      await resetChat()
      clearMessages()
    } catch {
      // Reset local state even if backend fails
      clearMessages()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="chat-bubble-container" id="pixie-chat-container">
      {/* Header */}
      <div className="chat-bubble-header">
        <div className="chat-header-info">
          <div className="chat-header-dot"></div>
          <h3>Pixie</h3>
        </div>
        <div className="chat-header-actions">
          <button
            onClick={handleResetChat}
            className="chat-action-btn"
            title="New conversation"
            id="pixie-chat-reset"
          >
            ↺
          </button>
          <button
            onClick={() => {
              onClose()
              setAnimationState('idle')
            }}
            className="chat-close"
            id="pixie-chat-close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-history" ref={chatHistoryRef} id="pixie-chat-history">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="welcome-emoji">✨</div>
            <p>Hi! I'm Pixie, your AI companion.</p>
            <p className="welcome-hint">Ask me anything!</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message message-${msg.role}`}
          >
            <span className="message-role">
              {msg.role === 'user' ? 'You' : '✨ Pixie'}
            </span>
            <p>{msg.content}</p>
            {msg.thinkingTime && (
              <span className="message-time">{msg.thinkingTime.toFixed(1)}s</span>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="chat-message message-assistant loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {error && (
          <div className="chat-error" id="pixie-chat-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <input
          ref={inputRef}
          type="text"
          placeholder="Tell Pixie something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSendMessage()
            }
          }}
          disabled={isLoading}
          className="chat-input"
          id="pixie-chat-input"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputValue.trim()}
          className="chat-send"
          id="pixie-chat-send"
        >
          {isLoading ? (
            <span className="send-loading">⏳</span>
          ) : (
            <span className="send-icon">↑</span>
          )}
        </button>
      </div>
    </div>
  )
}
