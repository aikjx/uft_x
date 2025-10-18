import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MathFormula from '@/components/MathFormula.vue'

describe('MathFormula', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders formula container', () => {
    const wrapper = mount(MathFormula, {
      props: {
        formula: 'E = mc^2'
      }
    })

    expect(wrapper.find('.math-formula').exists()).toBe(true)
  })

  it('displays loading state initially', () => {
    const wrapper = mount(MathFormula, {
      props: {
        formula: 'E = mc^2'
      }
    })

    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('applies custom color prop', () => {
    const wrapper = mount(MathFormula, {
      props: {
        formula: 'E = mc^2',
        color: '#ff0000'
      }
    })

    const style = wrapper.find('.math-formula').attributes('style')
    expect(style).toContain('color: rgb(255, 0, 0)')
  })

  it('applies size classes correctly', () => {
    const wrapper = mount(MathFormula, {
      props: {
        formula: 'E = mc^2',
        size: 'large'
      }
    })

    expect(wrapper.find('.size-large').exists()).toBe(true)
  })

  it('handles display mode prop', () => {
    const wrapper = mount(MathFormula, {
      props: {
        formula: 'E = mc^2',
        display: true
      }
    })

    expect(wrapper.find('.display-block').exists()).toBe(true)
  })
})
