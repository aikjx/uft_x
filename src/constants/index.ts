// 应用常量定义

// API 相关常量
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const

// 路由常量
export const ROUTES = {
  HOME: '/',
  FORMULAS: '/formulas',
  FORMULA_DETAIL: '/formula/:id',
  LEARNING_PATH: '/learning-path',
  RELATIONSHIPS: '/relationships',
  ABOUT: '/about',
  NOT_FOUND: '/404'
} as const

// 主题常量
export const THEME_CONFIG = {
  STORAGE_KEY: 'utf_star_theme',
  DEFAULT_THEME: 'dark',
  THEMES: {
    LIGHT: 'light',
    DARK: 'dark'
  },
  COLORS: {
    LIGHT: {
      PRIMARY: '#1976d2',
      SECONDARY: '#26a69a',
      BACKGROUND: '#ffffff',
      SURFACE: '#f8fafc',
      TEXT: '#333333',
      TEXT_SECONDARY: '#666666'
    },
    DARK: {
      PRIMARY: '#00f5ff',
      SECONDARY: '#64ffda',
      BACKGROUND: '#0a0a0f',
      SURFACE: '#1a1a2e',
      TEXT: '#ffffff',
      TEXT_SECONDARY: '#b0bec5'
    }
  }
} as const

// 动画常量
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
} as const

// 缓存常量
export const CACHE_CONFIG = {
  KEYS: {
    FORMULAS: 'utf_star_formulas',
    CATEGORIES: 'utf_star_categories',
    USER_PREFERENCES: 'utf_star_user_prefs',
    THEME: 'utf_star_theme'
  },
  TTL: {
    SHORT: 5 * 60 * 1000,      // 5分钟
    MEDIUM: 30 * 60 * 1000,    // 30分钟
    LONG: 24 * 60 * 60 * 1000  // 24小时
  }
} as const

// 公式相关常量
export const FORMULA_CONFIG = {
  DIFFICULTY_LEVELS: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  },
  VISUALIZATION_TYPES: {
    '2D': '2d',
    '3D': '3d',
    GRAPH: 'graph',
    ANIMATION: 'animation'
  },
  RENDERERS: {
    THREE: 'three',
    CANVAS: 'canvas',
    D3: 'd3',
    SVG: 'svg'
  }
} as const

// MathJax 配置常量
export const MATHJAX_CONFIG = {
  CDN_URL: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js',
  CONFIG: {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
      packages: { '[+]': ['ams', 'newcommand', 'configmacros'] }
    },
    svg: {
      fontCache: 'global'
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'tex2jax_process'
    }
  }
} as const

// 通知配置常量
export const NOTIFICATION_CONFIG = {
  DEFAULT_DURATION: 5000,
  MAX_NOTIFICATIONS: 5,
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center'
  },
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
  }
} as const

// 性能配置常量
export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 60,
    OVERSCAN: 5,
    BUFFER_SIZE: 10
  },
  IMAGE_LAZY_LOAD: {
    ROOT_MARGIN: '50px',
    THRESHOLD: 0.1
  }
} as const

// 错误处理常量
export const ERROR_CONFIG = {
  MAX_ERROR_COUNT: 100,
  ERROR_TYPES: {
    NETWORK: 'network',
    VALIDATION: 'validation',
    RUNTIME: 'runtime',
    USER: 'user',
    SYSTEM: 'system'
  },
  HTTP_STATUS: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503
  }
} as const

// 日志配置常量
export const LOG_CONFIG = {
  LEVELS: {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
  },
  MAX_ENTRIES: 1000,
  STORAGE_KEY: 'utf_star_logs',
  DEFAULT_LEVEL: import.meta.env.DEV ? 'debug' : 'warn'
} as const

// 应用元数据
export const APP_META = {
  NAME: 'UTF Star',
  VERSION: '1.0.0',
  DESCRIPTION: '张祥前统一场论可视化平台',
  AUTHOR: '张祥前',
  KEYWORDS: ['统一场论', '物理学', '可视化', '数学公式'],
  REPOSITORY: 'https://github.com/utf-star/utf-star',
  HOMEPAGE: 'https://utf-star.com'
} as const

// 浏览器兼容性
export const BROWSER_SUPPORT = {
  MIN_VERSIONS: {
    CHROME: 88,
    FIREFOX: 85,
    SAFARI: 14,
    EDGE: 88
  },
  FEATURES: {
    WEBGL: 'webgl',
    WEBGL2: 'webgl2',
    INTERSECTION_OBSERVER: 'IntersectionObserver',
    RESIZE_OBSERVER: 'ResizeObserver',
    WEB_WORKERS: 'Worker'
  }
} as const

// 开发环境配置
export const DEV_CONFIG = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  API_MOCK: import.meta.env.VITE_API_MOCK === 'true',
  DEBUG_MODE: import.meta.env.VITE_DEBUG === 'true',
  HOT_RELOAD: import.meta.env.VITE_HMR !== 'false'
} as const

// 导出所有常量
export default {
  API_CONFIG,
  ROUTES,
  THEME_CONFIG,
  ANIMATION_CONFIG,
  CACHE_CONFIG,
  FORMULA_CONFIG,
  MATHJAX_CONFIG,
  NOTIFICATION_CONFIG,
  PERFORMANCE_CONFIG,
  ERROR_CONFIG,
  LOG_CONFIG,
  APP_META,
  BROWSER_SUPPORT,
  DEV_CONFIG
}