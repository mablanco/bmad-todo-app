import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '../api-client'
import { ApiError } from '../errors'

const fetchMock = vi.fn<typeof fetch>()

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('apiRequest', () => {
  it('returns parsed JSON for successful responses', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<{ data: string }>('/test')
    expect(result).toEqual({ data: 'ok' })
  })

  it('returns undefined for 204 No Content', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest<void>('/test', { method: 'DELETE' })
    expect(result).toBeUndefined()
  })

  it('throws ApiError with safe message for server errors', async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ error: { code: 'SERVER_ERROR', message: 'raw', details: {} } }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)

    try {
      await apiRequest('/test')
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).code).toBe('SERVER_ERROR')
    }
  })

  it('throws network error for fetch failures', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('/test')).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('rethrows AbortError without wrapping', async () => {
    fetchMock.mockRejectedValue(new DOMException('Aborted', 'AbortError'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('/test')).rejects.toThrow(DOMException)
  })

  it('throws INVALID_RESPONSE when JSON parsing fails on success', async () => {
    fetchMock.mockResolvedValue(
      new Response('not json', { status: 200, headers: { 'Content-Type': 'text/plain' } }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('/test')).rejects.toMatchObject({ code: 'INVALID_RESPONSE' })
  })
})
