export function capitalize<T extends string>(target?: T): Capitalize<T> {
  if (target === undefined) {
    return '' as Capitalize<T>;
  }

  return (target.at(0)?.toUpperCase() + target.slice(1)) as Capitalize<T>;
}

export function getPokemonDisplayName(pokemonName?: string): string {
  if (pokemonName === undefined) {
    return '';
  }

  let result = '';

  for (let i = 0; i < pokemonName.length; i++) {
    if (pokemonName[i] === '-') {
      result += ' ';
    } else if (result[i - 1] === ' ' || i === 0) {
      result += pokemonName[i].toUpperCase();
    } else {
      result += pokemonName[i];
    }
  }

  return result;
}

export function getIdFromUrl(url: string): number {
  const idStr = url.split('/').at(-2);

  return Number(idStr);
}
