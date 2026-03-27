import { TodoComposer } from './TodoComposer'
import { TodoEmptyState } from './TodoEmptyState'

export function TodoAppShell() {
  return (
    <main className="todo-shell">
      <section className="todo-shell__panel" aria-labelledby="todo-shell-title">
        <header className="todo-shell__header">
          <p className="todo-shell__eyebrow">bmad-todo-app</p>
          <h1 className="todo-shell__title" id="todo-shell-title">
            Capture what matters now
          </h1>
          <p className="todo-shell__subtitle">
            A calm, single place to collect the next task without noise or
            guesswork.
          </p>
        </header>

        <div className="todo-shell__body">
          <TodoComposer />
          <TodoEmptyState />
        </div>
      </section>
    </main>
  )
}
