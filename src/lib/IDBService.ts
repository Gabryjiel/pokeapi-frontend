import { get, set } from 'idb-keyval';

export function IDBSet(key: string, value: unknown) {
  return set(key, value);
}

export async function IDBGet<T = unknown>(key: string) {
  const value = await get(key);

  if (!value) {
    return undefined;
  }

  return value as T;
}
