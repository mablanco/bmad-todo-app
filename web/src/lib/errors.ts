export class ApiError extends Error {
  code: string
  details: Record<string, unknown>

  constructor(
    code: string,
    message: string,
    details: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
  }
}

export const DEFAULT_SERVER_ERROR_MESSAGE =
  'Something went wrong while talking to the server.'

export const DEFAULT_NETWORK_ERROR_MESSAGE =
  "We couldn't reach your task list. Try again."

type BackendErrorPayload = {
  error?: {
    code?: string
    message?: string
    details?: Record<string, unknown>
  }
}

export function toApiError(payload: BackendErrorPayload | null, fallback: string) {
  return new ApiError(
    payload?.error?.code ?? 'UNKNOWN_ERROR',
    payload?.error?.message ?? fallback,
    payload?.error?.details ?? {},
  )
}

export function toNetworkError() {
  return new ApiError('NETWORK_ERROR', DEFAULT_NETWORK_ERROR_MESSAGE)
}
