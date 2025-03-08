<template>
  <RouterLink :to="props.href">
    <div class="sidebar-element">
      <span>{{ props.label }}</span>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ label: string; href: RouteLocationRaw }>();
</script>

<style scoped>
a {
  text-decoration: none;
}

.sidebar-element {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: start;
  color: black;
  background-color: steelblue;
  border-bottom: 1px solid black;

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
