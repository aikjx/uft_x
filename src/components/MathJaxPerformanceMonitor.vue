<template>
  <div v-if="show" class="performance-monitor" :class="{ collapsed: isCollapsed }">
    <div class="monitor-header" @click="toggleCollapse">
      <span class="monitor-title">📊 MathJax 性能监控</span>
      <button class="collapse-btn">{{ isCollapsed ? '▼' : '▲' }}</button>
    </div>
    
    <div v-if="!isCollapsed" class="monitor-content">
      <!-- 实时指标 -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">总渲染次数</div>
          <div class="metric-value">{{ metrics.totalRenders }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">缓存命中率</div>
          <div class="metric-value" :class="getCacheHitClass">
            {{ metrics.cacheHitRate }}
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">平均渲染时间</div>
          <div class="metric-value">
            {{ metrics.averageRenderTime.toFixed(2) }}ms
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">失败次数</div>
          <div class="metric-value" :class="{ 'text-error': metrics.failedRenders > 0 }">
            {{ metrics.failedRenders }}
          </div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">缓存大小</div>
          <div class="metric-value">{{ metrics.cacheSize }}</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-label">队列长度</div>
          <div class="metric-value" :class="{ 'text-warning': metrics.queueLength > 10 }">
            {{ metrics.queueLength }}
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="monitor-actions">
        <button @click="refreshMetrics" class="action-btn">
          🔄 刷新
        </button>
        <button @click="clearCache" class="action-btn">
          🗑️ 清空缓存
        </button>
        <button @click="optimizeCache" class="action-btn">
          ⚡ 优化缓存
        </button>
        <button @click="resetMetrics" class="action-btn">
          🔁 重置指标
        </button>
      </div>
      
      <!-- 性能建议 -->
      <div v-if="suggestions.length > 0" class="suggestions">
        <div class="suggestions-title">💡 性能建议</div>
        <ul class="suggestions-list">
          <li v-for="(suggestion, index) in suggestions" :key="index">
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { mathJaxManager } from '@/utils/mathjax'

interface Props {
  show?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  autoRefresh: true,
  refreshInterval: 2000
})

const isCollapsed = ref(false)
const metrics = ref(mathJaxManager.getMetrics())
let refreshTimer: number | null = null

// 缓存命中率样式
const getCacheHitClass = computed(() => {
  const rate = parseFloat(metrics.value.cacheHitRate)
  if (rate >= 70) return 'text-success'
  if (rate >= 40) return 'text-warning'
  return 'text-error'
})

// 性能建议
const suggestions = computed(() => {
  const tips: string[] = []
  const rate = parseFloat(metrics.value.cacheHitRate)
  
  if (rate < 40 && metrics.value.totalRenders > 20) {
    tips.push('缓存命中率较低，考虑启用预加载功能')
  }
  
  if (metrics.value.averageRenderTime > 100) {
    tips.push('平均渲染时间较长，建议使用批量渲染或懒加载')
  }
  
  if (metrics.value.failedRenders > 5) {
    tips.push('渲染失败次数较多，请检查公式语法或网络连接')
  }
  
  if (metrics.value.queueLength > 20) {
    tips.push('渲染队列较长，考虑增加批次大小或减少并发渲染')
  }
  
  if (metrics.value.cacheSize > 100) {
    tips.push('缓存项较多，建议定期清理过期缓存')
  }
  
  return tips
})

// 刷新指标
const refreshMetrics = () => {
  metrics.value = mathJaxManager.getMetrics()
}

// 清空缓存
const clearCache = () => {
  if (confirm('确定要清空所有缓存吗？')) {
    mathJaxManager.clearCache()
    refreshMetrics()
  }
}

// 优化缓存
const optimizeCache = () => {
  mathJaxManager.optimizeCache(2)
  refreshMetrics()
}

// 重置指标
const resetMetrics = () => {
  if (confirm('确定要重置所有性能指标吗？')) {
    mathJaxManager.resetMetrics()
    refreshMetrics()
  }
}

// 切换折叠
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 自动刷新
const startAutoRefresh = () => {
  if (props.autoRefresh) {
    refreshTimer = window.setInterval(refreshMetrics, props.refreshInterval)
  }
}

const stopAutoRefresh = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

onMounted(() => {
  refreshMetrics()
  startAutoRefresh()
})

onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.performance-monitor {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(10, 10, 15, 0.95);
  border: 2px solid #64ffda;
  border-radius: 12px;
  padding: 1rem;
  min-width: 320px;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 9999;
  transition: all 0.3s ease;
}

.performance-monitor.collapsed {
  min-width: auto;
  padding: 0.5rem 1rem;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.monitor-title {
  font-size: 1rem;
  font-weight: 600;
  color: #64ffda;
}

.collapse-btn {
  background: transparent;
  border: none;
  color: #64ffda;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  transition: transform 0.3s;
}

.collapse-btn:hover {
  transform: scale(1.2);
}

.monitor-content {
  margin-top: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.metric-card {
  background: rgba(100, 255, 218, 0.05);
  border: 1px solid rgba(100, 255, 218, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  text-align: center;
}

.metric-label {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e0e0e0;
}

.text-success {
  color: #64ffda;
}

.text-warning {
  color: #ffd700;
}

.text-error {
  color: #ff6b6b;
}

.monitor-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  padding: 0.5rem;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  border-radius: 6px;
  color: #64ffda;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(100, 255, 218, 0.2);
  border-color: #64ffda;
  transform: translateY(-2px);
}

.suggestions {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
}

.suggestions-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.5rem;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestions-list li {
  font-size: 0.8rem;
  color: #e0e0e0;
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.suggestions-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: #ffd700;
}

/* 响应式 */
@media (max-width: 768px) {
  .performance-monitor {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .monitor-actions {
    grid-template-columns: 1fr;
  }
}
</style>
