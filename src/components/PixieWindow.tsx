import { useState } from 'react'
import PixieCharacter from './PixieCharacter'
import ChatBubble from './ChatBubble'
import { useAnimationState } from '@/hooks/useAnimationState'
import './PixieWindow.css'

export function PixieWindow() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const { setAnimationState } = useAnimationState()

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.chat-bubble-container')) {
      return // Don't drag if clicking inside chat
    }

    setIsDragging(true)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setAnimationState('walking')
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const el = e.currentTarget as HTMLElement
    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    el.style.position = 'fixed'
    el.style.left = `${newX}px`
    el.style.top = `${newY}px`
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setAnimationState('idle')
  }

  const handleClick = () => {
    setAnimationState('listening')
  }

  return (
    <div
      className="pixie-window"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <PixieCharacter />
      <ChatBubble />
    </div>
  )
}

export default PixieWindow
