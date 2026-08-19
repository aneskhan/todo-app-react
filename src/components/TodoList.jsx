import { CheckCheckIcon, InboxIcon, ListTodoIcon } from 'lucide-react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { TodoItem } from '@/components/TodoItem'

const EMPTY_STATES = {
  all: {
    icon: InboxIcon,
    title: 'Пока пусто',
    description: 'Добавьте первую задачу — она сохранится в браузере.',
  },
  active: {
    icon: CheckCheckIcon,
    title: 'Всё сделано',
    description: 'Активных задач не осталось. Отличная работа!',
  },
  done: {
    icon: ListTodoIcon,
    title: 'Нет выполненных',
    description: 'Отметьте задачу галочкой, и она появится здесь.',
  },
}

function TodoEmpty({ filter }) {
  const { icon: Icon, title, description } = EMPTY_STATES[filter] ?? EMPTY_STATES.all
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export function TodoList({ todos, filter, onToggle, onRemove, onRename }) {
  if (todos.length === 0) return <TodoEmpty filter={filter} />

  return (
    <ul className="flex flex-col">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          onRename={onRename}
        />
      ))}
    </ul>
  )
}
