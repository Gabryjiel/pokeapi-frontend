import type { OrderType } from './useTableParams';
import type { MyPokemon } from './PokeApiService';
import type { Ability, Move, Nature, Pokemon } from 'pokenode-ts';
import { useAsyncState } from '@vueuse/core';

type TableFilters = { take?: number; page?: number; orderBy?: string; orderType?: OrderType; search?: string };

export type CacheDatabase = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  allPokemons: [Pokemon[], {}];
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  allAbilities: [Ability[], {}];
  pokemon: [MyPokemon, { id: number }];
  pokemons: [MyPokemon[], TableFilters & { type?: string[]; generation?: number }];
  abilities: [Ability[], TableFilters];
  moves: [Move[], TableFilters];
  natures: [Nature[], TableFilters];
};

const cache = new Map<string, unknown>();

window.cache = cache;

export const CacheService = {
  get: <Table extends keyof CacheDatabase>(table: Table, filters?: CacheDatabase[Table][1]) => {
    const cacheKey = createCacheKey(table, filters);
    const cacheData = cache.get(cacheKey) as CacheDatabase[Table][0] | undefined;

    return cacheData;
  },

  set: <Table extends keyof CacheDatabase>(
    table: Table,
    data: CacheDatabase[Table][0],
    filters?: CacheDatabase[Table][1],
  ) => {
    const cacheKey = createCacheKey(table, filters);
    cache.set(cacheKey, data);
  },
};

function createCacheKey<Table extends keyof CacheDatabase>(table: Table, filters?: CacheDatabase[Table][1]) {
  let cacheKey: string = table;

  if (filters !== undefined) {
    const serializedFilters = serializeFilters(filters);
    if (serializedFilters.length > 0) {
      cacheKey += `-${serializedFilters}`;
    }
  }

  return cacheKey;
}

function serializeFilters(filters?: CacheDatabase[keyof CacheDatabase][1]): string {
  if (filters === undefined) {
    return '';
  }

  const keys = Object.keys(filters)
    .filter((key) => {
      const k = key as keyof typeof filters;
      const value = filters[k] as number | string | boolean;

      if (!value) {
        return false;
      } else if (k === 'page' && value === 1) {
        return false;
      } else {
        return true;
      }
    })
    .toSorted()
    .map((key) => {
      const k = key as keyof typeof filters;
      const value = filters[k] as number | string | boolean;
      return `${key}-${value}`;
    });

  return keys.join(',');
}

export function useCache<TTable extends keyof CacheDatabase>(
  table: TTable,
  filters: CacheDatabase[TTable][1],
  dataGetter: (filters?: CacheDatabase[TTable][1]) => Promise<CacheDatabase[TTable][0]>,
  initialState: CacheDatabase[TTable][0],
) {
  const getter = async () => {
    const cached = CacheService.get(table, filters);

    if (cached) {
      return cached;
    }

    const result = await dataGetter(filters);
    CacheService.set(table, filters, result);
    return result;
  };

  return useAsyncState(getter, initialState);
}
