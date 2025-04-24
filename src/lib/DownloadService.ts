import { PokeApiService } from './PokeApiService';
import { getIdFromUrl } from './stringHelpers';

export async function downloadAllPokemons() {
  const list = await PokeApiService.getPokemonList();
  const promises = list.map((item) => PokeApiService.getPokemonById(getIdFromUrl(item.url)));
  await Promise.allSettled(promises);
}

export async function downloadAllAbilities() {
  const list = await PokeApiService.getAbilityList();
  const promises = list.map((item) => PokeApiService.getAbilityById(getIdFromUrl(item.url)));
  await Promise.allSettled(promises);
}
