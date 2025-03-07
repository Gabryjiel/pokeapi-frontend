import { CacheService } from './CacheService';

type RequestAddons<T, K> = {
  map: (json: T) => K;
};

export const FetchService = {
  withCache: async <T = unknown, K = T>(url: string, init?: RequestInit & RequestAddons<T, K>): Promise<K> => {
    const cached = await CacheService.get(url);

    if (cached !== undefined) {
      return cached;
    }

    const response = await fetch(url, init);
    const json = (await response.json()) as T;
    const mapped = init?.map(json) ?? (json as unknown as K);

    CacheService.set(url, mapped);
    return mapped;
  },
};
