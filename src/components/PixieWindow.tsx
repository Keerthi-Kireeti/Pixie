import { useState, useRef, useEffect } from 'react'
import PixieCharacter from './PixieCharacter'
import ChatBubble from './ChatBubble'
import { useAnimationState } from '@/hooks/useAnimationState'
import { isTauriEnvironment } from '@/services/api'
import './PixieWindow.css'

export function PixieWindow() {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showMenu, setShowMenu] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { setAnimationState, currentState } = useAnimationState()
  const windowRef = useRef<HTMLDivElement>(null)

  // Close context menu on click outside
  useEffect(() => {
    const handleOutsideClick = () => {
      if (showMenu) {
        setShowMenu(false)
      }
    }
    document.addEventListener('click', handleOutsideClick)
    return () => document.removeEventListener('click', handleOutsideClick)
  }, [showMenu])

  // Handle dynamic Tauri window resizing when chat opens/closes
  useEffect(() => {
    const updateWindowSize = async () => {
      if (isTauriEnvironment()) {
        try {
          const { appWindow, LogicalSize } = await import('@tauri-apps/api/window')
          if (isChatOpen) {
            // Expand to fit both Pixie and chat bubble
            await appWindow.setSize(new LogicalSize(400, 500))
          } else {
            // Shrink to just fit the Pixie character widget
            await appWindow.setSize(new LogicalSize(200, 220))
          }
        } catch (err) {
          console.warn('Failed to resize Tauri window:', err)
        }
      }
    }
    updateWindowSize()
  }, [isChatOpen])

  const handleMouseDown = async (e: React.MouseEvent) => {
    // Only drag when clicking the character container, not chat or menu
    const target = e.target as HTMLElement
    if (target.closest('.chat-bubble-container') || target.closest('.pixie-context-menu')) {
      return
    }

    e.preventDefault()
    setAnimationState('walking')

    if (isTauriEnvironment()) {
      try {
        const { appWindow } = await import('@tauri-apps/api/window')
        await appWindow.startDragging()
      } catch (err) {
        console.warn('Native dragging failed, falling back to CSS:', err)
        startBrowserDrag(e)
      }
    } else {
      startBrowserDrag(e)
    }
  }

  const startBrowserDrag = (e: React.MouseEvent) => {
    if (!windowRef.current) return
    setIsDragging(true)
    const rect = windowRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !windowRef.current || isTauriEnvironment()) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    windowRef.current.style.left = `${newX}px`
    windowRef.current.style.top = `${newY}px`
    windowRef.current.style.right = 'auto'
    windowRef.current.style.bottom = 'auto'
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setAnimationState('idle')
    }
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsChatOpen((prev) => !prev)
    setAnimationState(isChatOpen ? 'idle' : 'listening')
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowMenu(true)
  }

  const handleWakeSleep = () => {
    if (currentState === 'sleeping') {
      setAnimationState('idle')
    } else {
      setAnimationState('sleeping')
    }
    setShowMenu(false)
  }

  const handleCloseApp = async () => {
    if (isTauriEnvironment()) {
      try {
        const { appWindow } = await import('@tauri-apps/api/window')
        await appWindow.close()
      } catch (err) {
        console.error('Failed to close Tauri window:', err)
      }
    } else {
      alert('Tauri app window close command mocked.')
    }
    setShowMenu(false)
  }

  return (
    <div
      ref={windowRef}
      className={`pixie-window ${isDragging ? 'dragging' : ''} ${isChatOpen ? 'chat-open' : 'chat-closed'}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
    >
      <div className="pixie-click-zone" onDoubleClick={handleDoubleClick}>
        <PixieCharacter />
      </div>
      
      <ChatBubble isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Context Menu */}
      {showMenu && (
        <div className="pixie-context-menu" id="pixie-context-menu">
          <button onClick={handleWakeSleep}>
            {currentState === 'sleeping' ? '☀️ Wake Up' : '🌙 Go to Sleep'}
          </button>
          <button onClick={() => { setAnimationState('happy'); setShowMenu(false); }}>
            🎉 Play Dance
          </button>
          {isTauriEnvironment() && (
            <button onClick={handleCloseApp} className="menu-close-btn">
              🚪 Quit Pixie
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default PixieWindow
