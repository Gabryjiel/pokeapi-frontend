<template>
  <router-link :to="props.href">
    <li>
      <div>{{ split[0] }}<strong>{{ split[1] }}</strong>{{ split[2] }}</div>
      <div class="pokemon-types">
        <span v-if="pokemon === null">Loading...</span>
        <PokemonType v-for="type in pokemon?.types" :type="type.type.name" :typeNo="getIdFromUrl(type.type.url)"
          :key="type.type.name" />
      </div>
    </li>
  </router-link>
</template>

<script lang="ts" setup>
import { ApiClient } from '@/lib/apiClient';
import type { Pokemon } from 'pokenode-ts';
import { computed, inject, onMounted, ref, type Ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import PokemonType from '../PokemonType.vue';
import { splitSuggestionByPhrase } from '@/lib/listHelpers';
import { getIdFromUrl } from '@/lib/stringHelpers';

const props = defineProps<{ pokemonId: number, content: string, href: RouteLocationRaw }>()
const pokemon = ref<Pokemon | null>(null);
const omniboxContent = inject<Ref<string>>('omnibox-content')

const split = computed(() => {
  return splitSuggestionByPhrase(props.content, omniboxContent?.value ?? '');
})

onMounted(async () => {
  pokemon.value = await ApiClient.pokemon.getPokemonById(props.pokemonId)
})
</script>

<style scoped>
a {
  text-decoration: none;
}

li {
  text-align: left;
  font-size: medium;
  padding: 5px 0 0px 5px;
  color: black;
  display: flex;
  justify-content: space-between;

  &:hover {
    background-color: lightblue;
  }
}

.pokemon-types {
  display: flex;
  gap: 5px;
  padding-right: 5px;
}
</style>
