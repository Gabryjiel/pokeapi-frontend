import { useAsyncState } from '@vueuse/core';
import { CacheService, type CacheDatabase } from './CacheService';
import type { Ability } from 'pokenode-ts';
import { watch } from 'vue';
import { PokeApiService } from './PokeApiService';

type Filters = CacheDatabase['abilities'][1];

export function useAbilities(filters: Filters) {
  const ref = useAsyncState(getAbilities({}), new Array<Ability>());

  watch(filters, async (newFilters) => {
    ref.state.value = await getAbilities(newFilters);
  });

  return ref;
}

async function getAbilities(filters: Filters) {
  const cached = CacheService.get('abilities', filters);
  if (cached) {
    return cached;
  }

  let all = CacheService.get('allAbilities');
  if (all === undefined) {
    all = await PokeApiService.getAllAbilities();
    CacheService.set('allAbilities', all);
  }

  const filtered = filter(all, filters);
  const ordered = order(filtered, filters);
  const paginated = paginate(ordered, filters);
  const mapped = paginated.map((item) => item);

  CacheService.set('abilities', mapped, filters);

  return mapped;
}

function filter(data: Ability[], filters: Pick<Filters, 'search'>) {
  const filtered = new Array<Ability>();

  for (const item of data) {
    if (filters.search !== undefined && !item.name.includes(filters.search.toLowerCase())) {
      continue;
    }

    filtered.push(item);
  }

  return filtered;
}

function order(data: Ability[], filters: Pick<Filters, 'orderBy' | 'orderType'>) {
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

function paginate(data: Ability[], filters: Pick<Filters, 'page' | 'take'>) {
  const page = filters.page ?? 1;
  const take = filters.take ?? 30;

  const start = (page - 1) * take;
  const end = start + take;

  const paginated = data.slice(start, end);

  return paginated;
}
