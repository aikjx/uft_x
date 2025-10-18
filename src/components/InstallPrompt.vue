<template>
  <Transition name="slide-up">
    <div v-if="isInstallable" class="install-prompt">
      <div class="install-content">
        <div class="install-icon">📱</div>
        <div class="install-text">
          <h3>安装应用</h3>
          <p>将 UTF Star 添加到主屏幕，获得更好的体验</p>
        </div>
        <div class="install-actions">
          <button @click="handleInstall" class="btn-install">安装</button>
          <button @click="handleDismiss" class="btn-dismiss">稍后</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useInstallPrompt } from '@/plugins/pwa'

const { isInstallable, install } = useInstallPrompt()

const handleInstall = async () => {
  await install()
}

const handleDismiss = () => {
  isInstallable.value = false
  localStorage.setItem('install-prompt-dismissed', Date.now().toString())
}

onMounted(() => {
  const dismissed = localStorage.getItem('install-prompt-dismissed')
  if (dismissed) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) {
      isInstallable.value = false
    }
  }
})
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 500px;
  width: calc(100% - 40px);
}

.install-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.install-icon {
  font-size: 2rem;
}

.install-text {
  flex: 1;
  color: white;
}

.install-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.install-text p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}

.install-actions {
  display: flex;
  gap: 0.5rem;
}

.install-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-install {
  background: white;
  color: #667eea;
}

.btn-install:hover {
  transform: scale(1.05);
}

.btn-dismiss {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-dismiss:hover {
  background: rgba(255, 255, 255, 0.3);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translate(-50%, 100px);
  opacity: 0;
}
</style>
