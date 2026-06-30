import { useEffect, useState } from 'react'
import { AnimationStateProvider } from '@/hooks/useAnimationState'
import PixieWindow from '@components/PixieWindow'
import { checkHealth, type HealthStatus } from '@/services/api'
import './App.css'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [connectionError, setConnectionError] = useState(false)

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check backend health directly via HTTP
        const status = await checkHealth()
        setHealth(status)
        console.log('Pixie backend status:', status)
      } catch (err) {
        console.warn('Backend not reachable:', err)
        setConnectionError(true)
      } finally {
        setIsReady(true)
      }
    }

    initApp()
  }, [])

  if (!isReady) {
    return (
      <div className="loading-screen" id="pixie-loading">
        <div className="loading-pixie">
          <div className="loading-glow"></div>
          <span className="loading-emoji">✨</span>
        </div>
        <p className="loading-text">Waking up Pixie...</p>
      </div>
    )
  }

  return (
    <AnimationStateProvider>
      <div className="app-container" id="pixie-app">
        {connectionError && (
          <div className="status-banner status-error" id="pixie-status-banner">
            Backend not connected — start the server with: python -m uvicorn backend.main:app --reload
          </div>
        )}
        {health && !health.ollama && !connectionError && (
          <div className="status-banner status-warning" id="pixie-ollama-warning">
            Ollama not running — AI chat won't work
          </div>
        )}
        <PixieWindow />
      </div>
    </AnimationStateProvider>
  )
}

export default App
