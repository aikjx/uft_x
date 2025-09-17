/**
 * 性能优化工具函数
 */

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 懒加载图片
export function lazyLoadImage(img: HTMLImageElement, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target as HTMLImageElement
          image.src = src
          image.onload = () => resolve()
          image.onerror = reject
          observer.unobserve(image)
        }
      })
    })
    
    observer.observe(img)
  })
}

// 预加载资源
export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image'): Promise<void> {
  return new Promise((resolve, reject) => {
    let element: HTMLImageElement | HTMLScriptElement | HTMLLinkElement
    
    switch (type) {
      case 'image':
        element = new Image()
        ;(element as HTMLImageElement).src = url
        break
      case 'script':
        element = document.createElement('script')
        ;(element as HTMLScriptElement).src = url
        document.head.appendChild(element)
        break
      case 'style':
        element = document.createElement('link')
        ;(element as HTMLLinkElement).rel = 'stylesheet'
        ;(element as HTMLLinkElement).href = url
        document.head.appendChild(element)
        break
    }
    
    element.onload = () => resolve()
    element.onerror = reject
  })
}

// 内存使用监控
export function getMemoryUsage(): PerformanceMemory | null {
  if ('memory' in performance) {
    return (performance as any).memory
  }
  return null
}

// FPS监控
export class FPSMonitor {
  private frames = 0
  private startTime = performance.now()
  private fps = 0
  
  update(): number {
    this.frames++
    const currentTime = performance.now()
    
    if (currentTime >= this.startTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.startTime))
      this.frames = 0
      this.startTime = currentTime
    }
    
    return this.fps
  }
  
  getFPS(): number {
    return this.fps
  }
}

// 资源加载性能监控
export function measureResourceTiming(resourceName: string): PerformanceResourceTiming | null {
  const entries = performance.getEntriesByName(resourceName, 'resource')
  return entries.length > 0 ? entries[0] as PerformanceResourceTiming : null
}

// 组件渲染时间监控
export function measureRenderTime(name: string, fn: () => void): number {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} 渲染时间: ${end - start}ms`)
  return end - start
}