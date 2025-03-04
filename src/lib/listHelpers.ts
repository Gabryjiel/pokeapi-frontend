import { capitalize } from 'vue';
import { ApiClient } from './apiClient';
import { getPokemonDisplayName } from './stringHelpers';
import type { NamedAPIResource } from 'pokenode-ts';

export type Suggestion = {
  type: 'POKEMON' | 'ABILITY';
  id: number;
  name: string;
  slug: string;
};

function createSugestion(
  resource: NamedAPIResource,
  type: Suggestion['type'],
  nameFormatFn?: (name: string) => string,
): Suggestion {
  return {
    type: type,
    id: Number(resource.url.split('/').at(-2)),
    name: nameFormatFn ? nameFormatFn(resource.name) : capitalize(resource.name),
    slug: resource.name,
  };
}

export async function searchPokemons(searchPhrase: string): Promise<Suggestion[]> {
  const pokemonList = await ApiClient.pokemon.listPokemons(0, -1);
  return pokemonList.results
    .filter((resource) => resource.name.includes(searchPhrase.toLowerCase()))
    .map((resource) => createSugestion(resource, 'POKEMON', getPokemonDisplayName));
}

export async function searchAbilities(searchPhrase: string): Promise<Suggestion[]> {
  const abilityList = await ApiClient.pokemon.listAbilities(0, -1);
  return abilityList.results
    .filter((resource) => resource.name.includes(searchPhrase.toLowerCase()))
    .map((resource) => createSugestion(resource, 'ABILITY'));
}
