import { useEffect, useState } from 'react'

/**
 * Состояние, зеркалируемое в localStorage.
 * `initialValue` может быть функцией — тогда она вызывается лениво, только при первом запуске.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const fallback = () => (typeof initialValue === 'function' ? initialValue() : initialValue)
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback() : JSON.parse(raw)
    } catch {
      // Битый JSON или заблокированное хранилище — не роняем приложение.
      return fallback()
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Приватный режим или переполненная квота — просто работаем без сохранения.
    }
  }, [key, value])

  // Синхронизация между вкладками.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key || event.newValue === null) return
      try {
        setValue(JSON.parse(event.newValue))
      } catch {
        /* игнорируем чужой мусор */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  return [value, setValue]
}
