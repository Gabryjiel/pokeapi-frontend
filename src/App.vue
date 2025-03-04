<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <div id="container">
    <RouterView />
  </div>
</template>

<style scoped>
#container {
  flex: 1 0 0;
}
</style>
