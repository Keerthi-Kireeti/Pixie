export interface Reminder {
  id?: number
  title: string
  description?: string
  time: string
  completed?: boolean
}

// Helper to safely invoke Tauri commands, with fallback for browser-only dev mode
async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    const { invoke } = await import('@tauri-apps/api/tauri')
    return await invoke<T>(command, args)
  } catch {
    console.warn(`[Pixie] Tauri not available. Command "${command}" mocked.`)
    throw new Error('Tauri runtime not available — reminders require the desktop app')
  }
}

export function useReminders() {
  const createReminder = async (reminder: Reminder) => {
    try {
      const response = await tauriInvoke('pixie_reminder', {
        title: reminder.title,
        time: reminder.time,
        description: reminder.description,
      })
      return response
    } catch (error) {
      console.error('Failed to create reminder:', error)
      throw error
    }
  }

  return {
    createReminder,
  }
}
