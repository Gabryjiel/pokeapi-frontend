<template>
  <router-link :to="props.href">
    <li>
      <div>{{ split[0] }}<strong>{{ split[1] }}</strong>{{ split[2] }}</div>
    </li>
  </router-link>
</template>

<script lang="ts" setup>
import { splitSuggestionByPhrase } from '@/lib/listHelpers';
import { computed, inject, type Ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ content: string, href: RouteLocationRaw }>()
const omniboxContent = inject<Ref<string>>('omnibox-content')

const split = computed(() => {
  return splitSuggestionByPhrase(props.content, omniboxContent?.value ?? '');
})
</script>

<style scoped>
a {
  text-decoration: none;
}

li {
  text-align: left;
  font-size: large;
  padding: 2px 0 2px 5px;
  color: black;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  &:hover {
    background-color: lightblue;
  }
}
</style>
