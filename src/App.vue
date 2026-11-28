<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { createScene } from './three/scene.js'

const canvas = ref(null)
let scene = null

onMounted(() => {
  scene = createScene(canvas.value)
})

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})
</script>

<template>
  <canvas ref="canvas" class="webgl" aria-hidden="true"></canvas>
  <main class="content">
    <RouterView />
  </main>
</template>

<style scoped>
.webgl {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  display: block;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
}
</style>
