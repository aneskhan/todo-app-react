import { memo, useEffect, useRef, useState } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MAX_TITLE_LENGTH } from '@/hooks/useTodos'
import { formatCreatedAt } from '@/lib/time'

export const TodoItem = memo(function TodoItem({ todo, onToggle, onRemove, onRename }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(todo.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!editing) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [editing])

  const startEditing = () => {
    setDraft(todo.title)
    setEditing(true)
  }

  const commit = () => {
    setEditing(false)
    if (draft.trim() !== todo.title) onRename(todo.id, draft)
  }

  const cancel = () => {
    setEditing(false)
    setDraft(todo.title)
  }

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-muted/50 data-[editing=true]:border-border" data-editing={editing}>
      <Checkbox
        id={`todo-${todo.id}`}
        checked={todo.done}
        onCheckedChange={() => onToggle(todo.id)}
        aria-label={`Задача «${todo.title}»`}
      />

      {editing ? (
        <Input
          ref={inputRef}
          value={draft}
          maxLength={MAX_TITLE_LENGTH}
          aria-label="Изменить задачу"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commit}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commit()
            if (event.key === 'Escape') cancel()
          }}
          className="h-7"
        />
      ) : (
        <div className="min-w-0 flex-1">
          <label
            htmlFor={`todo-${todo.id}`}
            onDoubleClick={startEditing}
            title="Двойной клик — изменить"
            className={cn(
              'block truncate text-sm leading-6',
              todo.done && 'text-muted-foreground line-through',
            )}
          >
            {todo.title}
          </label>
          <p className="text-xs text-muted-foreground">{formatCreatedAt(todo.createdAt)}</p>
        </div>
      )}

      <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
        {!editing && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={startEditing}
            aria-label={`Изменить: ${todo.title}`}
          >
            <PencilIcon />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(todo.id)}
          aria-label={`Удалить: ${todo.title}`}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon />
        </Button>
      </div>
    </li>
  )
})
