<template>
  <router-link :to="props.href">
    <li>
      <div>{{ props.content }}</div>
      <div class="pokemon-types">
        <span v-if="pokemon === null">Loading...</span>
        <PokemonType v-for="type in pokemon?.types" :type="type.type.name" :key="type.type.name" />
      </div>
    </li>
  </router-link>
</template>

<script lang="ts" setup>
import { ApiClient } from '@/lib/apiClient';
import type { Pokemon } from 'pokenode-ts';
import { onMounted, ref } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import PokemonType from '../PokemonType.vue';

const props = defineProps<{ pokemonId: number, content: string, href: RouteLocationRaw }>()
const pokemon = ref<Pokemon | null>(null);

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
  font-size: large;
  padding: 2px 0 2px 5px;
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
}
</style>
