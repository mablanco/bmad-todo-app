type TodoErrorStateProps = {
  message: string
  onRetry: () => void
  isRetrying?: boolean
}

export function TodoErrorState({
  message,
  onRetry,
  isRetrying = false,
}: TodoErrorStateProps) {
  return (
    <section
      aria-live="assertive"
      aria-labelledby="todo-error-title"
      className="todo-status-card todo-status-card--error"
    >
      <h2 className="todo-status-card__title" id="todo-error-title">
        We couldn&apos;t load your tasks
      </h2>
      <p className="todo-status-card__body">{message}</p>
      <button
        className="todo-status-card__button"
        onClick={onRetry}
        type="button"
      >
        {isRetrying ? 'Retrying…' : 'Try again'}
      </button>
    </section>
  )
}
