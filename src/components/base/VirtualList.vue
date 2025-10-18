<template>
  <div ref="containerRef" class="virtual-list" @scroll="handleScroll">
    <div class="virtual-list-phantom" :style="{ height: `${totalHeight}px` }"></div>
    <div class="virtual-list-content" :style="{ transform: `translateY(${offset}px)` }">
      <div
        v-for="item in visibleData"
        :key="item.index"
        class="virtual-list-item"
      >
        <slot :item="item.data" :index="item.index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
interface Props {
  items: T[]
  itemHeight: number
  bufferSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  bufferSize: 5
})

const containerRef = ref<HTMLElement>()
const scrollTop = ref(0)
const containerHeight = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleCount = computed(() => 
  Math.ceil(containerHeight.value / props.itemHeight)
)

const startIndex = computed(() => 
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.bufferSize)
)

const endIndex = computed(() => 
  Math.min(
    props.items.length,
    startIndex.value + visibleCount.value + props.bufferSize * 2
  )
)

const visibleData = computed(() => 
  props.items.slice(startIndex.value, endIndex.value).map((data, i) => ({
    data,
    index: startIndex.value + i
  }))
)

const offset = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

onMounted(() => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
})
</script>

<style scoped>
.virtual-list {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>
