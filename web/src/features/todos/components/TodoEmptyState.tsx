export function TodoEmptyState() {
  return (
    <section className="todo-empty-state" aria-labelledby="todo-empty-title">
      <h2 className="todo-empty-state__title" id="todo-empty-title">
        No tasks yet
      </h2>
      <p className="todo-empty-state__body">
        Start with one clear next step. It will show up here as soon as you add
        it.
      </p>
      <p className="todo-empty-state__note">
        Use the field above to capture your first task.
      </p>
    </section>
  )
}
