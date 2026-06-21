import { createContext, useContext, useState, ReactNode } from 'react'

export type AnimationState = 'idle' | 'thinking' | 'happy' | 'listening' | 'sleeping' | 'walking'

interface AnimationContextType {
  currentState: AnimationState
  setAnimationState: (state: AnimationState) => void
  isThinking: boolean
  setIsThinking: (value: boolean) => void
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined)

export function AnimationStateProvider({ children }: { children: ReactNode }) {
  const [currentState, setCurrentState] = useState<AnimationState>('idle')
  const [isThinking, setIsThinking] = useState(false)

  return (
    <AnimationContext.Provider
      value={{
        currentState,
        setAnimationState: setCurrentState,
        isThinking,
        setIsThinking,
      }}
    >
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimationState() {
  const context = useContext(AnimationContext)
  if (!context) {
    throw new Error('useAnimationState must be used within AnimationStateProvider')
  }
  return context
}
