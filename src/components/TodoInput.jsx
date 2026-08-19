import { useEffect, useRef, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { MAX_TITLE_LENGTH } from '@/hooks/useTodos'

export function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  // «/» и Ctrl/⌘ + K переводят фокус в поле ввода.
  useEffect(() => {
    const onKeyDown = (event) => {
      const isShortcut =
        event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')
      if (!isShortcut) return
      const active = document.activeElement
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (onAdd(value)) setValue('')
  }

  const isEmpty = value.trim() === ''

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupInput
          id="new-todo"
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          maxLength={MAX_TITLE_LENGTH}
          autoComplete="off"
          enterKeyHint="done"
          aria-label="Новая задача"
          placeholder="Что нужно сделать?"
        />
        <InputGroupAddon align="inline-end">
          {isEmpty && <Kbd className="hidden sm:inline-flex">/</Kbd>}
          <Button type="submit" size="sm" disabled={isEmpty}>
            <PlusIcon />
            <span className="hidden sm:inline">Добавить</span>
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
