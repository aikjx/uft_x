/**
 * Three.js 优化工具函数
 */
import * as THREE from 'three'

// 几何体优化
export function optimizeGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  // 合并顶点
  geometry.mergeVertices()
  
  // 计算法线
  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals()
  }
  
  // 计算边界球
  geometry.computeBoundingSphere()
  
  return geometry
}

// 材质优化
export function createOptimizedMaterial(options: {
  color?: number
  transparent?: boolean
  opacity?: number
  wireframe?: boolean
}): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: options.color || 0x00ff00,
    transparent: options.transparent || false,
    opacity: options.opacity || 1,
    wireframe: options.wireframe || false,
    // 性能优化选项
    flatShading: false,
    vertexColors: false,
    fog: true
  })
}

// 纹理优化
export function optimizeTexture(texture: THREE.Texture): THREE.Texture {
  // 设置过滤器
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  
  // 设置包装模式
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  
  // 生成mipmap
  texture.generateMipmaps = true
  
  return texture
}

// 场景优化
export function optimizeScene(scene: THREE.Scene): void {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      // 启用视锥体剔除
      object.frustumCulled = true
      
      // 设置渲染顺序
      if (object.material instanceof THREE.Material && object.material.transparent) {
        object.renderOrder = 1
      }
      
      // 优化几何体
      if (object.geometry instanceof THREE.BufferGeometry) {
        optimizeGeometry(object.geometry)
      }
    }
  })
}

// 渲染器优化
export function createOptimizedRenderer(canvas?: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  
  // 启用阴影
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  
  // 设置色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  
  // 启用物理正确的光照
  renderer.physicallyCorrectLights = true
  
  return renderer
}

// 相机控制优化
export function createOptimizedControls(camera: THREE.Camera, domElement: HTMLElement): any {
  // 这里需要导入OrbitControls
  // import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
  // const controls = new OrbitControls(camera, domElement)
  
  // 优化设置
  // controls.enableDamping = true
  // controls.dampingFactor = 0.05
  // controls.screenSpacePanning = false
  // controls.minDistance = 1
  // controls.maxDistance = 100
  // controls.maxPolarAngle = Math.PI / 2
  
  // return controls
}

// 性能监控
export class ThreePerformanceMonitor {
  private renderer: THREE.WebGLRenderer
  private info: THREE.WebGLInfo
  
  constructor(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer
    this.info = renderer.info
  }
  
  getStats() {
    return {
      geometries: this.info.memory.geometries,
      textures: this.info.memory.textures,
      calls: this.info.render.calls,
      triangles: this.info.render.triangles,
      points: this.info.render.points,
      lines: this.info.render.lines
    }
  }
  
  reset() {
    this.info.reset()
  }
}

// LOD (Level of Detail) 助手
export function createLODObject(
  highDetail: THREE.Object3D,
  mediumDetail: THREE.Object3D,
  lowDetail: THREE.Object3D
): THREE.LOD {
  const lod = new THREE.LOD()
  
  lod.addLevel(highDetail, 0)
  lod.addLevel(mediumDetail, 50)
  lod.addLevel(lowDetail, 100)
  
  return lod
}

// 实例化网格优化
export function createInstancedMesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  count: number
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  
  // 设置实例矩阵
  const matrix = new THREE.Matrix4()
  for (let i = 0; i < count; i++) {
    matrix.setPosition(
      Math.random() * 100 - 50,
      Math.random() * 100 - 50,
      Math.random() * 100 - 50
    )
    mesh.setMatrixAt(i, matrix)
  }
  
  mesh.instanceMatrix.needsUpdate = true
  
  return mesh
}