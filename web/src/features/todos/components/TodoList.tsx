import type { Todo } from '../types/todo'

type TodoListProps = {
  highlightedTodoId?: string | null
  todos: Todo[]
}

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function TodoList({ highlightedTodoId = null, todos }: TodoListProps) {
  return (
    <section aria-labelledby="todo-list-title" className="todo-list">
      <div className="todo-list__header">
        <h2 className="todo-list__title" id="todo-list-title">
          Your tasks
        </h2>
        <p className="todo-list__meta">{todos.length} loaded from the API</p>
      </div>

      <ol className="todo-list__items">
        {todos.map((todo) => (
          <li className="todo-list__item" key={todo.id}>
            <article
              className={`todo-card${todo.id === highlightedTodoId ? ' todo-card--fresh' : ''}`}
            >
              <div className="todo-card__status" aria-hidden="true">
                {todo.completed ? 'Completed' : 'Active'}
              </div>
              <p className="todo-card__description">{todo.description}</p>
              <p className="todo-card__timestamp">
                Added {formatCreatedAt(todo.created_at)}
              </p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
