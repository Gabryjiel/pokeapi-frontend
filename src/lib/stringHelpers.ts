export function capitalize<T extends string>(target: T): Capitalize<T> {
  return (target.at(0)?.toUpperCase() + target.slice(1)) as Capitalize<T>;
}

export function getPokemonDisplayName(pokemonName: string): string {
  return capitalize(pokemonName).replaceAll('-', ' ');
}
