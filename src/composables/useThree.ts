/**
 * Three.js 组合式函数
 */
import { ref, onMounted, onUnmounted, Ref } from 'vue'
import * as THREE from 'three'
import { createOptimizedRenderer, optimizeScene, ThreePerformanceMonitor } from '@/utils/three-helpers'

export interface UseThreeOptions {
  antialias?: boolean
  alpha?: boolean
  powerPreference?: 'default' | 'high-performance' | 'low-power'
  enableShadows?: boolean
  enableControls?: boolean
}

export function useThree(container: Ref<HTMLElement | null>, options: UseThreeOptions = {}) {
  const scene = ref<THREE.Scene>()
  const camera = ref<THREE.PerspectiveCamera>()
  const renderer = ref<THREE.WebGLRenderer>()
  const controls = ref<any>()
  const performanceMonitor = ref<ThreePerformanceMonitor>()
  
  const isInitialized = ref(false)
  const isAnimating = ref(false)
  
  let animationId: number | null = null
  
  // 初始化Three.js
  const init = () => {
    if (!container.value) return
    
    // 创建场景
    scene.value = new THREE.Scene()
    scene.value.background = new THREE.Color(0x000011)
    
    // 创建相机
    const aspect = container.value.clientWidth / container.value.clientHeight
    camera.value = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
    camera.value.position.set(0, 0, 5)
    
    // 创建渲染器
    renderer.value = createOptimizedRenderer()
    renderer.value.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // 启用阴影
    if (options.enableShadows) {
      renderer.value.shadowMap.enabled = true
      renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
    }
    
    container.value.appendChild(renderer.value.domElement)
    
    // 创建性能监控器
    performanceMonitor.value = new ThreePerformanceMonitor(renderer.value)
    
    // 优化场景
    optimizeScene(scene.value)
    
    isInitialized.value = true
  }
  
  // 渲染循环
  const animate = () => {
    if (!isAnimating.value || !scene.value || !camera.value || !renderer.value) return
    
    animationId = requestAnimationFrame(animate)
    
    // 更新控制器
    if (controls.value && controls.value.update) {
      controls.value.update()
    }
    
    // 渲染场景
    renderer.value.render(scene.value, camera.value)
  }
  
  // 开始动画
  const startAnimation = () => {
    if (!isAnimating.value) {
      isAnimating.value = true
      animate()
    }
  }
  
  // 停止动画
  const stopAnimation = () => {
    isAnimating.value = false
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }
  
  // 调整大小
  const resize = () => {
    if (!container.value || !camera.value || !renderer.value) return
    
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    
    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  
  // 添加对象到场景
  const addToScene = (object: THREE.Object3D) => {
    if (scene.value) {
      scene.value.add(object)
    }
  }
  
  // 从场景移除对象
  const removeFromScene = (object: THREE.Object3D) => {
    if (scene.value) {
      scene.value.remove(object)
    }
  }
  
  // 清理资源
  const dispose = () => {
    stopAnimation()
    
    if (scene.value) {
      scene.value.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
    
    if (renderer.value) {
      renderer.value.dispose()
      if (container.value && renderer.value.domElement.parentNode) {
        container.value.removeChild(renderer.value.domElement)
      }
    }
    
    if (controls.value && controls.value.dispose) {
      controls.value.dispose()
    }
  }
  
  // 获取性能统计
  const getPerformanceStats = () => {
    return performanceMonitor.value?.getStats() || null
  }
  
  onMounted(() => {
    init()
    window.addEventListener('resize', resize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    dispose()
  })
  
  return {
    scene,
    camera,
    renderer,
    controls,
    isInitialized,
    isAnimating,
    init,
    startAnimation,
    stopAnimation,
    resize,
    addToScene,
    removeFromScene,
    dispose,
    getPerformanceStats
  }
}