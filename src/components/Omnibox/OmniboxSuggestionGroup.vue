<template>
  <div class="suggestion-group" v-if="props.isVisible">
    <div class="suggestion-group-header">
      <router-link :to="props.href">{{ props.text }}</router-link>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RouteNamedMap } from 'vue-router/auto-routes';

const props = defineProps<{ href: keyof RouteNamedMap; text: string, isVisible: boolean }>();
</script>

<style scoped>
.suggestion-group {
  width: 100%;
  color: darkslategrey;
  font-size: larger;
  text-align: center;
  padding-bottom: 5px;
}

.suggestion-group-header {
  text-align: right;
  font-weight: lighter;
  font-size: smaller;
  border-bottom: 1px solid darkgray;
  padding: 0 5px;

  a {
    color: black;
    text-decoration: none;

    &:hover {
      color: gray;
    }
  }
}
</style>
