import type { OrderType } from './useTableParams';
import type { MyPokemon } from './PokeApiService';
import type { Ability, Move, Nature, Pokemon, Type } from 'pokenode-ts';
import { useAsyncState } from '@vueuse/core';

type OrderFilters = { orderBy?: string; orderType?: OrderType };
type TableFilters = { take?: number; page?: number; search?: string } & OrderFilters;
type WithCount<T> = { data: T[]; count: number };

export type CacheDatabase = {
  allPokemons: [Pokemon[], null];
  allAbilities: [Ability[], null];
  allMoves: [Move[], null];
  allTypes: [Type[], null];
  pokemon: [MyPokemon, { id: number }];
  pokemons: [MyPokemon[], TableFilters & { type?: string[]; generation?: number }];
  abilities: [Ability[], TableFilters];
  moves: [WithCount<Move>, TableFilters & { type?: string; category?: string }];
  natures: [Nature[], TableFilters];
  types: [Type[], OrderFilters & { search?: string }];
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
  if (filters == undefined) {
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
    CacheService.set(table, result, filters);
    return result;
  };

  return useAsyncState(getter, initialState);
}
