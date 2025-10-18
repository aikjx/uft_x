export function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered:', registration)

          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 有新版本可用
                  if (confirm('发现新版本，是否立即更新？')) {
                    newWorker.postMessage({ type: 'SKIP_WAITING' })
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('SW registration failed:', error)
        })

      // 监听 SW 控制器变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    })
  }
}

// 安装提示
export function useInstallPrompt() {
  const deferredPrompt = ref<any>(null)
  const isInstallable = ref(false)

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
    isInstallable.value = true
  })

  const install = async () => {
    if (!deferredPrompt.value) return

    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    deferredPrompt.value = null
    isInstallable.value = false
  }

  return {
    isInstallable,
    install
  }
}
