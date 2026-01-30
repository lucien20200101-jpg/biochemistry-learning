<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">计数：{{ count }}</button>
    <p>
      编辑
      <code>components/HelloWorld.vue</code> 以测试热更新
    </p>
  </div>

  <p>
    查看
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >，Vue + Vite 官方脚手架
  </p>
  <p>
    在
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue 文档工具指南</a
    >
    中了解更多 IDE 支持信息。
  </p>
  <p class="read-the-docs">点击 Vite 和 Vue 图标了解更多</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
