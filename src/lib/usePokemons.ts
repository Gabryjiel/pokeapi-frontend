import { useAsyncState } from '@vueuse/core';
import { watch } from 'vue';
import { mapFromPokemonToMyPokemon, PokeApiService, type MyPokemon } from './PokeApiService';
import { CacheService, type CacheDatabase } from './CacheService';
import type { Pokemon } from 'pokenode-ts';

type Filters = CacheDatabase['pokemons'][1];

export function usePokemons(filters: Filters) {
  const pokemonsRef = useAsyncState(getPokemons(filters), new Array<MyPokemon>());

  watch(filters, async (newFilters) => {
    pokemonsRef.state.value = await getPokemons(newFilters);
  });

  return pokemonsRef;
}

async function getPokemons(filters: Filters) {
  const cached = CacheService.get('pokemons', filters);
  if (cached) {
    return cached;
  }

  let allPokemons = CacheService.get('allPokemons');
  if (allPokemons === undefined) {
    allPokemons = await PokeApiService.getAllPokemons();
    CacheService.set('allPokemons', allPokemons);
  }

  const filteredPokemons = filterPokemons(allPokemons, filters);
  const orderedPokemons = orderPokemons(filteredPokemons, filters);
  const paginatedPokemons = paginatePokemons(orderedPokemons, filters);
  const mappedPokemons = paginatedPokemons.map((item) => mapFromPokemonToMyPokemon(item));

  CacheService.set('pokemons', mappedPokemons, filters);

  return mappedPokemons;
}

function filterPokemons(data: Pokemon[], filters: Pick<Filters, 'search' | 'type' | 'generation'>) {
  const filtered = new Array<Pokemon>();

  for (const item of data) {
    if (filters.search !== undefined && !item.name.includes(filters.search.toLowerCase())) {
      continue;
    } else if (
      filters.type &&
      filters.type.length > 0 &&
      !filters.type.every((filter) => item.types.some((type) => type.type.name === filter))
    ) {
      continue;
    } else if (filters.generation && !isInGeneration(filters.generation, item)) {
      continue;
    }
    filtered.push(item);
  }

  return filtered;
}

function orderPokemons(data: Pokemon[], filters: Pick<Filters, 'orderBy' | 'orderType'>) {
  const lower = filters.orderType === 'desc' ? 1 : -1;
  const higher = filters.orderType === 'desc' ? -1 : 1;

  const ordered = data.toSorted((a, b) => {
    if (filters.orderBy === 'name') {
      return a.name > b.name ? lower : higher;
    } else if (filters.orderBy === 'totalStats') {
      const aStat = a.stats.reduce((acc, cur) => cur.base_stat + acc, 0);
      const bStat = b.stats.reduce((acc, cur) => cur.base_stat + acc, 0);

      return aStat > bStat ? lower : higher;
    } else if (filters.orderBy?.startsWith('stat_')) {
      const statName = filters.orderBy.split('_').at(1);
      const aStat = a.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0;
      const bStat = b.stats.find((stat) => stat.stat.name === statName)?.base_stat ?? 0;

      return aStat > bStat ? lower : higher;
    }

    return a.id - b.id;
  });

  return ordered;
}

function paginatePokemons(data: Pokemon[], filters: Pick<Filters, 'page' | 'take'>) {
  const page = filters.page ?? 1;
  const take = filters.take ?? 10;

  const start = (page - 1) * take;
  const end = start + take;

  const paginated = data.slice(start, end);

  return paginated;
}

function isInGeneration(generationId: number, pokemon: Pokemon): boolean {
  switch (generationId) {
    case 1:
      return pokemon.sprites.versions['generation-i']['red-blue'].back_default !== null;
    case 2:
      return pokemon.sprites.versions['generation-ii']['silver'].back_default !== null;
    case 3:
      return pokemon.sprites.versions['generation-iii']['ruby-sapphire'].front_default !== null;
    case 4:
      return pokemon.sprites.versions['generation-iv']['platinum'].back_default !== null;
    case 5:
      return pokemon.sprites.versions['generation-v']['black-white'].back_default !== null;
    case 6:
      return pokemon.sprites.versions['generation-vi']['x-y'].front_default !== null;
    case 7:
      return pokemon.sprites.versions['generation-vii']['ultra-sun-ultra-moon'].front_default !== null;
    case 8:
      return pokemon.sprites.versions['generation-viii']['icons'].front_default !== null;
    default:
      return false;
  }
}
