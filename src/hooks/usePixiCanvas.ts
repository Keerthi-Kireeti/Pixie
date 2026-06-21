import { useRef, useEffect } from 'react'
import { Application, Graphics } from 'pixi.js'

export function usePixiCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    let cancelled = false

    const initPixi = async () => {
      // Create PixiJS v8 application with async init
      const app = new Application()

      await app.init({
        width: 200,
        height: 250,
        background: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
      })

      if (cancelled) {
        app.destroy(true, { children: true })
        return
      }

      // Append canvas to container
      canvasRef.current?.appendChild(app.canvas as HTMLCanvasElement)
      appRef.current = app

      // Create a simple placeholder sprite using PixiJS v8 Graphics API
      const graphics = new Graphics()
      graphics.rect(50, 50, 100, 100)
      graphics.fill(0xff6b9d)
      graphics.x = 50
      graphics.y = 75
      app.stage.addChild(graphics)
    }

    initPixi().catch((err) => {
      console.error('Failed to initialize PixiJS:', err)
    })

    return () => {
      cancelled = true
      if (appRef.current) {
        appRef.current.destroy(true, { children: true })
        appRef.current = null
      }
    }
  }, [])

  return {
    canvasRef,
    app: appRef.current,
  }
}
