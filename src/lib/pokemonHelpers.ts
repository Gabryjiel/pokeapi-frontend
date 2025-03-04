import type { NamedAPIResource } from 'pokenode-ts';

export function filterPokemonNames(pokemonResourceList: NamedAPIResource[], searchPhrase: string) {
  return pokemonResourceList.filter((resource) => resource.name.includes(searchPhrase));
}
