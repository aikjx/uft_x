<template>
  <div v-if="error" class="error-boundary">
    <div class="error-content">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">{{ title }}</h2>
      <p class="error-message">{{ error.message }}</p>
      <div v-if="showDetails" class="error-details">
        <pre>{{ error.stack }}</pre>
      </div>
      <div class="error-actions">
        <button @click="handleRetry" class="btn-retry">重试</button>
        <button @click="handleReset" class="btn-reset">返回首页</button>
        <button @click="showDetails = !showDetails" class="btn-toggle">
          {{ showDetails ? '隐藏' : '显示' }}详情
        </button>
      </div>
    </div>
  </div>
  <slot v-else></slot>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  onRetry?: () => void
  onReset?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '出错了'
})

const error = ref<Error | null>(null)
const showDetails = ref(false)
const router = useRouter()

const handleError = (err: Error) => {
  error.value = err
  console.error('ErrorBoundary caught:', err)
}

const handleRetry = () => {
  error.value = null
  props.onRetry?.()
}

const handleReset = () => {
  error.value = null
  props.onReset?.()
  router.push('/')
}

onErrorCaptured((err: Error) => {
  handleError(err)
  return false
})
</script>

<style scoped>
.error-boundary {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.error-content {
  max-width: 600px;
  text-align: center;
  background: rgba(255, 59, 48, 0.1);
  border: 2px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  padding: 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #ff3b30;
}

.error-message {
  color: #666;
  margin-bottom: 1.5rem;
}

.error-details {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: left;
  max-height: 200px;
  overflow-y: auto;
}

.error-details pre {
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions button {
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-retry {
  background: #00f5ff;
  color: #000;
}

.btn-retry:hover {
  background: #00d4e0;
}

.btn-reset {
  background: #666;
  color: #fff;
}

.btn-reset:hover {
  background: #555;
}

.btn-toggle {
  background: transparent;
  color: #666;
  border: 1px solid #666;
}

.btn-toggle:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
