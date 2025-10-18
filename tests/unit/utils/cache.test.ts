import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryCache } from '@/utils/performance/cache'

describe('MemoryCache', () => {
  let cache: MemoryCache<string>

  beforeEach(() => {
    cache = new MemoryCache<string>()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stores and retrieves values', () => {
    cache.set('key1', 'value1')
    expect(cache.get('key1')).toBe('value1')
  })

  it('returns null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull()
  })

  it('expires values after TTL', () => {
    cache.set('key1', 'value1', 1000)
    expect(cache.get('key1')).toBe('value1')

    vi.advanceTimersByTime(1001)
    expect(cache.get('key1')).toBeNull()
  })

  it('checks if key exists', () => {
    cache.set('key1', 'value1')
    expect(cache.has('key1')).toBe(true)
    expect(cache.has('key2')).toBe(false)
  })

  it('deletes values', () => {
    cache.set('key1', 'value1')
    cache.delete('key1')
    expect(cache.get('key1')).toBeNull()
  })

  it('clears all values', () => {
    cache.set('key1', 'value1')
    cache.set('key2', 'value2')
    cache.clear()
    expect(cache.size()).toBe(0)
  })

  it('cleans up expired entries', () => {
    cache.set('key1', 'value1', 1000)
    cache.set('key2', 'value2', 5000)

    vi.advanceTimersByTime(1001)
    cache.cleanup()

    expect(cache.has('key1')).toBe(false)
    expect(cache.has('key2')).toBe(true)
  })
})
