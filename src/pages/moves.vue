<template>
  <VueTable :table="table" :is-loading="moves.isLoading.value" />
</template>

<script setup lang="ts">
import PokemonType from '@/components/PokemonType.vue';
import VueTable from '@/components/Table/VueTable.vue';
import { type CacheDatabase } from '@/lib/CacheService';
import { capitalize, getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import { useMoves } from '@/lib/useMoves';
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import type { Move } from 'pokenode-ts';
import { computed, h, ref, toRef, watch } from 'vue';

const sorting = ref([
  {
    id: 'id',
    desc: false,
  },
]);
const pagination = ref({
  pageIndex: 0,
  pageSize: 25,
});
const search = ref('');

const filters = computed<CacheDatabase['moves'][1]>(() => {
  const order = sorting.value.at(0);

  return {
    take: pagination.value.pageSize,
    orderBy: order ? order.id : undefined,
    orderType: order ? (order.desc ? 'desc' : 'asc') : '',
    page: pagination.value.pageIndex + 1,
    search: search.value,
  };
});

const moves = useMoves(filters);
const table = useVueTable({
  get data() {
    return moves.state.value.data;
  },
  get rowCount() {
    return moves.state.value.count;
  },
  getCoreRowModel: getCoreRowModel<Move>(),
  manualFiltering: true,
  manualSorting: true,
  manualPagination: true,
  columns: [
    { id: 'id', accessorKey: 'id' },
    {
      id: 'name',
      header: 'Name',
      accessorFn: (data) => getPokemonDisplayName(data.name),
      cell: (data) => h('a', { href: `/move/${data.row.original.id}`, innerText: data.getValue() }),
    },
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
  globalFilterFn: 'includesString',
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return pagination.value;
    },
    get globalFilter() {
      return search.value;
    },
    columnVisibility: {
      id: false,
    },
  },
  onSortingChange: (updater) => {
    sorting.value = updater instanceof Function ? updater(sorting.value) : updater;
  },
  onPaginationChange: (updater) => {
    pagination.value = updater instanceof Function ? updater(pagination.value) : updater;
  },
  onGlobalFilterChange: (updater) => {
    search.value = updater instanceof Function ? updater(search.value) : updater;
    pagination.value.pageIndex = 0;
  },
});
</script>

<style scoped></style>
