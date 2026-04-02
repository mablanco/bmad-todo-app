export function TodoLoadingState() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      aria-labelledby="todo-loading-title"
      className="todo-status-card"
    >
      <h2 className="todo-status-card__title" id="todo-loading-title">
        Loading your tasks
      </h2>
      <p className="todo-status-card__body">
        Pulling the latest list from the server so the screen stays trustworthy.
      </p>
      <div className="todo-loading-state" aria-hidden="true">
        <span className="todo-loading-state__bar" />
        <span className="todo-loading-state__bar todo-loading-state__bar--short" />
        <span className="todo-loading-state__bar" />
      </div>
    </section>
  )
}
