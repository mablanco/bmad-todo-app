import type { Todo } from '../types/todo'

type TodoListItemProps = {
  isHighlighted?: boolean
  isUpdating?: boolean
  onToggle?: (todoId: string, completed: boolean) => void
  todo: Todo
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TodoListItem({
  isHighlighted = false,
  isUpdating = false,
  onToggle,
  todo,
}: TodoListItemProps) {
  const statusLabel = todo.completed ? 'Completed' : 'Active'
  const toggleLabel = todo.completed ? 'Mark active' : 'Mark complete'

  const cardClasses = [
    'todo-card',
    todo.completed && 'todo-card--completed',
    isHighlighted && 'todo-card--fresh',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClasses} aria-label={`${todo.description} — ${statusLabel}`}>
      <button
        className="todo-card__toggle"
        disabled={isUpdating}
        onClick={() => onToggle?.(todo.id, !todo.completed)}
        title={toggleLabel}
        type="button"
      >
        <span className="todo-card__status-icon" aria-hidden="true">
          {todo.completed ? '✓' : '○'}
        </span>
        <span className="todo-card__status-label">{statusLabel}</span>
        <span className="sr-only">{toggleLabel}</span>
      </button>
      <p className="todo-card__description">{todo.description}</p>
      <p className="todo-card__timestamp">Added {formatCreatedAt(todo.created_at)}</p>
    </article>
  )
}
