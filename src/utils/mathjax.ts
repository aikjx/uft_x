/**
 * MathJax 全局工具类 - 深度优化版
 * 统一处理公式渲染、错误重试、状态管理、性能优化
 */

export interface MathJaxConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
  batchSize?: number
  batchDelay?: number
  enableCache?: boolean
  enablePreload?: boolean
  enableLazyLoad?: boolean
}

interface RenderTask {
  element: HTMLElement
  formula: string
  priority: number
  timestamp: number
}

interface CacheEntry {
  rendered: string
  timestamp: number
  hits: number
}

class MathJaxManager {
  private isReady = false
  private readyPromise: Promise<void> | null = null
  private readyCallbacks: Array<() => void> = []
  private config: Required<MathJaxConfig> = {
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 10000,
    batchSize: 10,
    batchDelay: 50,
    enableCache: true,
    enablePreload: true,
    enableLazyLoad: true
  }

  // 性能优化相关
  private renderQueue: RenderTask[] = []
  private isProcessingQueue = false
  private renderCache = new Map<string, CacheEntry>()
  private observer: IntersectionObserver | null = null
  private performanceMetrics = {
    totalRenders: 0,
    cacheHits: 0,
    averageRenderTime: 0,
    failedRenders: 0
  }

  constructor() {
    this.init()
    this.initIntersectionObserver()
  }

  /**
   * 初始化 MathJax
   */
  private init() {
    if (this.readyPromise) return this.readyPromise

    this.readyPromise = new Promise((resolve, reject) => {
      // 如果 MathJax 已经加载
      if (window.MathJax && window.MathJax.typesetPromise) {
        this.isReady = true
        this.notifyReady()
        this.startQueueProcessor()
        resolve()
        return
      }

      // 监听 MathJax 就绪事件
      const handleReady = () => {
        this.isReady = true
        this.notifyReady()
        this.startQueueProcessor()
        resolve()
        window.removeEventListener('mathjax-ready', handleReady)
      }

      window.addEventListener('mathjax-ready', handleReady)

      // 超时处理
      setTimeout(() => {
        if (!this.isReady) {
          window.removeEventListener('mathjax-ready', handleReady)
          reject(new Error('MathJax 加载超时'))
        }
      }, this.config.timeout)
    })

    return this.readyPromise
  }

  /**
   * 初始化 Intersection Observer（懒加载）
   */
  private initIntersectionObserver() {
    if (!this.config.enableLazyLoad || typeof IntersectionObserver === 'undefined') {
      return
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const formula = element.dataset.formula
            if (formula) {
              this.renderWithPriority(element, formula, 1)
              this.observer?.unobserve(element)
            }
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )
  }

  /**
   * 启动队列处理器
   */
  private startQueueProcessor() {
    if (this.isProcessingQueue) return

    this.isProcessingQueue = true
    this.processQueue()
  }

  /**
   * 处理渲染队列（批量渲染）
   */
  private async processQueue() {
    while (this.renderQueue.length > 0) {
      // 按优先级排序
      this.renderQueue.sort((a, b) => b.priority - a.priority)

      // 取出一批任务
      const batch = this.renderQueue.splice(0, this.config.batchSize)

      if (batch.length > 0) {
        await this.renderBatch(batch)

        // 批次间延迟，避免阻塞主线程
        if (this.renderQueue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.batchDelay))
        }
      }
    }

    this.isProcessingQueue = false
  }

  /**
   * 批量渲染
   */
  private async renderBatch(tasks: RenderTask[]) {
    const startTime = performance.now()

    try {
      const elements = tasks.map(task => {
        // 检查缓存
        if (this.config.enableCache) {
          const cached = this.renderCache.get(task.formula)
          if (cached) {
            task.element.innerHTML = cached.rendered
            cached.hits++
            this.performanceMetrics.cacheHits++
            return null
          }
        }

        task.element.textContent = task.formula
        return task.element
      }).filter(Boolean) as HTMLElement[]

      if (elements.length > 0) {
        await window.MathJax.typesetPromise(elements)

        // 更新缓存
        if (this.config.enableCache) {
          tasks.forEach(task => {
            if (task.element.innerHTML) {
              this.renderCache.set(task.formula, {
                rendered: task.element.innerHTML,
                timestamp: Date.now(),
                hits: 1
              })
            }
          })
        }
      }

      this.performanceMetrics.totalRenders += tasks.length

      const renderTime = performance.now() - startTime
      this.performanceMetrics.averageRenderTime =
        (this.performanceMetrics.averageRenderTime * (this.performanceMetrics.totalRenders - tasks.length) + renderTime) /
        this.performanceMetrics.totalRenders

    } catch (error) {
      console.error('批量渲染失败:', error)
      this.performanceMetrics.failedRenders += tasks.length
      throw error
    }
  }

  /**
   * 带优先级的渲染
   */
  private renderWithPriority(element: HTMLElement, formula: string, priority: number) {
    this.renderQueue.push({
      element,
      formula,
      priority,
      timestamp: Date.now()
    })

    if (!this.isProcessingQueue) {
      this.startQueueProcessor()
    }
  }

  /**
   * 通知所有等待的回调
   */
  private notifyReady() {
    this.readyCallbacks.forEach(callback => callback())
    this.readyCallbacks = []
  }

  /**
   * 等待 MathJax 就绪
   */
  async waitForReady(): Promise<void> {
    if (this.isReady) return Promise.resolve()

    return new Promise((resolve) => {
      this.readyCallbacks.push(resolve)
    })
  }

  /**
   * 检查 MathJax 是否就绪
   */
  checkReady(): boolean {
    return this.isReady && !!window.MathJax?.typesetPromise
  }

  /**
   * 渲染公式（带重试机制和优化）
   */
  async typeset(elements: HTMLElement[], retries = 0, priority = 0): Promise<void> {
    try {
      await this.waitForReady()

      if (!window.MathJax?.typesetPromise) {
        throw new Error('MathJax typesetPromise 不可用')
      }

      const startTime = performance.now()

      // 使用批量渲染队列
      if (elements.length > 1 && priority === 0) {
        elements.forEach(element => {
          const formula = element.textContent || ''
          this.renderWithPriority(element, formula, priority)
        })

        // 等待队列处理
        while (this.isProcessingQueue) {
          await new Promise(resolve => setTimeout(resolve, 50))
        }
      } else {
        // 高优先级或单个元素直接渲染
        await window.MathJax.typesetPromise(elements)
      }

      const renderTime = performance.now() - startTime
      this.performanceMetrics.totalRenders += elements.length
      this.performanceMetrics.averageRenderTime =
        (this.performanceMetrics.averageRenderTime * (this.performanceMetrics.totalRenders - elements.length) + renderTime) /
        this.performanceMetrics.totalRenders

    } catch (error) {
      console.error(`公式渲染失败 (尝试 ${retries + 1}/${this.config.maxRetries}):`, error)
      this.performanceMetrics.failedRenders += elements.length

      if (retries < this.config.maxRetries) {
        // 指数退避重试
        const delay = this.config.retryDelay * Math.pow(2, retries)
        await new Promise(resolve => setTimeout(resolve, delay))
        return this.typeset(elements, retries + 1, priority)
      }

      throw error
    }
  }

  /**
   * 懒加载渲染（使用 Intersection Observer）
   */
  lazyRender(element: HTMLElement, formula: string): void {
    if (!this.config.enableLazyLoad || !this.observer) {
      // 如果不支持懒加载，直接渲染
      this.renderWithPriority(element, formula, 0)
      return
    }

    element.dataset.formula = formula
    this.observer.observe(element)
  }

  /**
   * 预加载公式（提前渲染到缓存）
   */
  async preload(formulas: string[]): Promise<void> {
    if (!this.config.enablePreload || !this.config.enableCache) {
      return
    }

    await this.waitForReady()

    const uncachedFormulas = formulas.filter(f => !this.renderCache.has(f))

    if (uncachedFormulas.length === 0) {
      return
    }

    // 创建临时元素进行预渲染
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.visibility = 'hidden'
    tempContainer.style.pointerEvents = 'none'
    document.body.appendChild(tempContainer)

    try {
      const tasks: RenderTask[] = uncachedFormulas.map((formula, index) => {
        const element = document.createElement('div')
        tempContainer.appendChild(element)
        return {
          element,
          formula: this.wrapFormula(formula, false),
          priority: -1, // 低优先级
          timestamp: Date.now()
        }
      })

      await this.renderBatch(tasks)

      console.log(`预加载完成: ${uncachedFormulas.length} 个公式`)
    } finally {
      document.body.removeChild(tempContainer)
    }
  }

  /**
   * 清除公式渲染
   */
  clear(elements: HTMLElement[]): void {
    if (window.MathJax?.typesetClear) {
      window.MathJax.typesetClear(elements)
    }
  }

  /**
   * 清理公式文本
   */
  cleanFormula(text: string): string {
    if (!text) return ''

    let cleaned = text.trim()
      // 移除外层定界符
      .replace(/^\$\$|\$\$$/g, '')
      .replace(/^\$|\$/g, '')
      .replace(/^\\\[|\\\]$/g, '')
      .replace(/^\\\(|\\\)$/g, '')
      // 转换向量符号
      .replace(/\\vec\{([^}]+)\}/g, '\\overrightarrow{$1}')
      // 处理特殊字符
      .replace(/&nbsp;/g, ' ')
      .trim()

    return cleaned
  }

  /**
   * 包装公式（添加定界符）
   */
  wrapFormula(formula: string, inline = false): string {
    const cleaned = this.cleanFormula(formula)
    if (!cleaned) return ''

    if (inline) {
      return `\\(${cleaned}\\)`
    } else {
      return `\\[${cleaned}\\]`
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<MathJaxConfig>): void {
    this.config = { ...this.config, ...config }

    // 如果禁用懒加载，断开 observer
    if (!config.enableLazyLoad && this.observer) {
      this.observer.disconnect()
      this.observer = null
    } else if (config.enableLazyLoad && !this.observer) {
      this.initIntersectionObserver()
    }
  }

  /**
   * 清理缓存（可选择性清理）
   */
  clearCache(olderThan?: number): void {
    if (!olderThan) {
      this.renderCache.clear()
      console.log('缓存已清空')
      return
    }

    const now = Date.now()
    let cleared = 0

    this.renderCache.forEach((entry, key) => {
      if (now - entry.timestamp > olderThan) {
        this.renderCache.delete(key)
        cleared++
      }
    })

    console.log(`清理了 ${cleared} 个过期缓存项`)
  }

  /**
   * 优化缓存（移除低命中率的项）
   */
  optimizeCache(minHits = 2): void {
    let removed = 0

    this.renderCache.forEach((entry, key) => {
      if (entry.hits < minHits) {
        this.renderCache.delete(key)
        removed++
      }
    })

    console.log(`优化缓存: 移除了 ${removed} 个低命中率项`)
  }

  /**
   * 获取性能指标
   */
  getMetrics() {
    return {
      ...this.performanceMetrics,
      cacheSize: this.renderCache.size,
      cacheHitRate: this.performanceMetrics.totalRenders > 0
        ? (this.performanceMetrics.cacheHits / this.performanceMetrics.totalRenders * 100).toFixed(2) + '%'
        : '0%',
      queueLength: this.renderQueue.length
    }
  }

  /**
   * 重置性能指标
   */
  resetMetrics(): void {
    this.performanceMetrics = {
      totalRenders: 0,
      cacheHits: 0,
      averageRenderTime: 0,
      failedRenders: 0
    }
  }

  /**
   * 重置管理器
   */
  reset(): void {
    this.isReady = false
    this.readyPromise = null
    this.readyCallbacks = []
    this.renderQueue = []
    this.renderCache.clear()
    this.resetMetrics()

    if (this.observer) {
      this.observer.disconnect()
    }

    this.init()
    this.initIntersectionObserver()
  }

  /**
   * 销毁管理器
   */
  destroy(): void {
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    this.renderQueue = []
    this.renderCache.clear()
    this.readyCallbacks = []
  }
}

// 导出单例
export const mathJaxManager = new MathJaxManager()

// 导出便捷方法
export const waitForMathJax = () => mathJaxManager.waitForReady()
export const typesetMath = (elements: HTMLElement[]) => mathJaxManager.typeset(elements)
export const clearMath = (elements: HTMLElement[]) => mathJaxManager.clear(elements)
export const cleanFormula = (text: string) => mathJaxManager.cleanFormula(text)
export const wrapFormula = (formula: string, inline = false) => mathJaxManager.wrapFormula(formula, inline)
