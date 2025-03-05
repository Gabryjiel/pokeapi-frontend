import { type NamedAPIResource, TYPES } from 'pokenode-ts';

export function filterPokemonNames(pokemonResourceList: NamedAPIResource[], searchPhrase: string) {
  return pokemonResourceList.filter((resource) => resource.name.includes(searchPhrase));
}

export function typeToString(type: (typeof TYPES)[keyof typeof TYPES]): string {
  switch (type) {
    case TYPES.NORMAL:
      return 'normal';
    case TYPES.WATER:
      return 'water';
    case TYPES.FIGHTING:
      return 'fighting';
    case TYPES.FIRE:
      return 'fire';
    case TYPES.FLYING:
      return 'flying';
    case TYPES.GHOST:
      return 'ghost';
    case TYPES.ELECTRIC:
      return 'electric';
    case TYPES.STEEL:
      return 'steel';
    case TYPES.DARK:
      return 'dark';
    case TYPES.DRAGON:
      return 'dargon';
    case TYPES.FAIRY:
      return 'fairy';
    case TYPES.GROUND:
      return 'ground';
    case TYPES.ROCK:
      return 'rock';
    case TYPES.GRASS:
      return 'grass';
    case TYPES.BUG:
      return 'bug';
    case TYPES.ICE:
      return 'ice';
    case TYPES.PSYCHIC:
      return 'psychic';
    case TYPES.POISON:
      return 'poison';
    case TYPES.UNKNOWN:
    default:
      return 'unknown';
  }
}
