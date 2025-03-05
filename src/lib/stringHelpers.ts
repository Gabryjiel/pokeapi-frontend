export function capitalize<T extends string>(target: T): Capitalize<T> {
  return (target.at(0)?.toUpperCase() + target.slice(1)) as Capitalize<T>;
}

export function getPokemonDisplayName(pokemonName: string): string {
  return capitalize(pokemonName).replaceAll('-', ' ');
}

export function getIdFromUrl(url: string): number {
  const idStr = url.split('/').at(-2);

  return Number(idStr);
}
