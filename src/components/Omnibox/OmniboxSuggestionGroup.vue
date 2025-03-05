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
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ href: RouteLocationRaw; text: string, isVisible: boolean }>();
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
  text-align: left;
  font-weight: lighter;
  font-size: small;
  border-bottom: 1px solid darkgray;
  padding: 0 5px;

  a {
    color: darkslateblue;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      color: slateblue;
    }
  }
}
</style>
