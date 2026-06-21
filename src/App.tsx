import { useEffect, useState } from 'react'
import { AnimationStateProvider } from '@/hooks/useAnimationState'
import PixieWindow from '@components/PixieWindow'
import './App.css'

function App() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Tauri and check backend connection
    const initApp = async () => {
      try {
        const { invoke } = await import('@tauri-apps/api/tauri')
        const status = await invoke('pixie_status')
        console.log('Pixie status:', status)
        setIsReady(true)
      } catch (err) {
        console.warn('Tauri not available or backend not running:', err)
        setError('Running in browser dev mode — Tauri/backend not connected.')
        // Still allow app to load for frontend development
        setIsReady(true)
      }
    }

    initApp()
  }, [])

  if (!isReady) {
    return (
      <div className="error-screen">
        <h1>⏳ Loading Pixie...</h1>
      </div>
    )
  }

  return (
    <AnimationStateProvider>
      <div className="app-container">
        {error && (
          <div className="dev-mode-banner">
            ⚠️ {error}
          </div>
        )}
        <PixieWindow />
      </div>
    </AnimationStateProvider>
  )
}

export default App
