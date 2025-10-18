import { describe, it, expect, beforeEach } from 'vitest'
import { useTheme } from '@/composables/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('initializes with default theme', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBeDefined()
  })

  it('toggles theme correctly', () => {
    const { isDark, toggleTheme } = useTheme()
    const initialValue = isDark.value

    toggleTheme()
    expect(isDark.value).toBe(!initialValue)

    toggleTheme()
    expect(isDark.value).toBe(initialValue)
  })

  it('persists theme to localStorage', () => {
    const { setTheme } = useTheme()

    setTheme('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    setTheme('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('applies dark class to document', () => {
    const { setTheme } = useTheme()

    setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
