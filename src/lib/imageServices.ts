export type MoveDamageClass = 'status' | 'physical' | 'special';

export function getDamageClassImage(damageClass: MoveDamageClass) {
  return `https://img.pokemondb.net/images/icons/move-${damageClass}.png`;
}
