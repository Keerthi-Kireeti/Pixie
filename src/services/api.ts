/**
 * Pixie API Client
 * 
 * Centralized HTTP client for communicating with the FastAPI backend.
 * Works in both browser dev mode and inside the Tauri shell.
 */

const API_BASE = 'http://localhost:8000';

/** Detect if running inside Tauri desktop shell */
export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

/** Generic fetch wrapper with error handling */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Chat API ────────────────────────────────────────────────

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  thinking_time: number;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function resetChat(): Promise<{ status: string }> {
  return apiRequest('/api/chat/reset', { method: 'POST' });
}

// ─── Reminders API ───────────────────────────────────────────

export interface Reminder {
  id: number;
  title: string;
  description?: string;
  scheduled_time: string;
  created_at: string;
  is_completed: boolean;
}

export interface CreateReminderRequest {
  title: string;
  description?: string;
  scheduled_time: string;
}

export async function listReminders(): Promise<Reminder[]> {
  return apiRequest<Reminder[]>('/api/reminders');
}

export async function createReminder(data: CreateReminderRequest): Promise<Reminder> {
  return apiRequest<Reminder>('/api/reminders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function completeReminder(id: number): Promise<{ status: string }> {
  return apiRequest(`/api/reminders/${id}?is_completed=true`, { method: 'PUT' });
}

export async function deleteReminder(id: number): Promise<{ status: string }> {
  return apiRequest(`/api/reminders/${id}`, { method: 'DELETE' });
}

// ─── Health API ──────────────────────────────────────────────

export interface HealthStatus {
  status: string;
  backend: boolean;
  ollama: boolean;
  database: boolean;
}

export async function checkHealth(): Promise<HealthStatus> {
  return apiRequest<HealthStatus>('/api/health');
}

// ─── Memory API ──────────────────────────────────────────────

export async function getConversationHistory(
  conversationId: number,
  limit: number = 20
): Promise<{ conversation_id: number; messages: Array<{ role: string; content: string; timestamp: string }>; count: number }> {
  return apiRequest(`/api/memory/history?conversation_id=${conversationId}&limit=${limit}`);
}
