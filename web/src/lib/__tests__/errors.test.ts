import { describe, expect, it } from 'vitest'
import { ApiError, toApiError, toNetworkError } from '../errors'

describe('ApiError', () => {
  it('creates an error with code and message', () => {
    const err = new ApiError('TEST', 'test message')
    expect(err.code).toBe('TEST')
    expect(err.message).toBe('test message')
    expect(err.name).toBe('ApiError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('toApiError', () => {
  it('maps known error codes to safe messages', () => {
    const err = toApiError({ error: { code: 'SERVER_ERROR', message: 'raw server text' } }, 'fallback')
    expect(err.code).toBe('SERVER_ERROR')
    expect(err.message).toBe('Something went wrong on our end. Try again shortly.')
    expect(err.message).not.toBe('raw server text')
  })

  it('maps TODO_NOT_FOUND to safe message', () => {
    const err = toApiError({ error: { code: 'TODO_NOT_FOUND', message: 'raw' } }, 'fallback')
    expect(err.message).toBe('That task could not be found.')
  })

  it('maps VALIDATION_ERROR to safe message', () => {
    const err = toApiError({ error: { code: 'VALIDATION_ERROR', message: 'raw' } }, 'fallback')
    expect(err.message).toBe('Please check your input and try again.')
  })

  it('uses fallback for unknown error codes', () => {
    const err = toApiError({ error: { code: 'UNKNOWN_CODE', message: 'raw' } }, 'my fallback')
    expect(err.message).toBe('my fallback')
  })

  it('uses fallback for null payload', () => {
    const err = toApiError(null, 'fallback')
    expect(err.code).toBe('UNKNOWN_ERROR')
    expect(err.message).toBe('fallback')
  })
})

describe('toNetworkError', () => {
  it('creates a NETWORK_ERROR ApiError', () => {
    const err = toNetworkError()
    expect(err.code).toBe('NETWORK_ERROR')
    expect(err).toBeInstanceOf(ApiError)
  })
})
