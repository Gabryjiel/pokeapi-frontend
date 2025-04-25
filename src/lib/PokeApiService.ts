import type {
  Ability,
  Generation,
  Move,
  NamedAPIResource,
  NamedAPIResourceList,
  Nature,
  Pokemon,
  Type,
  Version,
} from 'pokenode-ts';
import { getIdFromUrl, getPokemonDisplayName } from './stringHelpers';
import { fetchWithCache } from './FetchService';

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

export const PokeApiService = {
  getPokemonList: () => getList('pokemon'),
  getPokemonById: (id: number) => fetchWithCache<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`),
  getAllPokemons: () => getAll<Pokemon>(PokeApiService.getPokemonList, PokeApiService.getPokemonById),

  getAbilityList: () => getList('ability'),
  getAbilityById: (id: number) => fetchWithCache<Ability>(`https://pokeapi.co/api/v2/ability/${id}`),
  getAllAbilities: () => getAll<Ability>(PokeApiService.getAbilityList, PokeApiService.getAbilityById),

  getTypeList: () => getList('type'),
  getTypeById: (id: number) => fetchWithCache<Type>(`https://pokeapi.co/api/v2/type/${id}`),
  getAllTypes: () => getAll<Type>(PokeApiService.getTypeList, PokeApiService.getTypeById),

  getGenerationList: () => getList('generation'),
  getGenerationById: (id: number) => fetchWithCache<Generation>(`https://pokeapi.co/api/v2/generation/${id}`),
  getAllGenerations: () => getAll<Generation>(PokeApiService.getGenerationList, PokeApiService.getGenerationById),

  getVersionList: () => getList('version'),
  getVersionById: (id: number) => fetchWithCache<Version>(`https://pokeapi.co/api/v2/version/${id}`),
  getAllVersions: () => getAll<Version>(PokeApiService.getVersionList, PokeApiService.getVersionById),

  moves: {
    getList: () => getList('move'),
    getById: (id: number) => fetchWithCache<Move>(`https://pokeapi.co/api/v2/move/${id}`),
    getAll: () => getAll<Move>(PokeApiService.moves.getList, PokeApiService.moves.getById),
  },

  nature: {
    getList: () => getList('nature'),
    getById: (id: number) => fetchWithCache<Nature>(`https://pokeapi.co/api/v2/nature/${id}`),
    getAll: () => getAll<Nature>(PokeApiService.nature.getList, PokeApiService.nature.getById),
  },
};

async function getList(resource: string): Promise<NamedAPIResource[]> {
  const list = await fetchWithCache<NamedAPIResourceList>(`https://pokeapi.co/api/v2/${resource}/?limit=-1`);
  return list.results;
}

async function getAll<T>(
  getList: () => Promise<NamedAPIResource[]>,
  getById: (id: number) => Promise<T>,
): Promise<T[]> {
  const list = await getList();
  const promises = list.map((item) => getById(getIdFromUrl(item.url)));
  const result = await Promise.all(promises);

  return result;
}

export function mapFromPokemonToMyPokemon(pokemon: Pokemon): MyPokemon {
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
