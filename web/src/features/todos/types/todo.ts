export type Todo = {
  id: string
  description: string
  completed: boolean
  created_at: string
  updated_at: string
}

export type TodoListResponse = {
  data: Todo[]
}

export type TodoResponse = {
  data: Todo
}

export type CreateTodoInput = {
  description: string
}

export type UpdateTodoInput = {
  description?: string
  completed?: boolean
}
