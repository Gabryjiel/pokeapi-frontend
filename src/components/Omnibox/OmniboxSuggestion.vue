<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ content: string, href: RouteLocationRaw }>()
</script>

<template>
  <router-link :to="props.href">
    <li>{{ props.content }}</li>
  </router-link>
</template>

<style scoped>
a {
  text-decoration: none;
}

li {
  text-align: left;
  font-size: large;
  padding: 2px 0 2px 5px;
  color: black;

  &:hover {
    background-color: lightblue;
  }
}
</style>
