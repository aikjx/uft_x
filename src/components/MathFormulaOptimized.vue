<template>
  <div 
    ref="formulaContainer" 
    class="math-formula"
    :class="{ 
      'loading': isLoading, 
      'error': hasError,
      'inline': inline,
      'display': !inline,
      'lazy': lazy && !isVisible,
      [size]: true
    }"
    :style="{ color: color }"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="formula-loading">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ loadingText }}</span>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="hasError" class="formula-error">
      <span class="error-icon">⚠️</span>
      <span class="error-text">{{ errorMessage }}</span>
      <button @click="retry" class="retry-btn">重试</button>
    </div>
    
    <!-- 懒加载占位符 -->
    <div v-else-if="lazy && !isVisible" class="formula-placeholder">
      <span class="placeholder-icon">📐</span>
      <span class="placeholder-text">公式加载中...</span>
    </div>
    
    <!-- 公式内容 -->
    <div v-else ref="formulaElement" class="formula-content"></div>
    
    <!-- 性能指标（开发模式） -->
    <div v-if="showMetrics && renderTime" class="formula-metrics">
      <span>渲染时间: {{ renderTime }}ms</span>
      <span v-if="fromCache">（缓存）</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { mathJaxManager } from '@/utils/mathjax'

interface Props {
  formula: string
  inline?: boolean
  color?: string
  size?: 'small' | 'medium' | 'large' | 'xl'
  lazy?: boolean
  priority?: number
  loadingText?: string
  errorMessage?: string
  showMetrics?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  color: '#1a202c',
  size: 'medium',
  lazy: false,
  priority: 0,
  loadingText: '渲染中...',
  errorMessage: '公式渲染失败',
  showMetrics: false
})

const emit = defineEmits<{
  rendered: []
  error: [error: Error]
}>()

const formulaContainer = ref<HTMLElement>()
const formulaElement = ref<HTMLElement>()
const isLoading = ref(true)
const hasError = ref(false)
const isVisible = ref(!props.lazy)
const renderTime = ref<number>(0)
const fromCache = ref(false)

// 渲染公式
const renderFormula = async () => {
  if (!isVisible.value && props.lazy) {
    return
  }

  try {
    isLoading.value = true
    hasError.value = false
    renderTime.value = 0
    fromCache.value = false
    
    await nextTick()
    
    if (!formulaElement.value) {
      throw new Error('公式元素未找到')
    }
    
    // 清理并包装公式
    const wrappedFormula = mathJaxManager.wrapFormula(props.formula, props.inline)
    
    if (!wrappedFormula) {
      throw new Error('公式为空')
    }
    
    const startTime = performance.now()
    
    // 使用全局管理器渲染（自动重试和优化）
    if (props.lazy) {
      mathJaxManager.lazyRender(formulaElement.value, wrappedFormula)
    } else {
      await mathJaxManager.typeset([formulaElement.value], 0, props.priority)
    }
    
    renderTime.value = Math.round(performance.now() - startTime)
    
    // 检查是否来自缓存（渲染时间很短）
    fromCache.value = renderTime.value < 10
    
    isLoading.value = false
    emit('rendered')
    
  } catch (error) {
    console.error('公式渲染错误:', error, '公式:', props.formula)
    hasError.value = true
    isLoading.value = false
    emit('error', error as Error)
  }
}

// 重试
const retry = () => {
  renderFormula()
}

// 监听公式变化
watch(() => props.formula, () => {
  if (props.formula) {
    renderFormula()
  }
}, { immediate: false })

// 监听可见性变化
watch(isVisible, (visible) => {
  if (visible && !hasError.value) {
    renderFormula()
  }
})

// 组件挂载
onMounted(() => {
  if (props.lazy) {
    // 使用 Intersection Observer 检测可见性
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '100px',
        threshold: 0.01
      }
    )
    
    if (formulaContainer.value) {
      observer.observe(formulaContainer.value)
    }
  } else {
    renderFormula()
  }
})

// 组件卸载
onBeforeUnmount(() => {
  if (formulaElement.value) {
    mathJaxManager.clear([formulaElement.value])
  }
})
</script>

<style scoped>
.math-formula {
  position: relative;
  transition: all 0.3s ease;
}

.math-formula.inline {
  display: inline-block;
  vertical-align: middle;
}

.math-formula.display {
  display: block;
  text-align: center;
  margin: 1rem 0;
}

.formula-content {
  transition: color 0.3s ease;
}

/* 尺寸样式 */
.math-formula.small .formula-content {
  font-size: 0.875rem;
}

.math-formula.medium .formula-content {
  font-size: 1.125rem;
}

.math-formula.large .formula-content {
  font-size: 1.5rem;
}

.math-formula.xl .formula-content {
  font-size: 2rem;
}

/* 加载状态 */
.formula-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #64ffda;
  min-height: 2rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(100, 255, 218, 0.3);
  border-top: 2px solid #64ffda;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 0.875rem;
}

/* 错误状态 */
.formula-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #ff6b6b;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  min-height: 2rem;
}

.error-icon {
  font-size: 1.25rem;
}

.error-text {
  font-size: 0.875rem;
}

.retry-btn {
  padding: 0.25rem 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 107, 107, 0.5);
  border-radius: 4px;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.3s;
}

.retry-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  border-color: #ff6b6b;
}

/* 懒加载占位符 */
.formula-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.05);
  border: 1px dashed rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  min-height: 2rem;
}

.placeholder-icon {
  font-size: 1.25rem;
}

.placeholder-text {
  font-size: 0.875rem;
}

/* 性能指标 */
.formula-metrics {
  position: absolute;
  top: -20px;
  right: 0;
  font-size: 0.7rem;
  color: #64ffda;
  background: rgba(10, 10, 15, 0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: flex;
  gap: 0.25rem;
  pointer-events: none;
}

/* 悬停效果 */
.math-formula:hover .formula-content {
  filter: brightness(1.1);
}

/* 懒加载动画 */
.math-formula.lazy {
  opacity: 0.6;
  transform: scale(0.98);
}

.math-formula.lazy:not(.loading) {
  animation: fadeInScale 0.3s ease-out forwards;
}

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .math-formula.xl .formula-content {
    font-size: 1.5rem;
  }
  
  .math-formula.large .formula-content {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .math-formula.xl .formula-content {
    font-size: 1.25rem;
  }
  
  .math-formula.large .formula-content {
    font-size: 1.1rem;
  }
}
</style>
