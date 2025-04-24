<template>
  <TableLayout>
    <Table
      :columns="table.columns"
      :rows="table.rows.value"
      :page="params.page"
      :set-page="tableParams.setPage"
      :hiddenColumns="table.hiddenColumns.value"
      :set-order-by="tableParams.changeOrder"
      :order-by="params.orderBy"
      :order-type="params.orderType"
    />

    <template v-slot:aside>
      <label for="search">Search</label>
      <input id="search" type="search" v-model="params.search" />

      <select multiple v-model="params.type">
        <option v-for="type in types.state.value" :key="type.id" :value="type.name">{{ capitalize(type.name) }}</option>
      </select>

      <select v-model="params.generation">
        <option value="">-</option>
        <option v-for="generation in generations.state.value" :key="generation.id" :value="generation.id">
          {{ capitalize(generation.name) }}
        </option>
      </select>

      <select v-model="params.version">
        <option value="">-</option>
        <option v-for="version in versions.state.value" :key="version.id" :value="version.id">
          {{ capitalize(version.name) }}
        </option>
      </select>
    </template>
  </TableLayout>
</template>

<script setup lang="ts">
import TableLayout from '@/components/TableLayout.vue';
import Table from '@/components/Table/Table.vue';
import { useTable } from '@/components/Table/useTable';
import { capitalize, getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import { usePokemons } from '@/lib/usePokemons';
import { useTableParams } from '@/lib/useTableParams';
import { useRouteQuery } from '@vueuse/router';
import { reactive } from 'vue';
import { toRefs, useAsyncState } from '@vueuse/core';
import { PokeApiService } from '@/lib/PokeApiService';

const tableParams = useTableParams();
const params = reactive({
  ...toRefs(tableParams.params),
  minTotalStats: useRouteQuery('min-total', '', { transform: Number, mode: 'replace' }),
  maxTotalStats: useRouteQuery('max-total', '', { transform: Number, mode: 'replace' }),
  search: useRouteQuery('search', '' as string, { mode: 'replace' }),
  type: useRouteQuery('type', new Array<string>(), { mode: 'replace' }),
  generation: useRouteQuery('generation', '', { transform: Number, mode: 'replace' }),
  version: useRouteQuery('version', '', { transform: Number, mode: 'replace' }),
});

const types = useAsyncState(PokeApiService.getAllTypes, []);
const generations = useAsyncState(PokeApiService.getAllGenerations, []);
const versions = useAsyncState(PokeApiService.getAllVersions, []);
const pokemons = usePokemons(params);
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
    { name: 'stat_hp', label: 'Health', width: '10%', map: (p) => p.hp },
    { name: 'stat_attack', label: 'Attack', width: '10%', map: (p) => p.attack },
    { name: 'stat_defense', label: 'Defense', width: '10%', map: (p) => p.defense },
    { name: 'stat_special-attack', label: 'Sp. Attack', width: '10%', map: (p) => p.specialAttack },
    { name: 'stat_special-defense', label: 'Sp. Defense', width: '10%', map: (p) => p.specialDefense },
    { name: 'stat_speed', label: 'Speed', width: '10%', map: (p) => p.speed },
  ],
  mapToRowMetadata: (value) => {
    return {
      id: value.id,
    };
  },
});
</script>

<style scoped></style>
