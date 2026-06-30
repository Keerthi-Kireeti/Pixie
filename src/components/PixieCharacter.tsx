import { useAnimationState } from '@/hooks/useAnimationState'
import './PixieCharacter.css'

export default function PixieCharacter() {
  const { currentState } = useAnimationState()

  return (
    <div className={`pixie-character pixie-state-${currentState}`} id="pixie-character">
      {/* Wings */}
      <div className="pixie-wings">
        <div className="wing wing-left"></div>
        <div className="wing wing-right"></div>
      </div>

      {/* Body */}
      <div className="pixie-body">
        {/* Head */}
        <div className="pixie-head">
          {/* Eyes */}
          <div className="pixie-eyes">
            <div className="eye eye-left">
              <div className="pupil"></div>
            </div>
            <div className="eye eye-right">
              <div className="pupil"></div>
            </div>
          </div>

          {/* Mouth */}
          <div className="pixie-mouth"></div>

          {/* Blush */}
          <div className="pixie-blush blush-left"></div>
          <div className="pixie-blush blush-right"></div>
        </div>

        {/* Antenna / Crown glow */}
        <div className="pixie-crown">
          <div className="crown-gem"></div>
        </div>
      </div>

      {/* Sparkle particles */}
      <div className="pixie-sparkles">
        <div className="sparkle s1">✦</div>
        <div className="sparkle s2">✧</div>
        <div className="sparkle s3">✦</div>
        <div className="sparkle s4">⋆</div>
        <div className="sparkle s5">✧</div>
        <div className="sparkle s6">✦</div>
      </div>

      {/* State-specific overlays */}
      {currentState === 'thinking' && (
        <div className="thinking-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      )}

      {currentState === 'sleeping' && (
        <div className="sleeping-zzz">
          <span>z</span><span>z</span><span>Z</span>
        </div>
      )}
    </div>
  )
}
