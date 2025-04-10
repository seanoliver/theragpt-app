/**
 * Base error class for the application
 */
export class AppError extends Error {
  code: string

  constructor(message: string, code: string) {
    super(message)
    this.name = this.constructor.name
    this.code = code
  }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR')
  }
}

/**
 * API error
 */
export class ApiError extends AppError {
  statusCode?: number

  constructor(message: string, statusCode?: number) {
    super(message, 'API_ERROR')
    this.statusCode = statusCode
  }
}

/**
 * Storage error
 */
export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR')
  }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND_ERROR')
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED_ERROR')
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 'FORBIDDEN_ERROR')
  }
}