import { IDBGet, IDBSet } from './IDBService';

export async function fetchWithCache<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const cached = await IDBGet<T>(url);
  if (cached !== undefined) {
    return cached;
  }

  const response = await fetch(url, init);
  const json = (await response.json()) as T;

  IDBSet(url, json);
  return json;
}
