import { useAsyncState } from '@vueuse/core';
import { CacheService, type CacheDatabase } from './CacheService';
import type { Move } from 'pokenode-ts';
import { watch, type Ref } from 'vue';
import { PokeApiService } from './PokeApiService';

type CacheDatabaseEntry = CacheDatabase['moves'];
type Entries = CacheDatabaseEntry[0];
type Filters = CacheDatabaseEntry[1];

export function useMoves(filters: Ref<Filters>) {
  const ref = useAsyncState(getMoves(filters.value), { data: new Array<Move>(), count: 0 });

  watch(filters, async (newFilters) => {
    ref.state.value = await getMoves(newFilters);
  });

  return ref;
}

async function getMoves(filters: Filters) {
  const cached = CacheService.get('moves', filters);
  if (cached) {
    return cached;
  }

  let all = CacheService.get('allMoves');
  if (all === undefined) {
    all = await PokeApiService.moves.getAll();
    CacheService.set('allMoves', all);
  }

  const filtered = filter(all, filters);
  const ordered = order(filtered, filters);
  const paginated = paginate(ordered, filters);
  const data: Entries = { data: paginated, count: ordered.length };

  CacheService.set('moves', data, filters);

  return data;
}

function filter(data: Move[], filters: Pick<Filters, 'search'>) {
  const filtered = new Array<Move>();

  for (const item of data) {
    if (filters.search !== undefined && !item.name.includes(filters.search.toLowerCase())) {
      continue;
    }

    filtered.push(item);
  }

  return filtered;
}

function order(data: Move[], filters: Pick<Filters, 'orderBy' | 'orderType'>) {
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

function paginate(data: Move[], filters: Pick<Filters, 'page' | 'take'>) {
  const page = filters.page ?? 1;
  const take = filters.take ?? 30;

  const start = (page - 1) * take;
  const end = start + take;

  const paginated = data.slice(start, end);

  return paginated;
}
