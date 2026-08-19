import { useCallback, useEffect, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const STORAGE_KEY = 'todo.items'
const LEGACY_KEY = 'todos'

export const MAX_TITLE_LENGTH = 200

const createId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

function normalize(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => ({
      id: String(item.id ?? createId()),
      // `text` / `isComplete` — формат первой версии приложения.
      title: String(item.title ?? item.text ?? '').slice(0, MAX_TITLE_LENGTH),
      done: Boolean(item.done ?? item.isComplete),
      createdAt: Number(item.createdAt) || Number(item.id) || Date.now(),
    }))
    .filter((item) => item.title.trim() !== '')
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEY, () => {
    try {
      return normalize(JSON.parse(window.localStorage.getItem(LEGACY_KEY) ?? '[]'))
    } catch {
      return []
    }
  })

  // Старый ключ больше не нужен: данные перенесены в `todo.items`.
  useEffect(() => {
    try {
      window.localStorage.removeItem(LEGACY_KEY)
    } catch {
      /* хранилище недоступно */
    }
  }, [])

  const add = useCallback(
    (title) => {
      const value = title.trim().slice(0, MAX_TITLE_LENGTH)
      if (!value) return false
      setTodos((prev) => [
        { id: createId(), title: value, done: false, createdAt: Date.now() },
        ...prev,
      ])
      return true
    },
    [setTodos],
  )

  const toggle = useCallback(
    (id) => setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [setTodos],
  )

  const remove = useCallback(
    (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [setTodos],
  )

  const rename = useCallback(
    (id, title) => {
      const value = title.trim().slice(0, MAX_TITLE_LENGTH)
      if (!value) return remove(id)
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title: value } : t)))
    },
    [remove, setTodos],
  )

  const clearCompleted = useCallback(
    () => setTodos((prev) => prev.filter((t) => !t.done)),
    [setTodos],
  )

  const toggleAll = useCallback(
    () =>
      setTodos((prev) => {
        const allDone = prev.every((t) => t.done)
        return prev.map((t) => ({ ...t, done: !allDone }))
      }),
    [setTodos],
  )

  const stats = useMemo(() => {
    const total = todos.length
    const done = todos.filter((t) => t.done).length
    return { total, done, active: total - done, progress: total ? done / total : 0 }
  }, [todos])

  return { todos, setTodos, add, toggle, remove, rename, clearCompleted, toggleAll, stats }
}
