<script setup lang="ts">
import { RouterView } from 'vue-router'
import Sidebar from './components/Sidebar/Sidebar.vue';
</script>

<template>
  <Sidebar />
  <div id="container">
    <RouterView />
  </div>
</template>

<style scoped>
#container {
  flex: 1 0 0;
}
</style>
