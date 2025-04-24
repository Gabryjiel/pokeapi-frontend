import { onMounted, ref, watch, type Ref } from 'vue';
import { PokeApiService, type MyPokemon } from './PokeApiService';
import type { Pokemon } from 'pokenode-ts';
import { useAsyncState } from '@vueuse/core';
import { getIdFromUrl } from './stringHelpers';

export function usePokemon(id: number) {
  const pokemonRef: Ref<Pokemon | undefined> = ref(undefined);

  onMounted(async () => {
    pokemonRef.value = await PokeApiService.getPokemonById(id);
  });

  return pokemonRef;
}

const getPokemon = async (page: number) => {
  const promises = Array.from({ length: 15 }).map((_, index, array) => {
    const pokemonId = 1 + index + (page - 1) * array.length;
    return PokeApiService.getPokemonById(pokemonId);
  });

  return Promise.all(promises);
};

async function getAbilities(page: number, size = 30, orderBy: AbilitiesOrder = 'name') {
  const abilityList = await PokeApiService.getAbilityList();
  const promises = abilityList.map((abilityItem) => PokeApiService.getAbilityById(getIdFromUrl(abilityItem.url)));
  const abilities = await Promise.all(promises);
  const start = (page - 1) * size;

  return abilities
    .toSorted((a, b) => {
      switch (orderBy) {
        case 'pokemonCount':
          return a.pokemon.length - b.pokemon.length;
        case 'description':
          const aText = a.flavor_text_entries.find((fte) => fte.language.name === 'en')?.flavor_text ?? '';
          const bText = b.flavor_text_entries.find((fte) => fte.language.name === 'en')?.flavor_text ?? '';
          return aText > bText ? 1 : -1;
        case 'name':
        default:
          return a.name > b.name ? 1 : -1;
      }
    })
    .slice(start, start + size);
}

type AbilitiesOrder = 'name' | 'pokemonCount' | 'description';

export function useAbilities(filters: { page: Ref<number>; size: number; orderBy: AbilitiesOrder }) {
  const dataRef = useAsyncState(getAbilities(filters.page.value, filters.size, filters.orderBy), []);

  watch(filters.page, async (newPage) => {
    dataRef.state.value = await getAbilities(newPage, filters.size, filters.orderBy);
  });

  return dataRef;
}
