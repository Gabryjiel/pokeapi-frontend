<template>
  <div class="sidebar-group">
    <div class="sidebar-group-header">
      <span>{{ props.headerText }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ headerText: string }>();

</script>

<style scoped>
.sidebar-group {
  display: flex;
  flex-direction: column;
}

.sidebar-group-header {
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  padding: 10px 0 10px 10px;
  font-weight: bold;
  background-color: steelblue;
}
</style>
