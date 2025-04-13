import { getEnvironment } from '@theragpt/config'

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  enableRemote: boolean
}

/**
 * Default logger configuration
 */
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  enableConsole: true,
  enableRemote: false,
}

/**
 * Type for log data to avoid using 'any'
 */
export type LogData = Record<string, unknown>

/**
 * Logger class for consistent logging across the application
 *
 * @example
 * // Create a logger for a specific context
 * const logger = new Logger('AuthService')
 *
 * // Log messages at different levels
 * logger.debug('User login attempt', { username: 'user123' })
 * logger.info('User logged in successfully', { userId: '123' })
 * logger.warn('Rate limit approaching', { currentRate: 9, limit: 10 })
 * logger.error('Failed to authenticate user', new Error('Invalid credentials'))
 */
export class Logger {
  private config: LoggerConfig
  private context: string

  constructor(context: string, config: Partial<LoggerConfig> = {}) {
    this.context = context
    this.config = { ...DEFAULT_CONFIG, ...config }

    // In production, default to warnings and errors only
    if (getEnvironment().NODE_ENV === 'production' && !config.minLevel) {
      this.config.minLevel = LogLevel.WARN
    }
  }

  /**
   * Log a debug message
   *
   * @param message The message to log
   * @param data Additional data to log
   *
   * @example
   * // Basic usage
   * logger.debug('Processing user input')
   *
   * // With additional data
   * logger.debug('Processing user input', { input: 'Hello world', length: 11 })
   *
   * // Output: [2025-04-10T17:00:11.123Z] [DEBUG] [AuthService] Processing user input { input: 'Hello world', length: 11 }
   */
  public debug(message: string, data?: LogData): void {
    this.log(LogLevel.DEBUG, message, data)
  }

  /**
   * Log an info message
   *
   * @param message The message to log
   * @param data Additional data to log
   *
   * @example
   * // Basic usage
   * logger.info('User registered successfully')
   *
   * // With additional data
   * logger.info('User registered successfully', { userId: '123', email: 'user@example.com' })
   *
   * // Output: [2025-04-10T17:00:11.123Z] [INFO] [AuthService] User registered successfully { userId: '123', email: 'user@example.com' }
   */
  public info(message: string, data?: LogData): void {
    this.log(LogLevel.INFO, message, data)
  }

  /**
   * Log a warning message
   *
   * @param message The message to log
   * @param data Additional data to log
   *
   * @example
   * // Basic usage
   * logger.warn('API rate limit approaching')
   *
   * // With additional data
   * logger.warn('API rate limit approaching', { currentRate: 9, limit: 10, endpoint: '/api/users' })
   *
   * // Output: [2025-04-10T17:00:11.123Z] [WARN] [ApiService] API rate limit approaching { currentRate: 9, limit: 10, endpoint: '/api/users' }
   */
  public warn(message: string, data?: LogData): void {
    this.log(LogLevel.WARN, message, data)
  }

  /**
   * Log an error message
   *
   * @param message The message to log
   * @param error The error to log
   * @param data Additional data to log
   *
   * @example
   * // Basic usage
   * logger.error('Failed to save user data')
   *
   * // With error object
   * try {
   *   // Some operation that might throw
   *   throw new Error('Database connection failed')
   * } catch (error) {
   *   logger.error('Failed to save user data', error)
   * }
   *
   * // With error and additional data
   * logger.error('Failed to save user data', new Error('Database connection failed'), { userId: '123', retryCount: 3 })
   *
   * // Output: [2025-04-10T17:00:11.123Z] [ERROR] [UserService] Failed to save user data { error: { message: 'Database connection failed', name: 'Error', stack: '...' }, userId: '123', retryCount: 3 }
   */
  public error(message: string, error?: Error, data?: LogData): void {
    const logData = {
      ...(data || {}),
      ...(error ? {
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      } : {}),
    }

    this.log(LogLevel.ERROR, message, Object.keys(logData).length > 0 ? logData : undefined)
  }

  /**
   * Log a message at the specified level
   * @param level The log level
   * @param message The message to log
   * @param data Additional data to log
   */
  private log(level: LogLevel, message: string, data?: LogData): void {
    // Skip if below minimum level
    if (!this.shouldLog(level)) {
      return
    }

    const timestamp = new Date().toISOString()
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] [${this.context}] ${message}`

    // Log to console if enabled
    if (this.config.enableConsole) {
      this.logToConsole(level, formattedMessage, data)
    }

    // Log to remote if enabled (future implementation)
    if (this.config.enableRemote) {
      this.logToRemote(level, formattedMessage, data)
    }
  }

  /**
   * Determines if a message at the given level should be logged
   * @param level The log level
   * @returns True if the message should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const minLevelIndex = levels.indexOf(this.config.minLevel)
    const currentLevelIndex = levels.indexOf(level)

    return currentLevelIndex >= minLevelIndex
  }

  /**
   * Log a message to the console
   * @param level The log level
   * @param message The formatted message
   * @param data Additional data to log
   */
  private logToConsole(level: LogLevel, message: string, data?: LogData): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(message, data || '')
        break
      case LogLevel.INFO:
        console.info(message, data || '')
        break
      case LogLevel.WARN:
        console.warn(message, data || '')
        break
      case LogLevel.ERROR:
        console.error(message, data || '')
        break
    }
  }

  /**
   * Log a message to a remote logging service
   * This is a placeholder for future implementation
   * @param _level The log level
   * @param _message The formatted message
   * @param _data Additional data to log
   */
  private logToRemote(_level: LogLevel, _message: string, _data?: LogData): void {
    // Placeholder for future implementation
    // This would send logs to a remote service like Sentry, LogRocket, etc.
  }
}

/**
 * Create a default logger for convenience
 *
 * @example
 * // Import the default logger
 * import { logger } from '@theragpt/logic/utils/logger'
 *
 * // Use the default logger
 * logger.info('Application started')
 *
 * // Output: [2025-04-10T17:00:11.123Z] [INFO] [Northstar] Application started
 */
export const logger = new Logger('Northstar')