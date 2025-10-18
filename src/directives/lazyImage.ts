import type { Directive } from 'vue'

interface LazyImageElement extends HTMLImageElement {
  _lazyObserver?: IntersectionObserver
}

export const vLazyImage: Directive<LazyImageElement, string> = {
  mounted(el, binding) {
    const imageUrl = binding.value

    if (!imageUrl) return

    // 设置占位符
    el.style.backgroundColor = '#f0f0f0'
    el.style.minHeight = '200px'

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement

            // 创建临时图片对象预加载
            const tempImg = new Image()
            tempImg.onload = () => {
              img.src = imageUrl
              img.classList.add('lazy-loaded')
              img.style.backgroundColor = 'transparent'
            }
            tempImg.onerror = () => {
              img.alt = '图片加载失败'
              img.style.backgroundColor = '#ffebee'
            }
            tempImg.src = imageUrl

            observer.unobserve(img)
          }
        })
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    )

    observer.observe(el)
    el._lazyObserver = observer
  },

  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  }
}
