import { useEffect, useState } from 'react'

import { TodoComposer } from './TodoComposer'
import { TodoEmptyState } from './TodoEmptyState'
import { TodoErrorState } from './TodoErrorState'
import { TodoList } from './TodoList'
import { TodoLoadingState } from './TodoLoadingState'
import { useTodos } from '../hooks/useTodos'
import { useDeleteTodo } from '../hooks/useDeleteTodo'
import { useUpdateTodo } from '../hooks/useUpdateTodo'

export function TodoAppShell() {
  const [recentlyCreatedTodoId, setRecentlyCreatedTodoId] = useState<string | null>(null)
  const {
    data: todos,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useTodos()
  const updateTodo = useUpdateTodo()
  const removeTodo = useDeleteTodo()
  const todoItems = todos ?? []
  const hasTodos = todoItems.length > 0
  const showBlockingError = Boolean(error && !hasTodos)
  const blockingErrorMessage = showBlockingError
    ? (error?.message ?? "Something went wrong. Try again.")
    : null

  const handleToggle = (todoId: string, completed: boolean) => {
    updateTodo.mutate({ todoId, data: { completed } })
  }

  const handleDelete = (todoId: string) => {
    removeTodo.mutate(todoId)
  }

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
  } else if (showBlockingError) {
    content = (
      <TodoErrorState
        isRetrying={isFetching}
        message={blockingErrorMessage ?? "Something went wrong. Try again."}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  } else if (hasTodos) {
    content = (
      <TodoList
        deletingTodoId={removeTodo.isPending ? (removeTodo.variables ?? null) : null}
        highlightedTodoId={recentlyCreatedTodoId}
        onDelete={handleDelete}
        onToggle={handleToggle}
        todos={todoItems}
        updatingTodoId={updateTodo.isPending ? (updateTodo.variables?.todoId ?? null) : null}
      />
    )
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
          {error && hasTodos && (
            <p className="todo-shell__update-error" role="alert">
              {error.message}
            </p>
          )}
          {(updateTodo.error || removeTodo.error) && (
            <p className="todo-shell__update-error" role="alert">
              {(updateTodo.error ?? removeTodo.error)?.message || "Something went wrong. Try again."}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
