import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './App';
import { apiRequest } from './lib/api-client';

const fetchMock = vi.fn<typeof fetch>()

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('App', () => {
  it('renders the todo capture shell instead of the Vite starter', () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Capture what matters now' }),
    ).toBeVisible();
    expect(screen.getByLabelText('Task description')).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Get started' })).toBeNull();
    expect(screen.queryByText(/Count is/i)).toBeNull();
  });

  it('allows keyboard-style form submission without losing the shell state', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />);

    const form = screen.getByRole('form', { name: 'Create a task' });
    const input = screen.getByLabelText('Task description');

    fireEvent.change(input, { target: { value: 'Buy milk' } });
    fireEvent.submit(form);

    await screen.findByRole('heading', { name: 'No tasks yet' })

    expect(
      screen.getByRole('heading', { name: 'Capture what matters now' }),
    ).toBeVisible();
    expect(input).toHaveValue('Buy milk');
    expect(screen.getByRole('heading', { name: 'No tasks yet' })).toBeVisible();
  });

  it('renders todos from the API in newest-first order', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'older',
              description: 'Older task',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
            {
              id: 'newer',
              description: 'Newer task',
              completed: false,
              created_at: '2026-03-27T11:00:00Z',
              updated_at: '2026-03-27T11:00:00Z',
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Your tasks' })).toBeVisible()

    const items = screen.getAllByRole('listitem')
    expect(
      items.map((item) =>
        within(item).getByText(/task$/i, { selector: '.todo-card__description' }).textContent,
      ),
    ).toEqual([
      'Newer task',
      'Older task',
    ])
  })

  it('renders the dedicated empty state for an empty API response', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(await screen.findByRole('heading', { name: 'No tasks yet' })).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: 'Your tasks' }),
    ).toBeNull()
  })

  it('renders an error state and retries without a page refresh', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: 'The list is unavailable right now.',
              details: {},
            },
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            data: [
              {
                id: 'retry-task',
                description: 'Recovered task',
                completed: false,
                created_at: '2026-03-27T11:30:00Z',
                updated_at: '2026-03-27T11:30:00Z',
              },
            ],
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: "We couldn't load your tasks" }),
    ).toBeVisible()
    expect(screen.getByText('The list is unavailable right now.')).toBeVisible()

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    expect(await screen.findByText('Recovered task')).toBeVisible()
  })

  it('shows a calm retry message when the list request fails at the network level', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(
      await screen.findByRole('heading', { name: "We couldn't load your tasks" }),
    ).toBeVisible()
    expect(
      screen.getByText("We couldn't reach your task list. Try again."),
    ).toBeVisible()
    expect(screen.queryByText('Failed to fetch')).toBeNull()
  })

  it('returns undefined for 204 responses so shared requests can support delete flows', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(null, {
        status: 204,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest<void>('/api/v1/todos/test-id', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('creates a new todo from the main composer and resets focus for continued capture', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            data: {
              id: 'new-task',
              description: 'Write Story 1.3 tests',
              completed: false,
              created_at: '2026-03-27T12:30:00Z',
              updated_at: '2026-03-27T12:30:00Z',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'Write Story 1.3 tests' } })
    fireEvent.submit(form)

    expect(await screen.findByText('Write Story 1.3 tests')).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(input).toHaveValue('')
    expect(document.activeElement).toBe(input)
    expect(await screen.findByRole('status')).toHaveTextContent('Added: Write Story 1.3 tests')
    expect(screen.getByRole('heading', { name: 'Your tasks' })).toBeVisible()
  })

  it('shows inline validation feedback and blocks blank or oversized submissions', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.submit(form)

    expect(
      await screen.findByText('Description must be between 1 and 500 characters.'),
    ).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    fireEvent.change(input, { target: { value: 'a'.repeat(501) } })
    fireEvent.submit(form)

    expect(
      screen.getByText('Description must be between 1 and 500 characters.'),
    ).toBeVisible()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('preserves the typed value and shows calm feedback when create fails', async () => {
    fetchMock
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ data: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: "We couldn't save your task right now. Try again.",
              details: {},
            },
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'Keep this draft intact' } })
    fireEvent.submit(form)

    expect(
      await screen.findByText("We couldn't save your task right now. Try again."),
    ).toBeVisible()
    expect(input).toHaveValue('Keep this draft intact')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('keeps a newly created todo visible if the initial list request is canceled mid-flight', async () => {
    let resolveListRequest: ((response: Response) => void) | null = null
    let listSignal: AbortSignal | undefined

    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            data: {
              id: 'racing-task',
              description: 'Persist through the race',
              completed: false,
              created_at: '2026-03-27T13:30:00Z',
              updated_at: '2026-03-27T13:30:00Z',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      listSignal = init?.signal ?? undefined

      return await new Promise<Response>((resolve, reject) => {
        resolveListRequest = resolve

        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'Persist through the race' } })
    fireEvent.submit(form)

    expect(await screen.findByText('Persist through the race')).toBeVisible()
    await waitFor(() => {
      expect(listSignal?.aborted).toBe(true)
    })

    expect(resolveListRequest).not.toBeNull()
    resolveListRequest!(
      new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await waitFor(() => {
      expect(screen.getByText('Persist through the race')).toBeVisible()
    })
    expect(screen.getByRole('heading', { name: 'Your tasks' })).toBeVisible()
  })

  it('shows localized pending feedback while a task is being created without collapsing the rest of the shell', async () => {
    let resolveCreateRequest: ((response: Response) => void) | null = null

    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return await new Promise<Response>((resolve) => {
          resolveCreateRequest = resolve
        })
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'existing-task',
              description: 'Already here',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(await screen.findByText('Already here')).toBeVisible()

    const form = screen.getByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')
    const button = screen.getByRole('button', { name: 'Add task' })

    fireEvent.change(input, { target: { value: 'Wait for it' } })
    fireEvent.submit(form)

    expect(await screen.findByRole('status')).toHaveTextContent('Saving to your list...')
    expect(button).toBeDisabled()
    expect(screen.getByText('Already here')).toBeVisible()
    expect(screen.queryByRole('heading', { name: 'No tasks yet' })).toBeNull()

    expect(resolveCreateRequest).not.toBeNull()
    resolveCreateRequest!(
      new Response(
        JSON.stringify({
          data: {
            id: 'pending-task',
            description: 'Wait for it',
            completed: false,
            created_at: '2026-03-27T14:30:00Z',
            updated_at: '2026-03-27T14:30:00Z',
          },
        }),
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    expect(await screen.findByText('Wait for it')).toBeVisible()
  })

  it('marks the newly created task as a believable fresh update instead of relying on noisy confirmation UI', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            data: {
              id: 'fresh-task',
              description: 'Highlight the latest task',
              completed: false,
              created_at: '2026-03-27T15:00:00Z',
              updated_at: '2026-03-27T15:00:00Z',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'Highlight the latest task' } })
    fireEvent.submit(form)

    const newTask = await screen.findByText('Highlight the latest task')
    const article = newTask.closest('.todo-card')

    expect(article).toHaveClass('todo-card--fresh')
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(screen.queryByText(/saved successfully/i)).toBeNull()
  })

  it('clears the fresh-task highlight after a short trust window', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            data: {
              id: 'temporary-highlight',
              description: 'This should settle back down',
              completed: false,
              created_at: '2026-03-27T15:30:00Z',
              updated_at: '2026-03-27T15:30:00Z',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'This should settle back down' } })
    fireEvent.submit(form)

    const newTask = await screen.findByText('This should settle back down')
    const article = newTask.closest('.todo-card')

    expect(article).toHaveClass('todo-card--fresh')

    await waitFor(
      () => {
        expect(article).not.toHaveClass('todo-card--fresh')
      },
      { timeout: 4000 },
    )
  }, 5000)

  it('renders active and completed todos with distinct visual classes and status labels', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'active-item',
              description: 'Still working on this',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
            {
              id: 'completed-item',
              description: 'Already done',
              completed: true,
              created_at: '2026-03-27T08:00:00Z',
              updated_at: '2026-03-27T10:00:00Z',
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const activeItem = await screen.findByText('Still working on this')
    const completedItem = await screen.findByText('Already done')

    const activeCard = activeItem.closest('.todo-card')
    const completedCard = completedItem.closest('.todo-card')

    expect(activeCard).not.toHaveClass('todo-card--completed')
    expect(completedCard).toHaveClass('todo-card--completed')

    expect(within(activeCard as HTMLElement).getByText('Active')).toBeVisible()
    expect(within(completedCard as HTMLElement).getByText('Completed')).toBeVisible()

    expect(within(activeCard as HTMLElement).getByText('○')).toBeVisible()
    expect(within(completedCard as HTMLElement).getByText('✓')).toBeVisible()
  })

  it('preserves fresh-item highlighting through the TodoListItem component', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'POST') {
        return new Response(
          JSON.stringify({
            data: {
              id: 'highlighted-via-item',
              description: 'Fresh through TodoListItem',
              completed: false,
              created_at: '2026-03-27T16:00:00Z',
              updated_at: '2026-03-27T16:00:00Z',
            },
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const form = await screen.findByRole('form', { name: 'Create a task' })
    const input = screen.getByLabelText('Task description')

    fireEvent.change(input, { target: { value: 'Fresh through TodoListItem' } })
    fireEvent.submit(form)

    const newTask = await screen.findByText('Fresh through TodoListItem')
    const article = newTask.closest('.todo-card')

    expect(article).toHaveClass('todo-card--fresh')
    expect(article).not.toHaveClass('todo-card--completed')
  })

  it('toggles an active todo to completed via PATCH and updates the UI', async () => {
    let toggled = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'
      const url = typeof _input === 'string' ? _input : ''

      if (method === 'PATCH' && url.includes('/todos/active-item')) {
        toggled = true
        return new Response(
          JSON.stringify({
            data: {
              id: 'active-item',
              description: 'Toggle me',
              completed: true,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-31T10:00:00Z',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'active-item',
              description: 'Toggle me',
              completed: toggled,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const card = screen.getByText('Toggle me').closest('.todo-card')
      expect(card).toHaveClass('todo-card--completed')
    })
  })

  it('toggles a completed todo back to active via PATCH', async () => {
    let untoggled = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'
      const url = typeof _input === 'string' ? _input : ''

      if (method === 'PATCH' && url.includes('/todos/done-item')) {
        untoggled = true
        return new Response(
          JSON.stringify({
            data: {
              id: 'done-item',
              description: 'Untoggle me',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-31T10:00:00Z',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'done-item',
              description: 'Untoggle me',
              completed: !untoggled,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark active/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const card = screen.getByText('Untoggle me').closest('.todo-card')
      expect(card).not.toHaveClass('todo-card--completed')
    })
  })

  it('rolls back optimistic toggle and shows error when PATCH fails', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'PATCH') {
        return new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: "Couldn't update right now.",
              details: {},
            },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'fail-item',
              description: 'Will fail to toggle',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeVisible()
    })

    const card = screen.getByText('Will fail to toggle').closest('.todo-card')
    expect(card).not.toHaveClass('todo-card--completed')
  })

  it('makes the toggle control keyboard-accessible', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'kb-item',
              description: 'Keyboard test',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    expect(toggleButton).not.toBeDisabled()
    toggleButton.focus()
    expect(document.activeElement).toBe(toggleButton)
  })

  it('deletes a todo and removes it from the list', async () => {
    let deleted = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'DELETE') {
        deleted = true
        return new Response(null, { status: 204 })
      }

      return new Response(
        JSON.stringify({
          data: deleted
            ? []
            : [
                {
                  id: 'del-item',
                  description: 'Remove me',
                  completed: false,
                  created_at: '2026-03-27T09:00:00Z',
                  updated_at: '2026-03-27T09:00:00Z',
                },
              ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText('Remove me')).toBeNull()
    })
  })

  it('transitions to empty state when the last todo is deleted', async () => {
    let deleted = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'DELETE') {
        deleted = true
        return new Response(null, { status: 204 })
      }

      return new Response(
        JSON.stringify({
          data: deleted
            ? []
            : [
                {
                  id: 'last-item',
                  description: 'The only task',
                  completed: false,
                  created_at: '2026-03-27T09:00:00Z',
                  updated_at: '2026-03-27T09:00:00Z',
                },
              ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(await screen.findByRole('heading', { name: 'No tasks yet' })).toBeVisible()
  })

  it('rolls back deletion and shows error when DELETE fails', async () => {
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'DELETE') {
        return new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: "Couldn't delete right now.",
              details: {},
            },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'fail-del',
              description: 'Cannot delete me',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeVisible()
    })

    expect(screen.getByText('Cannot delete me')).toBeVisible()
  })

  it('makes the delete control keyboard-accessible', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'kb-del',
              description: 'Keyboard delete test',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    expect(deleteButton).not.toBeDisabled()
    deleteButton.focus()
    expect(document.activeElement).toBe(deleteButton)
  })

  it('reflects toggled completion state on refetch (simulated reload)', async () => {
    let completed = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'PATCH') {
        completed = true
        return new Response(
          JSON.stringify({
            data: {
              id: 'reload-item',
              description: 'Check after reload',
              completed: true,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-31T12:00:00Z',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'reload-item',
              description: 'Check after reload',
              completed,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const card = screen.getByText('Check after reload').closest('.todo-card')
      expect(card).toHaveClass('todo-card--completed')
    })

    // The onSettled invalidation triggers a refetch — verify the completed state persists
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3) // initial GET + PATCH + refetch GET
    })

    const card = screen.getByText('Check after reload').closest('.todo-card')
    expect(card).toHaveClass('todo-card--completed')
  })

  it('keeps the list visible and shows a local error if refetch fails after a successful toggle', async () => {
    let completed = false

    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'PATCH') {
        completed = true
        return new Response(
          JSON.stringify({
            data: {
              id: 'toggle-refetch-fail',
              description: 'Stay visible after toggle',
              completed: true,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-31T12:00:00Z',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      if (completed) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: 'Could not refresh your list, but your latest change was saved.',
              details: {},
            },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'toggle-refetch-fail',
              description: 'Stay visible after toggle',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const card = screen.getByText('Stay visible after toggle').closest('.todo-card')
      expect(card).toHaveClass('todo-card--completed')
    })

    expect(
      await screen.findByText('Could not refresh your list, but your latest change was saved.'),
    ).toBeVisible()
    expect(screen.getByText('Stay visible after toggle')).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: "We couldn't load your tasks" }),
    ).toBeNull()
  })

  it('reflects deleted item absence on refetch (simulated reload)', async () => {
    let deleted = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'DELETE') {
        deleted = true
        return new Response(null, { status: 204 })
      }

      return new Response(
        JSON.stringify({
          data: deleted
            ? []
            : [
                {
                  id: 'gone-item',
                  description: 'Gone after reload',
                  completed: false,
                  created_at: '2026-03-27T09:00:00Z',
                  updated_at: '2026-03-27T09:00:00Z',
                },
              ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButton = await screen.findByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.queryByText('Gone after reload')).toBeNull()
    })

    // The onSettled invalidation triggers a refetch — verify the item stays gone
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(3)
    })

    expect(screen.queryByText('Gone after reload')).toBeNull()
  })

  it('keeps the remaining list visible and shows a local error if refetch fails after delete', async () => {
    let deleted = false

    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'DELETE') {
        deleted = true
        return new Response(null, { status: 204 })
      }

      if (deleted) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'SERVER_ERROR',
              message: 'Could not refresh your list, but your latest change was saved.',
              details: {},
            },
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'delete-refetch-fail',
              description: 'Remove me first',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
            {
              id: 'survivor',
              description: 'Stay visible after delete',
              completed: false,
              created_at: '2026-03-27T10:00:00Z',
              updated_at: '2026-03-27T10:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    const deleteButtons = await screen.findAllByRole('button', { name: /delete/i })
    fireEvent.click(deleteButtons[1])

    await waitFor(() => {
      expect(screen.queryByText('Remove me first')).toBeNull()
    })

    expect(
      await screen.findByText('Could not refresh your list, but your latest change was saved.'),
    ).toBeVisible()
    expect(screen.getByText('Stay visible after delete')).toBeVisible()
    expect(
      screen.queryByRole('heading', { name: "We couldn't load your tasks" }),
    ).toBeNull()
  })

  it('maintains consistency after sequential toggle mutations', async () => {
    let completed = false
    fetchMock.mockImplementation(async (_input, init) => {
      const method = init?.method ?? 'GET'

      if (method === 'PATCH') {
        completed = !completed
        return new Response(
          JSON.stringify({
            data: {
              id: 'seq-item',
              description: 'Toggle twice',
              completed,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-31T12:00:00Z',
            },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        )
      }

      return new Response(
        JSON.stringify({
          data: [
            {
              id: 'seq-item',
              description: 'Toggle twice',
              completed,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    // First toggle: active → completed
    const toggleButton = await screen.findByRole('button', { name: /mark complete/i })
    fireEvent.click(toggleButton)

    await waitFor(() => {
      const card = screen.getByText('Toggle twice').closest('.todo-card')
      expect(card).toHaveClass('todo-card--completed')
    })

    // Second toggle: completed → active
    const toggleBack = await screen.findByRole('button', { name: /mark active/i })
    fireEvent.click(toggleBack)

    await waitFor(() => {
      const card = screen.getByText('Toggle twice').closest('.todo-card')
      expect(card).not.toHaveClass('todo-card--completed')
    })
  })

  it('makes all interactive elements keyboard-focusable', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'a11y-item',
              description: 'Accessibility test',
              completed: false,
              created_at: '2026-03-27T09:00:00Z',
              updated_at: '2026-03-27T09:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    await screen.findByRole('heading', { name: 'Your tasks' })

    const input = screen.getByLabelText('Task description')
    const addButton = screen.getByRole('button', { name: 'Add task' })
    const toggleButton = screen.getByRole('button', { name: /mark complete/i })
    const deleteButton = screen.getByRole('button', { name: /delete/i })

    for (const el of [input, addButton, toggleButton, deleteButton]) {
      el.focus()
      expect(document.activeElement).toBe(el)
    }
  })

  it('shows description and timestamp for each todo item', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              id: 'detail-item',
              description: 'Check item details',
              completed: false,
              created_at: '2026-03-27T14:30:00Z',
              updated_at: '2026-03-27T14:30:00Z',
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)

    expect(await screen.findByText('Check item details')).toBeVisible()
    expect(screen.getByText(/Added.*Mar.*2026/)).toBeVisible()
  })
});
