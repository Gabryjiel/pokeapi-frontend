<template>
  <VueTable :table="table" :is-loading="data.isLoading.value" />
</template>

<script setup lang="ts">
import PokemonType from '@/components/PokemonType.vue';
import VueTable from '@/components/Table/VueTable.vue';
import { useCache } from '@/lib/CacheService';
import { PokeApiService } from '@/lib/PokeApiService';
import { capitalize, getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import type { Move } from 'pokenode-ts';
import { h } from 'vue';

const data = useCache('moves', {}, PokeApiService.moves.getAll, []);
const table = useVueTable({
  data: data.state,
  getCoreRowModel: getCoreRowModel<Move>(),
  getSortedRowModel: getSortedRowModel<Move>(),
  getPaginationRowModel: getPaginationRowModel<Move>(),
  getFilteredRowModel: getFilteredRowModel<Move>(),
  columns: [
    { id: 'name', header: 'Name', accessorFn: (data) => getPokemonDisplayName(data.name) },
    {
      id: 'types',
      header: 'Type',
      accessorFn: (data) => data.type.name,
      cell: (data) =>
        h(PokemonType, {
          type: data.row.original.type.name,
          typeNo: getIdFromUrl(data.row.original.type.url),
        }),
      meta: {
        textCenter: true,
      },
    },
    {
      id: 'category',
      header: 'Category',
      accessorFn: (data) => capitalize(data.damage_class?.name),
      meta: { textCenter: true },
    },
    { id: 'accuracy', header: 'Accuracy', accessorFn: (data) => data.accuracy ?? '-', meta: { textCenter: true } },
    { id: 'damage', header: 'Damage', accessorFn: (data) => data.power ?? '-', meta: { textCenter: true } },
    {
      id: 'effect',
      header: 'Effect',
      accessorFn: (data) => data.effect_entries.at(0)?.short_effect ?? '-',
      enableSorting: false,
      meta: { flex1: true },
    },
  ],
  initialState: {
    pagination: {
      pageSize: 25,
    },
    globalFilter: '',
  },
});
</script>

<style scoped></style>
