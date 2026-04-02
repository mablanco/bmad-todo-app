import { memo } from 'react'
import type { Todo } from '../types/todo'

type TodoListItemProps = {
  isDeleting?: boolean
  isHighlighted?: boolean
  isUpdating?: boolean
  onDelete?: (todoId: string) => void
  onToggle?: (todoId: string, completed: boolean) => void
  todo: Todo
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export const TodoListItem = memo(function TodoListItem({
  isDeleting = false,
  isHighlighted = false,
  isUpdating = false,
  onDelete,
  onToggle,
  todo,
}: TodoListItemProps) {
  const statusLabel = todo.completed ? 'Completed' : 'Active'
  const toggleLabel = todo.completed ? 'Mark active' : 'Mark complete'
  const isBusy = isUpdating || isDeleting

  const cardClasses = [
    'todo-card',
    todo.completed && 'todo-card--completed',
    isHighlighted && 'todo-card--fresh',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={cardClasses} aria-label={`${todo.description} — ${statusLabel}`}>
      <div className="todo-card__actions">
        <button
          className="todo-card__toggle"
          disabled={isBusy}
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
        <button
          className="todo-card__delete"
          disabled={isBusy}
          onClick={() => onDelete?.(todo.id)}
          type="button"
        >
          <span aria-hidden="true">×</span>
          Delete
        </button>
      </div>
      <p className="todo-card__description">{todo.description}</p>
      <p className="todo-card__timestamp">Added {formatCreatedAt(todo.created_at)}</p>
    </article>
  )
})
