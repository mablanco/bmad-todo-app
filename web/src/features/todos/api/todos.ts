import { apiRequest } from '../../../lib/api-client'
import type { Todo, TodoListResponse } from '../types/todo'

export async function fetchTodos() {
  const response = await apiRequest<TodoListResponse>('/api/v1/todos')

  return response.data.toSorted(
    (left: Todo, right: Todo) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  )
}
