import { onMounted, ref, watch, type Ref } from 'vue';
import { PokemonService, type MyPokemon } from './PokemonService';
import type { Pokemon } from 'pokenode-ts';
import { useAsyncState } from '@vueuse/core';

export function usePokemon(id: number) {
  const pokemonRef: Ref<Pokemon | undefined> = ref(undefined);

  onMounted(async () => {
    pokemonRef.value = await PokemonService.getPokemonById(id);
  });

  return pokemonRef;
}

const getPokemon = async (page: number) => {
  const promises = Array.from({ length: 15 }).map((_, index, array) => {
    const pokemonId = 1 + index + (page - 1) * array.length;
    return PokemonService.getPokemonById(pokemonId);
  });

  return Promise.all(promises);
};

export function usePokemons(filters: { page: Ref<number> }) {
  const pokemonsRef = useAsyncState(getPokemon(filters.page.value), new Array<MyPokemon>());

  watch(filters.page, async (newPage) => {
    pokemonsRef.state.value = await getPokemon(newPage);
  });

  return pokemonsRef;
}

async function getAbilities(page: number) {
  const promises = Array.from({ length: 15 }).map((_, index, array) => {
    const id = 1 + index + (page - 1) * array.length;
    return PokemonService.getAbilityById(id);
  });

  return Promise.all(promises);
}

export function useAbilities(filters: { page: Ref<number> }) {
  const dataRef = useAsyncState(getAbilities(filters.page.value), []);

  watch(filters.page, async (newPage) => {
    dataRef.state.value = await getAbilities(newPage);
  });

  return dataRef;
}
