<template>
  <div class="mathjax-debug">
    <h3>MathJax 调试信息</h3>
    <div class="debug-info">
      <p><strong>MathJax 对象存在:</strong> {{ mathJaxExists }}</p>
      <p><strong>typesetPromise 可用:</strong> {{ typesetAvailable }}</p>
      <p><strong>startup 对象存在:</strong> {{ startupExists }}</p>
      <p><strong>document 对象存在:</strong> {{ documentExists }}</p>
      <p><strong>配置信息:</strong> {{ configInfo }}</p>
    </div>
    
    <div class="test-formulas">
      <h4>测试公式:</h4>
      <div class="formula-test">
        <p>内联: <span v-html="inlineFormula"></span></p>
        <div v-html="displayFormula"></div>
      </div>
    </div>
    
    <button @click="manualRender" class="debug-btn">手动渲染</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mathJaxExists = ref(false)
const typesetAvailable = ref(false)
const startupExists = ref(false)
const documentExists = ref(false)
const configInfo = ref('')

const inlineFormula = ref('\\(E = mc^2\\)')
const displayFormula = ref('$$\\frac{d}{dx}\\int_a^x f(t)dt = f(x)$$')

const checkMathJax = () => {
  mathJaxExists.value = !!window.MathJax
  typesetAvailable.value = !!(window.MathJax && window.MathJax.typesetPromise)
  startupExists.value = !!(window.MathJax && window.MathJax.startup)
  documentExists.value = !!(window.MathJax && window.MathJax.startup && window.MathJax.startup.document)
  
  if (window.MathJax && window.MathJax.config) {
    configInfo.value = JSON.stringify(window.MathJax.config, null, 2)
  } else {
    configInfo.value = '配置不可用'
  }
}

const manualRender = async () => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    try {
      await window.MathJax.typesetPromise()
      console.log('手动渲染完成')
    } catch (error) {
      console.error('手动渲染失败:', error)
    }
  }
}

onMounted(() => {
  checkMathJax()
  
  // 定期检查状态
  const interval = setInterval(checkMathJax, 1000)
  
  // 5秒后停止检查
  setTimeout(() => {
    clearInterval(interval)
  }, 5000)
})
</script>

<style scoped>
.mathjax-debug {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: monospace;
}

.debug-info p {
  margin: 0.5rem 0;
}

.formula-test {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.debug-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.debug-btn:hover {
  background: #0056b3;
}
</style>