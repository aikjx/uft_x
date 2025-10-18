import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './style.css'

// 导入插件和工具
import { registerServiceWorker } from './plugins/pwa'
import { registerDirectives } from './directives'
import errorHandler from './composables/core/useErrorHandler'
import logger from './composables/core/useLogger'

// 添加 MathJax 全局类型声明
declare global {
  interface Window {
    MathJax: any
  }
}

const app = createApp(App)

// 注册插件
app.use(createPinia())
app.use(router)

// 注册自定义指令
registerDirectives(app)

// 安装错误处理器
errorHandler.install(app)

// 日志记录
logger.info('应用启动', { version: '1.0.0' })

// 注册 Service Worker (PWA)
registerServiceWorker()

app.mount('#app')

// MathJax已在index.html中全局配置