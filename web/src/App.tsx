import { QueryProvider } from './app/providers/QueryProvider'
import { TodoAppShell } from './features/todos/components/TodoAppShell'

function App() {
  return (
    <QueryProvider>
      <TodoAppShell />
    </QueryProvider>
  )
}

export default App
