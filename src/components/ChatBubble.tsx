import { useState } from 'react'
import { usePixieChat } from '@/hooks/usePixieChat'
import { useAnimationState } from '@/hooks/useAnimationState'
import './ChatBubble.css'

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const { messages, sendMessage, isLoading, error } = usePixieChat()
  const { setAnimationState } = useAnimationState()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    setAnimationState('thinking')
    await sendMessage(inputValue)
    setInputValue('')
    setAnimationState('happy')

    // Return to idle after a moment
    setTimeout(() => setAnimationState('idle'), 2000)
  }

  if (!isOpen) {
    return (
      <div className="chat-bubble-trigger">
        <button onClick={() => setIsOpen(true)} className="chat-toggle">
          💬
        </button>
      </div>
    )
  }

  return (
    <div className="chat-bubble-container">
      <div className="chat-bubble-header">
        <h3>Pixie</h3>
        <button onClick={() => setIsOpen(false)} className="chat-close">
          ✕
        </button>
      </div>

      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message message-${msg.role}`}>
            <span className="message-role">{msg.role === 'user' ? 'You' : 'Pixie'}</span>
            <p>{msg.content}</p>
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

        {error && <div className="chat-error">⚠️ {error}</div>}
      </div>

      <div className="chat-input-area">
        <input
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
        />
        <button onClick={handleSendMessage} disabled={isLoading} className="chat-send">
          {isLoading ? '...' : '✉️'}
        </button>
      </div>
    </div>
  )
}
