<template>
  <main>
    <Table
      :columns="table.columns"
      :rows="table.rows.value"
      :page="tableParams.page.value"
      :set-page="tableParams.setPage"
      :hiddenColumns="table.hiddenColumns.value"
      :set-order-by="tableParams.changeOrder"
      :order-by="tableParams.orderBy.value"
      :order-type="tableParams.orderType.value"
    />
  </main>
</template>

<script setup lang="ts">
import Table from '@/components/Table/Table.vue';
import { useTable } from '@/components/Table/useTable';
import { getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import { usePokemons } from '@/lib/usePokemon';
import { useTableParams } from '@/lib/useTableParams';

const tableParams = useTableParams();
const pokemons = usePokemons({ page: tableParams.page });
const table = useTable(pokemons.state, {
  id: 'pokemons-table',
  columns: [
    { name: 'id', label: 'No', width: '5%', map: (p) => p.id },
    {
      name: 'sprite',
      label: 'Sprite',
      width: '5%',
      nonsortable: true,
      map: (p) => ({
        type: 'img',
        value: p.sprites.front_default ?? '',
      }),
    },
    {
      name: 'name',
      label: 'Name',
      width: '10%',
      map: (p) => ({ type: 'link', value: { label: getPokemonDisplayName(p.name), href: `/pokemons/${p.id}` } }),
    },
    {
      name: 'types',
      label: 'Types',
      width: '10%',
      nonsortable: true,
      map: (p) => ({ type: 'pokemon-types', value: p.myTypes }),
    },
    {
      name: 'abilities',
      label: 'Abilities',
      width: '15%',
      nonsortable: true,
      map: (p) => ({
        type: 'links',
        value: p.abilities.map((a) => ({
          href: `/abilities/${getIdFromUrl(a.ability.url)}`,
          label: getPokemonDisplayName(a.ability.name),
        })),
      }),
    },
    { name: 'totalStats', label: 'Total stats', width: '10%', map: (p) => p.totalStats },
    { name: 'hp', label: 'Health', width: '10%', map: (p) => p.hp },
    { name: 'attack', label: 'Attack', width: '10%', map: (p) => p.attack },
    { name: 'defense', label: 'Defense', width: '10%', map: (p) => p.defense },
    { name: 'special-attack', label: 'Sp. Attack', width: '10%', map: (p) => p.specialAttack },
    { name: 'special-defense', label: 'Sp. Defense', width: '10%', map: (p) => p.specialDefense },
    { name: 'speed', label: 'Speed', width: '10%', map: (p) => p.speed },
  ],
  mapToRowMetadata: (value) => {
    return {
      id: value.id,
    };
  },
});
</script>

<style scoped>
main {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
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
