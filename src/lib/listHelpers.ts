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

function reduceResource(
  resources: NamedAPIResourceList,
  searchPhrase: string,
  type: SuggestionType,
  nameFormatFn?: (name: string) => string,
): Suggestion[] {
  return resources.results.reduce((acc, cur) => {
    if (!filterName(searchPhrase, cur)) {
      return acc;
    }

    acc.push(createSugestion(cur, type, nameFormatFn));
    return acc;
  }, new Array<Suggestion>());
}

export async function searchPokemons(searchPhrase: string): Promise<Suggestion[]> {
  const list = await ApiClient.pokemon.listPokemons(0, -1);
  return reduceResource(list, searchPhrase, 'POKEMON', getPokemonDisplayName);
}

export async function searchAbilities(searchPhrase: string): Promise<Suggestion[]> {
  const list = await ApiClient.pokemon.listAbilities(0, -1);
  return reduceResource(list, searchPhrase, 'ABILITY');
}
