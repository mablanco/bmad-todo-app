import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'

import { useCreateTodo } from '../hooks/useCreateTodo'

const DESCRIPTION_LIMIT = 500

function validateDescription(description: string) {
  const trimmed = description.trim()

  if (!trimmed || trimmed.length > DESCRIPTION_LIMIT) {
    return 'Description must be between 1 and 500 characters.'
  }

  return null
}

export function TodoComposer() {
  const [description, setDescription] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const feedbackId = useId()
  const {
    error,
    isPending,
    isSuccess,
    mutateAsync,
    reset,
  } = useCreateTodo()

  const feedbackMessage = validationMessage ?? error?.message ?? null

  useEffect(() => {
    if (isSuccess) {
      inputRef.current?.focus()
    }
  }, [isSuccess])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setDescription(event.target.value)

    if (validationMessage) {
      setValidationMessage(null)
    }

    if (error) {
      reset()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (error) {
      reset()
    }

    const nextValidationMessage = validateDescription(description)

    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage)
      return
    }

    setValidationMessage(null)

    try {
      await mutateAsync({ description: description.trim() })
      setDescription('')
    } catch {
      // Mutation state exposes the product-safe error message inline.
    }
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
          aria-describedby={feedbackMessage ? feedbackId : undefined}
          aria-invalid={feedbackMessage ? 'true' : 'false'}
          autoComplete="off"
          disabled={isPending}
          id="todo-description"
          name="description"
          onChange={handleChange}
          ref={inputRef}
          value={description}
          type="text"
          placeholder="Write down the next thing you want to remember."
        />

        <button className="todo-composer__button" disabled={isPending} type="submit">
          {isPending ? 'Adding task...' : 'Add task'}
        </button>
      </div>

      {feedbackMessage ? (
        <p className="todo-composer__feedback" id={feedbackId} role="alert">
          {feedbackMessage}
        </p>
      ) : null}

      <p className="todo-composer__hint">
        Keep it short and clear. Tasks can be up to 500 characters.
      </p>
    </form>
  )
}
