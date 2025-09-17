/**
 * 公式相关组合式函数
 */
import { ref, computed, watch } from 'vue'
import { useFormulasStore } from '@/stores/formulas'
import type { Formula, FormulaParameter } from '@/types/formula'

export function useFormula(formulaId?: string) {
  const formulasStore = useFormulasStore()
  
  const currentFormula = ref<Formula | null>(null)
  const parameters = ref<Record<string, number>>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // 加载公式
  const loadFormula = async (id: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      await formulasStore.loadFormulas()
      const formula = formulasStore.getFormulaById(id)
      
      if (!formula) {
        throw new Error(`公式 ${id} 未找到`)
      }
      
      currentFormula.value = formula
      
      // 初始化参数默认值
      const defaultParams: Record<string, number> = {}
      formula.parameters.forEach(param => {
        defaultParams[param.symbol] = param.defaultValue
      })
      parameters.value = defaultParams
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载公式失败'
    } finally {
      isLoading.value = false
    }
  }
  
  // 更新参数
  const updateParameter = (symbol: string, value: number) => {
    if (currentFormula.value) {
      const param = currentFormula.value.parameters.find(p => p.symbol === symbol)
      if (param) {
        // 验证参数范围
        const clampedValue = Math.max(param.min, Math.min(param.max, value))
        parameters.value[symbol] = clampedValue
      }
    }
  }
  
  // 重置参数
  const resetParameters = () => {
    if (currentFormula.value) {
      const defaultParams: Record<string, number> = {}
      currentFormula.value.parameters.forEach(param => {
        defaultParams[param.symbol] = param.defaultValue
      })
      parameters.value = defaultParams
    }
  }
  
  // 计算公式结果
  const calculateResult = computed(() => {
    if (!currentFormula.value) return null
    
    try {
      // 这里应该根据具体公式实现计算逻辑
      // 暂时返回参数值的简单组合
      return Object.values(parameters.value).reduce((sum, val) => sum + val, 0)
    } catch (err) {
      console.error('计算公式结果失败:', err)
      return null
    }
  })
  
  // 获取参数信息
  const getParameterInfo = (symbol: string): FormulaParameter | null => {
    if (!currentFormula.value) return null
    return currentFormula.value.parameters.find(p => p.symbol === symbol) || null
  }
  
  // 验证参数
  const validateParameter = (symbol: string, value: number): boolean => {
    const param = getParameterInfo(symbol)
    if (!param) return false
    return value >= param.min && value <= param.max
  }
  
  // 获取相关公式
  const getRelatedFormulas = computed(() => {
    if (!currentFormula.value) return []
    return currentFormula.value.relatedFormulas?.map(id => 
      formulasStore.getFormulaById(id)
    ).filter(Boolean) || []
  })
  
  // 自动加载公式（如果提供了ID）
  if (formulaId) {
    loadFormula(formulaId)
  }
  
  return {
    currentFormula,
    parameters,
    isLoading,
    error,
    calculateResult,
    getRelatedFormulas,
    loadFormula,
    updateParameter,
    resetParameters,
    getParameterInfo,
    validateParameter
  }
}

// 公式搜索组合式函数
export function useFormulaSearch() {
  const formulasStore = useFormulasStore()
  
  const searchQuery = ref('')
  const selectedCategory = ref<string>('')
  const selectedDifficulty = ref<string>('')
  const searchResults = ref<Formula[]>([])
  
  // 执行搜索
  const search = () => {
    let results = formulasStore.allFormulas
    
    // 按关键词搜索
    if (searchQuery.value.trim()) {
      results = formulasStore.searchFormulas(searchQuery.value.trim())
    }
    
    // 按分类过滤
    if (selectedCategory.value) {
      results = results.filter(formula => formula.categoryId === selectedCategory.value)
    }
    
    // 按难度过滤
    if (selectedDifficulty.value) {
      results = results.filter(formula => formula.difficulty === selectedDifficulty.value)
    }
    
    searchResults.value = results
  }
  
  // 清除搜索
  const clearSearch = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
    selectedDifficulty.value = ''
    searchResults.value = []
  }
  
  // 监听搜索条件变化
  watch([searchQuery, selectedCategory, selectedDifficulty], search, { immediate: true })
  
  return {
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    searchResults,
    search,
    clearSearch
  }
}