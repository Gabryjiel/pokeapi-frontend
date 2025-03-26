import type { Ability, Pokemon } from 'pokenode-ts';
import { FetchService } from './FetchService';
import { getIdFromUrl, getPokemonDisplayName } from './stringHelpers';

export type MyPokemonType = { id: number; name: string; slot: number };

export type MyPokemon = Pokemon & {
  displayName: string;
  totalStats: number;
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
  myTypes: MyPokemonType[];
};

export const PokemonService = {
  getPokemonById: async (pokemonId: number) => {
    const pokemon = await FetchService.withCache(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`, {
      map: (pokemon: Pokemon) => mapFromPokemonToMyPokemon(pokemon),
    });

    return pokemon;
  },

  getAbilityById: async (id: number) => {
    const data = await FetchService.withCache<Ability>(`https://pokeapi.co/api/v2/ability/${id}`);

    return data;
  },
};

function mapFromPokemonToMyPokemon(pokemon: Pokemon): MyPokemon {
  const stats = pokemon.stats.reduce(
    (acc, cur) => {
      acc[cur.stat.name] = cur.base_stat;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    ...pokemon,
    displayName: getPokemonDisplayName(pokemon.name),
    totalStats: pokemon.stats.reduce((acc, cur) => acc + cur.base_stat, 0),
    hp: stats.hp ?? -1,
    attack: stats.attack ?? -1,
    defense: stats.defense ?? -1,
    specialAttack: stats['special-attack'] ?? -1,
    specialDefense: stats['special-defense'] ?? -1,
    speed: stats.speed ?? -1,
    myTypes: pokemon.types.map((type) => ({
      id: getIdFromUrl(type.type.url),
      name: type.type.name,
      slot: type.slot,
    })),
  };
}
