import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateTodo } from '../api/todos'
import type { Todo, UpdateTodoInput } from '../types/todo'

type UpdateTodoVariables = {
  todoId: string
  data: UpdateTodoInput
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ todoId, data }: UpdateTodoVariables) => updateTodo(todoId, data),
    onMutate: async ({ todoId, data }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (currentTodos = []) =>
        currentTodos.map((todo) =>
          todo.id === todoId ? { ...todo, ...data } : todo,
        ),
      )

      return { previousTodos }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(['todos'], (currentTodos = []) =>
        currentTodos.map((todo) =>
          todo.id === updatedTodo.id ? updatedTodo : todo,
        ),
      )
    },
  })
}
