export type ApiErrorCode =
  'NOT_FOUND' | 'VALIDATION' | 'CONFLICT' | 'UNAUTHORIZED' | 'NOT_AVAILABLE'

/**
 * Error data layer dengan bentuk yang sama untuk adapter mock dan HTTP.
 * `fields` dipakai form untuk menempelkan pesan ke kontrol terkait.
 */
export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly fields?: Record<string, string>

  constructor(code: ApiErrorCode, message: string, fields?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.fields = fields
  }
}
