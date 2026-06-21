import { usePixiCanvas } from '@/hooks/usePixiCanvas'
import { useAnimationState } from '@/hooks/useAnimationState'
import './PixieCharacter.css'

export default function PixieCharacter() {
  const { canvasRef } = usePixiCanvas()
  const { currentState } = useAnimationState()

  return (
    <div className="pixie-character-container">
      <div className={`pixie-canvas state-${currentState}`} ref={canvasRef} />
      <div className="pixie-state-indicator">{currentState}</div>
    </div>
  )
}
