import { useEffect, useState } from 'react'

import { TodoComposer } from './TodoComposer'
import { TodoEmptyState } from './TodoEmptyState'
import { TodoErrorState } from './TodoErrorState'
import { TodoList } from './TodoList'
import { TodoLoadingState } from './TodoLoadingState'
import { useTodos } from '../hooks/useTodos'

export function TodoAppShell() {
  const [recentlyCreatedTodoId, setRecentlyCreatedTodoId] = useState<string | null>(null)
  const {
    data: todos,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useTodos()

  useEffect(() => {
    if (!recentlyCreatedTodoId) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setRecentlyCreatedTodoId((currentId) =>
        currentId === recentlyCreatedTodoId ? null : currentId,
      )
    }, 3000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [recentlyCreatedTodoId])

  let content = <TodoEmptyState />

  if (isLoading) {
    content = <TodoLoadingState />
  } else if (error) {
    content = (
      <TodoErrorState
        isRetrying={isFetching}
        message={error.message}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  } else if (todos && todos.length > 0) {
    content = <TodoList highlightedTodoId={recentlyCreatedTodoId} todos={todos} />
  }

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
          <TodoComposer onCreated={setRecentlyCreatedTodoId} />
          {content}
        </div>
      </section>
    </main>
  )
}
