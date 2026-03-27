import type { FormEvent } from 'react'

export function TodoComposer() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form
      className="todo-composer"
      aria-label="Create a task"
      onSubmit={handleSubmit}
    >
      <label className="todo-composer__label" htmlFor="todo-description">
        Task description
      </label>

      <div className="todo-composer__controls">
        <input
          className="todo-composer__input"
          id="todo-description"
          name="description"
          type="text"
          placeholder="Write down the next thing you want to remember."
        />

        <button className="todo-composer__button" type="submit">
          Add task
        </button>
      </div>

      <p className="todo-composer__hint">
        Capture comes first. Saving and live validation land in the next story.
      </p>
    </form>
  )
}
