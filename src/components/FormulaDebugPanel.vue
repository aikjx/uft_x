<template>
  <div v-if="showPanel" class="debug-panel">
    <div class="debug-header">
      <h3>🔧 公式渲染调试面板</h3>
      <button @click="togglePanel" class="close-btn">×</button>
    </div>
    
    <div class="debug-content">
      <div class="status-section">
        <h4>状态检查</h4>
        <div class="status-item" :class="{ success: mathJaxLoaded, error: !mathJaxLoaded }">
          <span class="icon">{{ mathJaxLoaded ? '✅' : '❌' }}</span>
          <span>MathJax 加载: {{ mathJaxLoaded ? '正常' : '失败' }}</span>
        </div>
        <div class="status-item" :class="{ success: typesetAvailable, error: !typesetAvailable }">
          <span class="icon">{{ typesetAvailable ? '✅' : '❌' }}</span>
          <span>渲染功能: {{ typesetAvailable ? '可用' : '不可用' }}</span>
        </div>
        <div class="status-item">
          <span class="icon">📊</span>
          <span>公式元素: {{ formulaCount }} 个</span>
        </div>
        <div class="status-item" :class="{ error: errorCount > 0 }">
          <span class="icon">{{ errorCount > 0 ? '⚠️' : '✅' }}</span>
          <span>错误: {{ errorCount }} 个</span>
        </div>
      </div>

      <div class="actions-section">
        <h4>快速修复</h4>
        <button @click="reRenderAll" :disabled="isRendering" class="action-btn">
          {{ isRendering ? '渲染中...' : '🔄 重新渲染所有公式' }}
        </button>
        <button @click="clearAndRender" :disabled="isRendering" class="action-btn">
          🧹 清除并重新渲染
        </button>
        <button @click="checkStatus" class="action-btn">
          🔍 刷新状态
        </button>
        <button @click="copyDebugInfo" class="action-btn">
          📋 复制调试信息
        </button>
      </div>

      <div v-if="lastResult" class="result-section">
        <h4>操作结果</h4>
        <div class="result-message" :class="lastResult.type">
          {{ lastResult.message }}
        </div>
      </div>

      <div class="info-section">
        <h4>调试信息</h4>
        <pre>{{ debugInfo }}</pre>
      </div>
    </div>
  </div>

  <!-- 浮动按钮 -->
  <button v-if="!showPanel" @click="togglePanel" class="float-btn" title="打开调试面板">
    🔧
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const showPanel = ref(false)
const mathJaxLoaded = ref(false)
const typesetAvailable = ref(false)
const formulaCount = ref(0)
const errorCount = ref(0)
const isRendering = ref(false)
const lastResult = ref<{ type: string; message: string } | null>(null)

const debugInfo = computed(() => {
  return JSON.stringify({
    mathJax: !!window.MathJax,
    typesetPromise: !!(window.MathJax && window.MathJax.typesetPromise),
    startup: !!(window.MathJax && window.MathJax.startup),
    formulaElements: formulaCount.value,
    errors: errorCount.value,
    timestamp: new Date().toLocaleString()
  }, null, 2)
})

const togglePanel = () => {
  showPanel.value = !showPanel.value
  if (showPanel.value) {
    checkStatus()
  }
}

const checkStatus = () => {
  mathJaxLoaded.value = !!window.MathJax
  typesetAvailable.value = !!(window.MathJax && window.MathJax.typesetPromise)
  
  formulaCount.value = document.querySelectorAll('.formula-content, .math-formula, [class*="formula"]').length
  errorCount.value = document.querySelectorAll('.formula-error, .error').length
}

const reRenderAll = async () => {
  isRendering.value = true
  lastResult.value = null
  
  try {
    if (window.MathJax && window.MathJax.typesetPromise) {
      await window.MathJax.typesetPromise()
      lastResult.value = {
        type: 'success',
        message: '✅ 所有公式重新渲染成功！'
      }
      checkStatus()
    } else {
      throw new Error('MathJax 不可用')
    }
  } catch (error: any) {
    lastResult.value = {
      type: 'error',
      message: `❌ 渲染失败: ${error.message}`
    }
  } finally {
    isRendering.value = false
  }
}

const clearAndRender = async () => {
  isRendering.value = true
  lastResult.value = null
  
  try {
    if (window.MathJax) {
      if (window.MathJax.typesetClear) {
        window.MathJax.typesetClear()
      }
      
      if (window.MathJax.typesetPromise) {
        await window.MathJax.typesetPromise()
        lastResult.value = {
          type: 'success',
          message: '✅ 清除并重新渲染成功！'
        }
        checkStatus()
      } else {
        throw new Error('typesetPromise 不可用')
      }
    } else {
      throw new Error('MathJax 不可用')
    }
  } catch (error: any) {
    lastResult.value = {
      type: 'error',
      message: `❌ 操作失败: ${error.message}`
    }
  } finally {
    isRendering.value = false
  }
}

const copyDebugInfo = () => {
  navigator.clipboard.writeText(debugInfo.value).then(() => {
    lastResult.value = {
      type: 'success',
      message: '✅ 调试信息已复制到剪贴板'
    }
  }).catch(() => {
    lastResult.value = {
      type: 'error',
      message: '❌ 复制失败'
    }
  })
}

onMounted(() => {
  checkStatus()
  
  // 监听 MathJax 就绪事件
  window.addEventListener('mathjax-ready', () => {
    checkStatus()
  })
})
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  max-height: 80vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.debug-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.debug-content {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.status-section,
.actions-section,
.result-section,
.info-section {
  margin-bottom: 20px;
}

h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 6px;
  font-size: 13px;
}

.status-item.success {
  background: #d4edda;
  color: #155724;
}

.status-item.error {
  background: #f8d7da;
  color: #721c24;
}

.icon {
  font-size: 16px;
}

.action-btn {
  width: 100%;
  padding: 10px 15px;
  margin: 5px 0;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: #5568d3;
}

.action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.result-message {
  padding: 10px 15px;
  border-radius: 6px;
  font-size: 13px;
}

.result-message.success {
  background: #d4edda;
  color: #155724;
}

.result-message.error {
  background: #f8d7da;
  color: #721c24;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  font-size: 11px;
  overflow-x: auto;
  margin: 0;
}

.float-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  z-index: 9999;
  transition: transform 0.2s, box-shadow 0.2s;
}

.float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

@media (max-width: 768px) {
  .debug-panel {
    width: calc(100% - 40px);
    max-height: 70vh;
  }
}
</style>
