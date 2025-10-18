/**
 * MathJax 优化版 Composable
 * 提供完整的 MathJax 功能，包括性能优化、缓存、批量渲染等
 */

import { ref, onMounted, onBeforeUnmount, readonly } from 'vue'
import { mathJaxManager } from '@/utils/mathjax'

export interface UseMathJaxOptions {
  autoInit?: boolean
  enableCache?: boolean
  enableLazyLoad?: boolean
  enablePreload?: boolean
  batchSize?: number
  onReady?: () => void
  onError?: (error: Error) => void
}

export function useMathJaxOptimized(options: UseMathJaxOptions = {}) {
  const {
    autoInit = true,
    enableCache = true,
    enableLazyLoad = true,
    enablePreload = true,
    batchSize = 10,
    onReady,
    onError
  } = options

  const isReady = ref(false)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * 初始化 MathJax
   */
  const init = async () => {
    if (isReady.value || isLoading.value) {
      return
    }

    isLoading.value = true
    error.value = null

    try {
      // 更新配置
      mathJaxManager.updateConfig({
        enableCache,
        enableLazyLoad,
        enablePreload,
        batchSize
      })

      // 等待就绪
      await mathJaxManager.waitForReady()

      isReady.value = true
      onReady?.()
    } catch (err) {
      error.value = err as Error
      onError?.(err as Error)
      console.error('MathJax 初始化失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 渲染单个公式
   */
  const render = async (
    element: HTMLElement,
    formula: string,
    options: { inline?: boolean; priority?: number } = {}
  ) => {
    try {
      const wrapped = mathJaxManager.wrapFormula(formula, options.inline ?? false)
      element.textContent = wrapped
      await mathJaxManager.typeset([element], 0, options.priority ?? 0)
    } catch (err) {
      console.error('公式渲染失败:', err)
      throw err
    }
  }

  /**
   * 批量渲染公式
   */
  const renderBatch = async (
    items: Array<{ element: HTMLElement; formula: string; inline?: boolean }>
  ) => {
    try {
      const elements = items.map(item => {
        const wrapped = mathJaxManager.wrapFormula(item.formula, item.inline ?? false)
        item.element.textContent = wrapped
        return item.element
      })

      await mathJaxManager.typeset(elements)
    } catch (err) {
      console.error('批量渲染失败:', err)
      throw err
    }
  }

  /**
   * 懒加载渲染
   */
  const renderLazy = (element: HTMLElement, formula: string, inline = false) => {
    const wrapped = mathJaxManager.wrapFormula(formula, inline)
    mathJaxManager.lazyRender(element, wrapped)
  }

  /**
   * 预加载公式
   */
  const preload = async (formulas: string[]) => {
    try {
      await mathJaxManager.preload(formulas)
    } catch (err) {
      console.error('预加载失败:', err)
      throw err
    }
  }

  /**
   * 清理公式
   */
  const clear = (elements: HTMLElement[]) => {
    mathJaxManager.clear(elements)
  }

  /**
   * 清空缓存
   */
  const clearCache = (olderThan?: number) => {
    mathJaxManager.clearCache(olderThan)
  }

  /**
   * 优化缓存
   */
  const optimizeCache = (minHits = 2) => {
    mathJaxManager.optimizeCache(minHits)
  }

  /**
   * 获取性能指标
   */
  const getMetrics = () => {
    return mathJaxManager.getMetrics()
  }

  /**
   * 重置性能指标
   */
  const resetMetrics = () => {
    mathJaxManager.resetMetrics()
  }

  /**
   * 更新配置
   */
  const updateConfig = (config: Partial<UseMathJaxOptions>) => {
    mathJaxManager.updateConfig({
      enableCache: config.enableCache,
      enableLazyLoad: config.enableLazyLoad,
      enablePreload: config.enablePreload,
      batchSize: config.batchSize
    })
  }

  // 自动初始化
  if (autoInit) {
    onMounted(() => {
      init()
    })
  }

  return {
    // 状态
    isReady: readonly(isReady),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // 方法
    init,
    render,
    renderBatch,
    renderLazy,
    preload,
    clear,
    clearCache,
    optimizeCache,
    getMetrics,
    resetMetrics,
    updateConfig
  }
}

/**
 * 公式预加载 Hook
 * 用于在页面加载时预加载常用公式
 */
export function useMathJaxPreload(formulas: string[]) {
  const { isReady, preload } = useMathJaxOptimized({ autoInit: true })

  onMounted(async () => {
    // 等待 MathJax 就绪后预加载
    const checkReady = setInterval(async () => {
      if (isReady.value) {
        clearInterval(checkReady)
        try {
          await preload(formulas)
          console.log(`预加载完成: ${formulas.length} 个公式`)
        } catch (err) {
          console.error('预加载失败:', err)
        }
      }
    }, 100)

    // 10秒超时
    setTimeout(() => clearInterval(checkReady), 10000)
  })
}

/**
 * 公式性能监控 Hook
 */
export function useMathJaxMonitor(interval = 2000) {
  const metrics = ref(mathJaxManager.getMetrics())
  let timer: number | null = null

  const startMonitoring = () => {
    timer = window.setInterval(() => {
      metrics.value = mathJaxManager.getMetrics()
    }, interval)
  }

  const stopMonitoring = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    startMonitoring()
  })

  onBeforeUnmount(() => {
    stopMonitoring()
  })

  return {
    metrics: readonly(metrics),
    startMonitoring,
    stopMonitoring
  }
}

/**
 * 公式批量渲染 Hook
 * 自动收集并批量渲染公式
 */
export function useMathJaxBatch(batchSize = 10, delay = 100) {
  const queue = ref<Array<{
    element: HTMLElement
    formula: string
    inline: boolean
  }>>([])
  const { renderBatch } = useMathJaxOptimized({ autoInit: true })
  let timer: number | null = null

  const add = (element: HTMLElement, formula: string, inline = false) => {
    queue.value.push({ element, formula, inline })

    // 如果队列达到批次大小，立即处理
    if (queue.value.length >= batchSize) {
      flush()
    } else {
      // 否则延迟处理
      if (timer) clearTimeout(timer)
      timer = window.setTimeout(flush, delay)
    }
  }

  const flush = async () => {
    if (queue.value.length === 0) return

    const batch = [...queue.value]
    queue.value = []

    try {
      await renderBatch(batch)
    } catch (err) {
      console.error('批量渲染失败:', err)
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer)
    flush()
  })

  return {
    add,
    flush,
    queueSize: readonly(queue)
  }
}
