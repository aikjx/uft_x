<template>
  <ErrorBoundary>
    <div id="app" :class="{ dark: isDark }">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
      
      <!-- PWA 安装提示 -->
      <InstallPrompt />
    </div>
  </ErrorBoundary>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import ErrorBoundary from '@/components/base/ErrorBoundary.vue'
import InstallPrompt from '@/components/InstallPrompt.vue'

const { isDark } = useTheme()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
