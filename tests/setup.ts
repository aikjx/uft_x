import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局测试设置
beforeEach(() => {
  // 清理所有模拟
  vi.clearAllMocks()
})

// Vue Test Utils 全局配置
config.global.stubs = {
  // 存根化路由组件
  'router-link': true,
  'router-view': true,
}

// 模拟 MathJax
Object.defineProperty(window, 'MathJax', {
  value: {
    typesetPromise: vi.fn().mockResolvedValue(undefined),
    startup: {
      promise: Promise.resolve()
    },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
  },
  writable: true
})

// 模拟 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// 模拟 matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// 模拟 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// 模拟 sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('sessionStorage', sessionStorageMock)