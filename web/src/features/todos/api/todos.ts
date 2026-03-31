import { apiRequest } from '../../../lib/api-client'
import { ApiError } from '../../../lib/errors'
import type {
  CreateTodoInput,
  Todo,
  TodoListResponse,
  TodoResponse,
  UpdateTodoInput,
} from '../types/todo'

export function sortTodos(todos: Todo[]) {
  return todos.toSorted(
    (left: Todo, right: Todo) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  )
}

export async function fetchTodos(signal?: AbortSignal) {
  const response = await apiRequest<TodoListResponse>('/api/v1/todos', { signal })

  return sortTodos(response.data)
}

export async function updateTodo(todoId: string, input: UpdateTodoInput): Promise<Todo> {
  try {
    const response = await apiRequest<TodoResponse>(`/api/v1/todos/${todoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
      throw new ApiError('NETWORK_ERROR', "Couldn't update. Check your connection and try again.")
    }
    throw error
  }
}

export async function createTodo(input: CreateTodoInput) {
  try {
    const response = await apiRequest<TodoResponse>('/api/v1/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    return response.data
  } catch (error) {
    if (error instanceof ApiError && error.code === 'NETWORK_ERROR') {
      throw new ApiError(
        'NETWORK_ERROR',
        "We couldn't save your task right now. Try again.",
      )
    }

    throw error
  }
}
