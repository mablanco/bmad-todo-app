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
