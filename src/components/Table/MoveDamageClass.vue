<template>
  <img :src="src" :alt="alt" height="20px" :title="alt" />
</template>

<script setup lang="ts">
import { getDamageClassImage, type MoveDamageClass } from '@/lib/imageServices';
import { capitalize } from '@/lib/stringHelpers';

const props = defineProps<{ moveDamageClass: MoveDamageClass }>();
const src = getDamageClassImage(props.moveDamageClass);
const alt = capitalize(props.moveDamageClass);
</script>

<style scoped></style>
