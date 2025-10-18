<template>
  <div class="formula-container">
    <header class="header">
      <h1 class="title">统一场论公式集</h1>
      <p class="subtitle">算法联盟 - 宇宙物理学统一理论</p>
    </header>

    <div class="formula-grid">
      <div 
        v-for="formula in formulas" 
        :key="formula.id"
        class="formula-card"
        @click="selectFormula(formula)"
        :class="{ active: selectedFormula?.id === formula.id }"
      >
        <div class="formula-header">
          <span class="formula-number">公式 {{ formula.id }}</span>
          <span class="formula-category" :class="getCategoryClass(formula.category)">{{ formula.category }}</span>
        </div>
        <h3 class="formula-name">{{ formula.name }}</h3>
        <MathFormula 
          :formula="formula.latex" 
          :inline="false"
          color="#1a202c"
          size="medium"
        />
        <p class="formula-description">{{ formula.description }}</p>
      </div>
    </div>

    <!-- 详细信息模态框 -->
    <div v-if="selectedFormula" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">&times;</button>
        <div class="modal-header">
          <h2>公式 {{ selectedFormula.id }}: {{ selectedFormula.name }}</h2>
          <span class="modal-category" :class="getCategoryClass(selectedFormula.category)">
            {{ selectedFormula.category }}
          </span>
        </div>
        <MathFormula 
          v-if="selectedFormula"
          :formula="selectedFormula.latex" 
          :inline="false"
          color="#1a202c"
          size="large"
        />
        <div class="modal-details">
          <h4>详细说明</h4>
          <p>{{ selectedFormula.description }}</p>
        </div>
      </div>
    </div>

    <!-- 调试面板 -->
    <FormulaDebugPanel />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MathFormula from '../components/MathFormula.vue'
import FormulaDebugPanel from '../components/FormulaDebugPanel.vue'
import { formulas as formulaData } from '../data/formulas'

interface Formula {
  id: number
  name: string
  latex: string
  description: string
  category: string
  color?: string
}

const selectedFormula = ref<Formula | null>(null)
const formulas = ref<Formula[]>(formulaData)

const selectFormula = (formula: Formula) => {
  selectedFormula.value = formula
}

const closeModal = () => {
  selectedFormula.value = null
}

const getCategoryClass = (category: string) => {
  const classMap: Record<string, string> = {
    '时空理论': 'spacetime',
    '力学基础': 'force',
    '统一理论': 'unified',
    '电磁理论': 'electromagnetic',
    '应用理论': 'application'
  }
  return classMap[category] || 'default'
}
</script>

<style scoped>
.formula-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  font-weight: 300;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.formula-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  cursor: pointer;
}

.formula-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.formula-card.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px #667eea;
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.formula-number {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.formula-category {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.formula-category.spacetime {
  background: #e3f2fd;
  color: #1976d2;
}

.formula-category.force {
  background: #e8f5e8;
  color: #388e3c;
}

.formula-category.unified {
  background: #fff3e0;
  color: #f57c00;
}

.formula-category.electromagnetic {
  background: #fce4ec;
  color: #c2185b;
}

.formula-category.application {
  background: #f3e5f5;
  color: #7b1fa2;
}

.formula-category.default {
  background: #f5f5f5;
  color: #666;
}

.formula-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.formula-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-top: 1rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-header {
  margin-bottom: 2rem;
  padding-right: 3rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.modal-category {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
}

.modal-details {
  margin-top: 2rem;
}

.modal-details h4 {
  color: #333;
  margin-bottom: 0.5rem;
  margin-top: 1.5rem;
}

.modal-details p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .formula-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .modal-content {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
