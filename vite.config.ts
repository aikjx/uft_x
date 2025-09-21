import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        '@vueuse/math'
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables/**',
        'src/stores/**'
      ],
      vueTemplate: true
    }),
    Components({
      dts: 'src/components.d.ts',
      dirs: ['src/components'],
      extensions: ['vue', 'tsx'],
      deep: true
    }),
    visualizer({
      open: false,
      filename: 'dist/stats.html'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types')
    },
    extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx', '.json']
  },
  server: {
    port: 52025,
    open: true,
    cors: true,
    host: true
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['@vueuse/core', '@vueuse/math'],
          'visualization': ['three', 'd3'],
          'math': ['mathjax-full', 'lodash-es']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})