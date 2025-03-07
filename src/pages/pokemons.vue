<template>
  <main>
    <div class="table">
      <div class="table-header table-row">
        <div class="cell sortable">Id</div>
        <div>Sprite</div>
        <div class="cell sortable">Name</div>
        <div>Types</div>
        <div class="cell sortable">Total stats</div>
        <div class="cell sortable">Health</div>
        <div class="cell sortable">Attack</div>
        <div class="cell sortable">Defence</div>
        <div class="cell sortable">Sp. Attack</div>
        <div class="cell sortable">Sp. Defence</div>
        <div class="cell sortable">Speed</div>
      </div>

      <div class="table-body">
        <div class="table-row" v-for="pokemon in mappedPokemons" :key="pokemon.name">
          <div>{{ pokemon.id }}</div>
          <div><img :src="pokemon.sprites.front_default ?? ''" :alt="`${pokemon.name} default sprite`" /></div>
          <div>{{ pokemon.name }}</div>
          <div class="types-cell">
            <PokemonType v-for="type in pokemon.types" :type="type.type.name" :type-no="getIdFromUrl(type.type.url)"
              :key="type.type.name" />
          </div>
          <div>{{ pokemon.totalStats }}</div>
          <div>{{ pokemon.hp }}</div>
          <div>{{ pokemon.attack }}</div>
          <div>{{ pokemon.defense }}</div>
          <div>{{ pokemon.specialAttack }}</div>
          <div>{{ pokemon.specialDefense }}</div>
          <div>{{ pokemon.speed }}</div>
        </div>
      </div>

      <div class="table-footer">
        <button @click="setPage(1)" :disabled="page === 1">Pierwszy</button>
        <button @click="setPage(page - 1)" :disabled="page === 1">Poprzedni</button>
        {{ page }}
        <button @click="setPage(page + 1)">Następny</button>
        <button @click="setPage(2)">Ostatni</button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PokemonType from '@/components/PokemonType.vue';
import { ApiClient } from '@/lib/apiClient';
import { getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import type { Pokemon } from 'pokenode-ts';
import { computed, onMounted, ref, watch } from 'vue';

const page = ref(1);
const pokemons = ref(new Array<Pokemon>());
const mappedPokemons = computed(() => pokemons.value.map((pokemon) => {
  const stats = pokemon.stats.reduce((acc, cur) => {
    acc[cur.stat.name] = cur.base_stat;
    return acc;
  }, {} as Record<string, number>);

  return {
    ...pokemon,
    name: getPokemonDisplayName(pokemon.name),
    totalStats: pokemon.stats.reduce((acc, cur) => acc + cur.base_stat, 0),
    hp: stats.hp ?? -1,
    attack: stats.attack ?? -1,
    defense: stats.defense ?? -1,
    specialAttack: stats['special-attack'] ?? -1,
    specialDefense: stats['special-defense'] ?? -1,
    speed: stats.speed ?? -1,
  }
}));

const setPage = (newPage: number) => {
  if (newPage < 1) {
    return;
  }

  page.value = newPage;
}

const getPokemon = async (page: number) => {
  const promises = Array.from({ length: 15 }).map((_, index, array) =>
    ApiClient.pokemon.getPokemonById(1 + index + (page - 1) * array.length))
  const result = await Promise.all(promises)

  return result;
}

onMounted(async () => {
  pokemons.value = await getPokemon(page.value);
});

watch(page, async (newPage) => {
  pokemons.value = await getPokemon(newPage);
})
</script>

<style scoped>
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 2rem;
  overflow: hidden
}

.table {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid black;
  border-radius: 10px;
  overflow: hidden;
  background-color: whitesmoke;
}

.table-header {
  height: 5%;
  font-weight: bold;
  border-bottom: 1px solid black;
}

.table-body {
  height: 90%;
}

.table-footer {
  height: 5%;
  border-top: 1px solid black;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.table-row {
  display: flex;
  justify-content: space-evenly;
  height: 3rem;

  div {
    flex: 1 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
      height: 100%;
    }
  }

  .types-cell {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .sortable {
    &:hover {
      color: slateblue;
      cursor: pointer;
    }
  }
}

.table-row:nth-of-type(even) {
  background-color: lightgrey;
}
</style>
