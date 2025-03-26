<template>
  <TableLayout>
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

    <template v-slot:aside>
      <DoubleRangeInput
        :min="150"
        :max="1200"
        :lower-value="params.minTotalStats.value"
        :higher-value="params.maxTotalStats.value"
        @change:min="params.minTotalStats.value = $event"
        @change:max="params.maxTotalStats.value = $event"
      />
    </template>
  </TableLayout>
</template>

<script setup lang="ts">
import DoubleRangeInput from '@/components/DoubleRangeInput.vue';
import TableLayout from '@/components/TableLayout.vue';
import Table from '@/components/Table/Table.vue';
import { useTable } from '@/components/Table/useTable';
import { getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import { usePokemons } from '@/lib/usePokemon';
import { useTableParams } from '@/lib/useTableParams';
import { useRouteQuery } from '@vueuse/router';

const params = {
  minTotalStats: useRouteQuery('min-total', '', { transform: Number, mode: 'replace' }),
  maxTotalStats: useRouteQuery('max-total', '', { transform: Number, mode: 'replace' }),
};
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

<style scoped></style>
