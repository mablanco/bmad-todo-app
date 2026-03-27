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

type TodoComposerProps = {
  onCreated?: (todoId: string) => void
}

export function TodoComposer({ onCreated }: TodoComposerProps) {
  const [description, setDescription] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const feedbackId = useId()
  const {
    data,
    error,
    isPending,
    isSuccess,
    mutateAsync,
    reset,
  } = useCreateTodo()

  const isFieldInvalid = Boolean(validationMessage ?? error?.message)

  let feedbackMessage: string | null = null
  let feedbackRole: 'alert' | 'status' | undefined

  if (validationMessage) {
    feedbackMessage = validationMessage
    feedbackRole = 'alert'
  } else if (error) {
    feedbackMessage = error.message
    feedbackRole = 'alert'
  } else if (isPending) {
    feedbackMessage = 'Saving to your list...'
    feedbackRole = 'status'
  } else if (isSuccess && data) {
    feedbackMessage = `Added: ${data.description}`
    feedbackRole = 'status'
  }

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

    if (error || isSuccess) {
      reset()
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (error || isSuccess) {
      reset()
    }

    const nextValidationMessage = validateDescription(description)

    if (nextValidationMessage) {
      setValidationMessage(nextValidationMessage)
      return
    }

    setValidationMessage(null)

    try {
      const createdTodo = await mutateAsync({ description: description.trim() })
      setDescription('')
      onCreated?.(createdTodo.id)
    } catch {
      // Mutation state exposes the product-safe error message inline.
    }
  }

  return (
    <form
      aria-busy={isPending}
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
          aria-invalid={isFieldInvalid ? 'true' : 'false'}
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

      {feedbackMessage && feedbackRole ? (
        <p
          aria-live={feedbackRole === 'status' ? 'polite' : 'assertive'}
          className={`todo-composer__feedback todo-composer__feedback--${feedbackRole}`}
          id={feedbackId}
          role={feedbackRole}
        >
          {feedbackMessage}
        </p>
      ) : null}

      <p className="todo-composer__hint">
        Keep it short and clear. Tasks can be up to 500 characters.
      </p>
    </form>
  )
}
