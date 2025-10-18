export interface LazyLoadOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
}

export function useLazyLoad(
  callback: (entry: IntersectionObserverEntry) => void,
  options: LazyLoadOptions = {}
) {
  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1,
    once = true
  } = options

  const observer = ref<IntersectionObserver>()
  const targets = new Set<Element>()

  const observe = (element: Element) => {
    if (!observer.value) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback(entry)
              if (once) {
                unobserve(entry.target)
              }
            }
          })
        },
        { root, rootMargin, threshold }
      )
    }

    observer.value.observe(element)
    targets.add(element)
  }

  const unobserve = (element: Element) => {
    observer.value?.unobserve(element)
    targets.delete(element)
  }

  const disconnect = () => {
    observer.value?.disconnect()
    targets.clear()
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    unobserve,
    disconnect
  }
}

// 图片懒加载指令
export const vLazyImage = {
  mounted(el: HTMLImageElement, binding: { value: string }) {
    const { observe } = useLazyLoad((entry) => {
      const img = entry.target as HTMLImageElement
      img.src = binding.value
      img.classList.add('loaded')
    })

    el.classList.add('lazy-image')
    observe(el)
  }
}

// 组件懒加载
export function lazyLoadComponent(loader: () => Promise<any>) {
  return defineAsyncComponent({
    loader,
    loadingComponent: {
      template: '<div class="loading">加载中...</div>'
    },
    errorComponent: {
      template: '<div class="error">加载失败</div>'
    },
    delay: 200,
    timeout: 10000
  })
}
