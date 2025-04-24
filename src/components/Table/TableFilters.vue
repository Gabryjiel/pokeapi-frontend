<template>
  <input type="search" :value="props.search" @input="props.search = $event.target.value" />
</template>

<script setup lang="ts">
import { type MaybeRef } from 'vue';

const props = defineProps<{
  search: MaybeRef<string>;
}>();
</script>

<style scoped></style>
