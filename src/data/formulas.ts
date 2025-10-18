import type { SimpleFormula, FormulaCategory } from '../types/simple-formula'

/**
 * 统一场论公式集
 * 所有公式使用标准 LaTeX 语法，完美兼容 MathJax
 * 使用 $ ... $ 包裹，组件会自动处理定界符
 */
export const formulas: SimpleFormula[] = [
  // ==================== 时空理论 ====================
  {
    id: 1,
    name: "时空同一化方程",
    description: "描述时空的统一性，将时间和空间统一在一个方程中，表明时空是一个不可分割的整体",
    latex: "$\\vec{r}(t) = \\vec{C}t = x\\vec{i} + y\\vec{j} + z\\vec{k}$",
    category: "时空理论",
    color: "#3B82F6"
  },
  {
    id: 2,
    name: "三维螺旋时空方程",
    description: "描述三维空间中的螺旋时空结构，揭示了宇宙中普遍存在的螺旋运动模式",
    latex: "$\\vec{r}(t) = r\\cos(\\omega t) \\vec{i} + r\\sin(\\omega t) \\vec{j} + ht \\vec{k}$",
    category: "时空理论",
    color: "#3B82F6"
  },

  // ==================== 力学基础 ====================
  {
    id: 3,
    name: "质量定义方程",
    description: "从空间密度变化角度重新定义质量，揭示质量的几何本质",
    latex: "$m = k \\cdot \\frac{dn}{d\\Omega}$",
    category: "力学基础",
    color: "#10B981"
  },
  {
    id: 4,
    name: "引力场定义方程",
    description: "将引力场表示为空间密度梯度，提供引力的几何解释",
    latex: "$\\vec{A} = -Gk \\frac{\\Delta n}{\\Delta s} \\frac{\\vec{r}}{r}$",
    category: "力学基础",
    color: "#10B981"
  },
  {
    id: 5,
    name: "静止动量方程",
    description: "描述静止状态下的动量，揭示静止是相对的概念",
    latex: "$\\vec{p}_0 = m_0 \\vec{C}_0$",
    category: "力学基础",
    color: "#10B981"
  },
  {
    id: 6,
    name: "运动动量方程",
    description: "描述运动状态下的广义动量，动量是时空运动与物质运动的相互作用",
    latex: "$\\vec{P} = m(\\vec{C} - \\vec{V})$",
    category: "力学基础",
    color: "#10B981"
  },

  // ==================== 统一理论 ====================
  {
    id: 7,
    name: "宇宙大统一方程（力方程）",
    description: "统一描述宇宙中所有力的基本方程，所有力都源于时空结构的变化",
    latex: "$\\vec{F} = \\frac{d\\vec{P}}{dt} = \\vec{C}\\frac{dm}{dt} - \\vec{V}\\frac{dm}{dt} + m\\frac{d\\vec{C}}{dt} - m\\frac{d\\vec{V}}{dt}$",
    category: "统一理论",
    color: "#F59E0B"
  },
  {
    id: 8,
    name: "空间波动方程",
    description: "描述空间的波动性质，空间不是静态背景而是动态的物理实体",
    latex: "$\\frac{\\partial^2 L}{\\partial x^2} + \\frac{\\partial^2 L}{\\partial y^2} + \\frac{\\partial^2 L}{\\partial z^2} = \\frac{1}{c^2} \\frac{\\partial^2 L}{\\partial t^2}$",
    category: "统一理论",
    color: "#F59E0B"
  },

  // ==================== 电磁理论 ====================
  {
    id: 9,
    name: "电荷定义方程",
    description: "从几何角度定义电荷，电荷是空间几何结构的表现",
    latex: "$q = k'k \\frac{1}{\\Omega^2} \\frac{d\\Omega}{dt}$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 10,
    name: "电场定义方程",
    description: "定义电场强度，电场是空间几何扭曲的表现",
    latex: "$\\vec{E} = -\\frac{kk'}{4\\pi\\epsilon_0\\Omega^2}\\frac{d\\Omega}{dt}\\frac{\\vec{r}}{r^3}$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 11,
    name: "磁场定义方程",
    description: "定义磁场强度，磁场体现时空的相对论性质",
    latex: "$\\vec{B} = \\frac{\\mu_0 \\gamma kk'}{4\\pi\\Omega^2} \\frac{d\\Omega}{dt} \\frac{[(x-vt)\\vec{i} + y\\vec{j} + z\\vec{k}]}{[\\gamma^2(x-vt)^2 + y^2 + z^2]^{3/2}}$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 12,
    name: "变化的引力场产生电磁场",
    description: "描述引力场变化如何产生电磁场，揭示引力与电磁力的统一性",
    latex: "$\\frac{\\partial^2\\vec{A}}{\\partial t^2} = \\frac{\\vec{V}}{f}(\\nabla \\cdot \\vec{E}) - \\frac{C^2}{f}(\\nabla \\times \\vec{B})$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 13,
    name: "磁矢势方程",
    description: "描述磁矢势与磁场的关系，磁矢势是更基本的物理量",
    latex: "$\\nabla \\times \\vec{A} = \\frac{\\vec{B}}{f}$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 14,
    name: "变化的引力场产生电场",
    description: "时变引力场能够诱导电场，类似于法拉第电磁感应定律",
    latex: "$\\vec{E} = -f \\frac{d\\vec{A}}{dt}$",
    category: "电磁理论",
    color: "#EF4444"
  },
  {
    id: 15,
    name: "变化的磁场产生引力场和电场",
    description: "变化的磁场不仅产生电场，还能产生引力场效应",
    latex: "$\\frac{d\\vec{B}}{dt} = \\frac{-\\vec{A} \\times \\vec{E}}{c^2} - \\frac{\\vec{V}}{c^2} \\times \\frac{d\\vec{E}}{dt}$",
    category: "电磁理论",
    color: "#EF4444"
  },

  // ==================== 应用理论 ====================
  {
    id: 16,
    name: "统一场论能量方程",
    description: "质能关系的统一表达，能量和质量是同一物理实体的不同表现",
    latex: "$E = m_0c^2 = mc^2\\sqrt{1 - \\frac{v^2}{c^2}}$",
    category: "应用理论",
    color: "#8B5CF6"
  },
  {
    id: 17,
    name: "光速飞行器动力学方程",
    description: "描述接近光速运动的推进力方程，在接近光速时推进力主要用于改变相对论质量",
    latex: "$\\vec{F} = (\\vec{C} - \\vec{V}) \\frac{dm}{dt}$",
    category: "应用理论",
    color: "#8B5CF6"
  }
]

/**
 * 公式分类统计
 */
export const categories: FormulaCategory[] = [
  { name: "时空理论", color: "#3B82F6", count: 2 },
  { name: "力学基础", color: "#10B981", count: 4 },
  { name: "统一理论", color: "#F59E0B", count: 2 },
  { name: "电磁理论", color: "#EF4444", count: 7 },
  { name: "应用理论", color: "#8B5CF6", count: 2 }
]

/**
 * 获取指定分类的公式
 */
export function getFormulasByCategory(category: string): SimpleFormula[] {
  return formulas.filter(f => f.category === category)
}

/**
 * 根据 ID 获取公式
 */
export function getFormulaById(id: number): SimpleFormula | undefined {
  return formulas.find(f => f.id === id)
}

/**
 * 搜索公式（按名称或描述）
 */
export function searchFormulas(keyword: string): SimpleFormula[] {
  const lowerKeyword = keyword.toLowerCase()
  return formulas.filter(f =>
    f.name.toLowerCase().includes(lowerKeyword) ||
    f.description.toLowerCase().includes(lowerKeyword)
  )
}