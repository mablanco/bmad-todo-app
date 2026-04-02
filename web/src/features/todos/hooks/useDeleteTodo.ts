import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTodo } from '../api/todos'
import type { Todo } from '../types/todo'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (todoId: string) => deleteTodo(todoId),
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (currentTodos = []) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      )

      return { previousTodos }
    },
    onError: (_error, _todoId, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
    },
  })
}
