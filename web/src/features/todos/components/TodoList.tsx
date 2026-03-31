import type { Todo } from '../types/todo'
import { TodoListItem } from './TodoListItem'

type TodoListProps = {
  deletingTodoId?: string | null
  highlightedTodoId?: string | null
  onDelete?: (todoId: string) => void
  onToggle?: (todoId: string, completed: boolean) => void
  todos: Todo[]
  updatingTodoId?: string | null
}

export function TodoList({
  deletingTodoId = null,
  highlightedTodoId = null,
  onDelete,
  onToggle,
  todos,
  updatingTodoId = null,
}: TodoListProps) {
  return (
    <section aria-labelledby="todo-list-title" className="todo-list">
      <div className="todo-list__header">
        <h2 className="todo-list__title" id="todo-list-title">
          Your tasks
        </h2>
        <p className="todo-list__meta">
          {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      <ol className="todo-list__items">
        {todos.map((todo) => (
          <li className="todo-list__item" key={todo.id}>
            <TodoListItem
              isDeleting={todo.id === deletingTodoId}
              isHighlighted={todo.id === highlightedTodoId}
              isUpdating={todo.id === updatingTodoId}
              onDelete={onDelete}
              onToggle={onToggle}
              todo={todo}
            />
          </li>
        ))}
      </ol>
    </section>
  )
}
