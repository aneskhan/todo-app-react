import { useCallback, useMemo } from 'react'
import { CheckCheckIcon } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTodos } from '@/hooks/useTodos'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FILTERS } from '@/lib/filters'
import { TodoInput } from '@/components/TodoInput'
import { TodoList } from '@/components/TodoList'
import { ThemeToggle } from '@/components/ThemeToggle'

export function TodoApp() {
  const { todos, setTodos, add, toggle, remove, rename, clearCompleted, toggleAll, stats } =
    useTodos()
  const [filter, setFilter] = useLocalStorage('todo.filter', 'all')

  const visibleTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((todo) => !todo.done)
    if (filter === 'done') return todos.filter((todo) => todo.done)
    return todos
  }, [filter, todos])

  // Любое разрушительное действие можно откатить из тоста.
  const withUndo = useCallback(
    (message, action) => {
      const snapshot = todos
      action()
      toast(message, {
        action: { label: 'Вернуть', onClick: () => setTodos(snapshot) },
      })
    },
    [setTodos, todos],
  )

  const handleRemove = useCallback(
    (id) => withUndo('Задача удалена', () => remove(id)),
    [remove, withUndo],
  )

  const handleClearCompleted = useCallback(
    () => withUndo(`Выполненные удалены: ${stats.done}`, clearCompleted),
    [clearCompleted, stats.done, withUndo],
  )

  const counts = { all: stats.total, active: stats.active, done: stats.done }
  const percent = Math.round(stats.progress * 100)

  return (
    <Card className="w-full max-w-lg gap-4">
      <CardHeader>
        <CardTitle>Список задач</CardTitle>
        <CardDescription>
          {stats.total === 0
            ? 'Всё чисто — можно начинать'
            : `Выполнено ${stats.done} из ${stats.total}`}
        </CardDescription>
        <CardAction>
          <ThemeToggle />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {stats.total > 0 && (
          <div className="flex items-center gap-3">
            {/* Progress из shadcn не пробрасывает value в Radix Root — задаём ARIA сами. */}
            <Progress
              value={percent}
              aria-label="Прогресс выполнения"
              aria-valuenow={percent}
              aria-valuetext={`${percent}%`}
            />
            <span className="text-xs tabular-nums text-muted-foreground">{percent}%</span>
          </div>
        )}

        <TodoInput onAdd={add} />

        {stats.total > 0 && (
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="w-full">
              {FILTERS.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.label}
                  <Badge variant="secondary" className="tabular-nums">
                    {counts[item.id]}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="max-h-[50vh] overflow-y-auto overscroll-contain">
          <TodoList
            todos={visibleTodos}
            filter={filter}
            onToggle={toggle}
            onRemove={handleRemove}
            onRename={rename}
          />
        </div>
      </CardContent>

      {stats.total > 0 && (
        <>
          <Separator />
          <CardFooter className="justify-between gap-2 text-sm text-muted-foreground">
            <span className="tabular-nums">Осталось: {stats.active}</span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={toggleAll}>
                <CheckCheckIcon />
                {stats.active === 0 ? 'Снять отметки' : 'Отметить все'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCompleted}
                disabled={stats.done === 0}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                Очистить выполненные
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
