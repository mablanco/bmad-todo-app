import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTodo, sortTodos } from '../api/todos'
import type { CreateTodoInput, Todo } from '../types/todo'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTodoInput) => createTodo(input),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
    },
    onSuccess: (createdTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (currentTodos = []) =>
        sortTodos([
          createdTodo,
          ...currentTodos.filter((todo) => todo.id !== createdTodo.id),
        ]),
      )
    },
  })
}
