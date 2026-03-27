import { getApiBaseUrl } from './env'
import {
  ApiError,
  DEFAULT_SERVER_ERROR_MESSAGE,
  toApiError,
  toNetworkError,
} from './errors'

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...init?.headers,
      },
    })
  } catch {
    throw toNetworkError()
  }

  if (!response.ok) {
    let payload = null

    try {
      payload = (await response.json()) as Record<string, unknown>
    } catch {
      payload = null
    }

    throw toApiError(
      payload as never,
      DEFAULT_SERVER_ERROR_MESSAGE,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      'The server returned an unexpected response.',
    )
  }
}
