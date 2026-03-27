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
        within(item).getByText(/task$/i).textContent,
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

      listSignal = init?.signal

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

    resolveListRequest?.(
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
});
