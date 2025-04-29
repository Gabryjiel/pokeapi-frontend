import { useAsyncState } from '@vueuse/core';
import { CacheService, type CacheDatabase } from './CacheService';
import type { Type } from 'pokenode-ts';
import { watch } from 'vue';
import { PokeApiService } from './PokeApiService';

type Filters = CacheDatabase['types'][1];

export function useTypes(filters: Filters) {
  const ref = useAsyncState(getTypes({}), new Array<Type>());

  watch(filters, async (newFilters) => {
    ref.state.value = await getTypes(newFilters);
  });

  return ref;
}

async function getTypes(filters: Filters) {
  const cached = CacheService.get('types', filters);
  if (cached) {
    return cached;
  }

  let all = CacheService.get('allTypes');
  if (all === undefined) {
    all = await PokeApiService.getAllTypes();
    CacheService.set('allTypes', all);
  }

  const filtered = filter(all, filters);
  const ordered = order(filtered, filters);
  const mapped = ordered.map((item) => item);

  CacheService.set('types', mapped, filters);

  return mapped;
}

function filter(data: Type[], filters: Filters) {
  const filtered = new Array<Type>();

  for (const item of data) {
    if (filters.search !== undefined && !item.name.includes(filters.search.toLowerCase())) {
      continue;
    }

    filtered.push(item);
  }

  return filtered;
}

function order(data: Type[], filters: Pick<Filters, 'orderBy' | 'orderType'>) {
  const lower = filters.orderType === 'desc' ? 1 : -1;
  const higher = filters.orderType === 'desc' ? -1 : 1;

  const ordered = data.toSorted((a, b) => {
    if (filters.orderBy === 'name') {
      return a.name > b.name ? lower : higher;
    }

    return a.id - b.id;
  });

  return ordered;
}
