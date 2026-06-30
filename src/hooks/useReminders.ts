import { useState, useCallback, useEffect } from 'react'
import {
  listReminders,
  createReminder,
  completeReminder,
  deleteReminder,
  type Reminder,
  type CreateReminderRequest,
} from '@/services/api'

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await listReminders()
      setReminders(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch reminders'
      setError(msg)
      console.error('Reminders fetch error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addReminder = useCallback(async (data: CreateReminderRequest) => {
    try {
      const newReminder = await createReminder(data)
      setReminders((prev) => [...prev, newReminder])
      return newReminder
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create reminder'
      setError(msg)
      throw err
    }
  }, [])

  const markComplete = useCallback(async (id: number) => {
    try {
      await completeReminder(id)
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, is_completed: true } : r))
      )
    } catch (err) {
      console.error('Failed to complete reminder:', err)
    }
  }, [])

  const removeReminder = useCallback(async (id: number) => {
    try {
      await deleteReminder(id)
      setReminders((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error('Failed to delete reminder:', err)
    }
  }, [])

  // Fetch reminders on mount
  useEffect(() => {
    fetchReminders()
  }, [fetchReminders])

  return {
    reminders,
    isLoading,
    error,
    addReminder,
    markComplete,
    removeReminder,
    refreshReminders: fetchReminders,
  }
}
