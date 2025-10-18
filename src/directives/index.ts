import type { App } from 'vue'
import { vLazyImage } from './lazyImage'

export function registerDirectives(app: App) {
  app.directive('lazy-image', vLazyImage)
}

export { vLazyImage }
