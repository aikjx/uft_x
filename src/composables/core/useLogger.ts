type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: number
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 100
  private isDevelopment = import.meta.env.DEV

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: Date.now()
    }

    this.logs.push(entry)

    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    if (this.isDevelopment) {
      const style = this.getStyle(level)
      console[level](`%c[${level.toUpperCase()}]`, style, message, data || '')
    }
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #888',
      info: 'color: #00f5ff',
      warn: 'color: #ff9500',
      error: 'color: #ff3b30'
    }
    return `font-weight: bold; ${styles[level]}`
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data)
  }

  info(message: string, data?: any) {
    this.log('info', message, data)
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data)
  }

  error(message: string, data?: any) {
    this.log('error', message, data)
  }

  getLogs() {
    return [...this.logs]
  }

  clearLogs() {
    this.logs = []
  }
}

const logger = new Logger()

export function useLogger(context?: string) {
  const prefix = context ? `[${context}]` : ''

  return {
    debug: (message: string, data?: any) => logger.debug(`${prefix} ${message}`, data),
    info: (message: string, data?: any) => logger.info(`${prefix} ${message}`, data),
    warn: (message: string, data?: any) => logger.warn(`${prefix} ${message}`, data),
    error: (message: string, data?: any) => logger.error(`${prefix} ${message}`, data),
    getLogs: logger.getLogs.bind(logger),
    clearLogs: logger.clearLogs.bind(logger)
  }
}

export default logger
