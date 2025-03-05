import { capitalize } from 'vue';
import { ApiClient } from './apiClient';
import { getPokemonDisplayName } from './stringHelpers';
import type { NamedAPIResource, NamedAPIResourceList } from 'pokenode-ts';

export type SuggestionType = 'POKEMON' | 'ABILITY';
export type Suggestion = {
  type: SuggestionType;
  id: number;
  name: string;
  slug: string;
};

function createSugestion(
  resource: NamedAPIResource,
  type: SuggestionType,
  nameFormatFn?: (name: string) => string,
): Suggestion {
  return {
    type: type,
    id: Number(resource.url.split('/').at(-2)),
    name: nameFormatFn ? nameFormatFn(resource.name) : capitalize(resource.name),
    slug: resource.name,
  };
}

function filterName(searchPhrase: string, resource: NamedAPIResource): boolean {
  return resource.name.includes(searchPhrase.toLowerCase());
}

function sortResources(phrase: string) {
  return function (a: NamedAPIResource, b: NamedAPIResource): 1 | 0 | -1 {
    const aLower = -1;
    const bLower = 1;

    if (a.name === phrase && b.name === phrase) {
      return 0;
    } else if (a.name === phrase) {
      return aLower;
    } else if (b.name === phrase) {
      return bLower;
    } else if (a.name.startsWith(phrase) && b.name.startsWith(phrase)) {
      const aSlice = a.name.slice(phrase.length);
      const bSlice = b.name.slice(phrase.length);
      return aSlice < bSlice ? aLower : aSlice === bSlice ? 0 : bLower;
    } else if (a.name.startsWith(phrase)) {
      return aLower;
    } else if (b.name.startsWith(phrase)) {
      return bLower;
    }

    return a.name < b.name ? aLower : a.name === b.name ? 0 : bLower;
  };
}

function reduceResource(
  resources: NamedAPIResourceList,
  searchPhrase: string,
  type: SuggestionType,
  nameFormatFn?: (name: string) => string,
  limit: number = 10,
): Suggestion[] {
  const result = new Array<Suggestion>();

  for (const resource of resources.results.toSorted(sortResources(searchPhrase))) {
    if (filterName(searchPhrase, resource)) {
      result.push(createSugestion(resource, type, nameFormatFn));

      if (result.length >= limit) {
        return result;
      }
    }
  }

  return result;
}

export async function searchPokemons(searchPhrase: string): Promise<Suggestion[]> {
  const list = await ApiClient.pokemon.listPokemons(0, -1);
  return reduceResource(list, searchPhrase, 'POKEMON', getPokemonDisplayName);
}

export async function searchAbilities(searchPhrase: string): Promise<Suggestion[]> {
  const list = await ApiClient.pokemon.listAbilities(0, -1);
  return reduceResource(list, searchPhrase, 'ABILITY');
}
