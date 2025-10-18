import type { App } from 'vue'

export interface ErrorLog {
  message: string
  stack?: string
  timestamp: number
  url: string
  userAgent: string
}

class ErrorHandler {
  private errors: ErrorLog[] = []
  private maxErrors = 50

  logError(error: Error | string, context?: string) {
    const errorLog: ErrorLog = {
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.errors.push(errorLog)

    if (this.errors.length > this.maxErrors) {
      this.errors.shift()
    }

    console.error(`[${context || 'Error'}]`, error)

    // 可以在这里添加错误上报逻辑
    // this.reportError(errorLog)
  }

  getErrors() {
    return [...this.errors]
  }

  clearErrors() {
    this.errors = []
  }

  install(app: App) {
    app.config.errorHandler = (err, instance, info) => {
      this.logError(err as Error, `Vue Error: ${info}`)
    }

    window.addEventListener('error', (event) => {
      this.logError(event.error || event.message, 'Global Error')
    })

    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, 'Unhandled Promise Rejection')
    })
  }
}

const errorHandler = new ErrorHandler()

export function useErrorHandler() {
  const handleError = (error: Error | string, context?: string) => {
    errorHandler.logError(error, context)
  }

  const getErrorLogs = () => errorHandler.getErrors()
  const clearErrorLogs = () => errorHandler.clearErrors()

  return {
    handleError,
    getErrorLogs,
    clearErrorLogs
  }
}

export default errorHandler
