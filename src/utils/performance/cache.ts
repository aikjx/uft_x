interface CacheItem<T> {
  value: T
  timestamp: number
  ttl: number
}

export class MemoryCache<T = any> {
  private cache = new Map<string, CacheItem<T>>()
  private defaultTTL = 5 * 60 * 1000 // 5分钟

  set(key: string, value: T, ttl?: number): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)

    if (!item) return null

    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// 全局缓存实例
export const globalCache = new MemoryCache()

// 缓存装饰器
export function Cacheable(ttl?: number) {
  return function (
    _target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const cache = new MemoryCache()

    descriptor.value = async function (...args: any[]) {
      const key = `${propertyKey}_${JSON.stringify(args)}`

      const cached = cache.get(key)
      if (cached !== null) {
        return cached
      }

      const result = await originalMethod.apply(this, args)
      cache.set(key, result, ttl)

      return result
    }

    return descriptor
  }
}

// 自动清理过期缓存
setInterval(() => {
  globalCache.cleanup()
}, 60 * 1000) // 每分钟清理一次
