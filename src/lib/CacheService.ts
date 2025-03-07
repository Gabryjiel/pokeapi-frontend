import { del, get, set } from 'idb-keyval';

export const CacheService = {
  async set(key: string, value: unknown) {
    set(key, value);
  },

  async get(key: string) {
    const value = await get(key);

    if (!value) {
      return;
    }

    return value;
  },

  async remove(key: string) {
    await del(key);
  },
};
