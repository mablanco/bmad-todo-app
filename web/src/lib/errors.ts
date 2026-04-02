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

const SAFE_MESSAGES: Record<string, string> = {
  TODO_NOT_FOUND: 'That task could not be found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Try again shortly.',
}

export function toApiError(payload: BackendErrorPayload | null, fallback: string) {
  const code = payload?.error?.code ?? 'UNKNOWN_ERROR'
  const message = SAFE_MESSAGES[code] ?? fallback
  return new ApiError(code, message)
}

export function toNetworkError() {
  return new ApiError('NETWORK_ERROR', DEFAULT_NETWORK_ERROR_MESSAGE)
}
