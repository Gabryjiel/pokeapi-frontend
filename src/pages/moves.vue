<template>
  <div class="container">
    <VueTable :table="table" :is-loading="moves.isLoading.value" />

    <aside>
      <h1>Filtry</h1>

      <label for="type">Type</label>
      <select v-model="moveFilters.type">
        <option value="">-</option>
        <option value="normal">Normal</option>
        <option value="fire">Fire</option>
        <option value="water">Water</option>
        <option value="electric">Electric</option>
        <option value="grass">Grass</option>
        <option value="ice">Ice</option>
        <option value="fighting">Fighting</option>
        <option value="poison">Poison</option>
        <option value="ground">Ground</option>
        <option value="flying">Flying</option>
        <option value="psychic">Psychic</option>
        <option value="bug">Bug</option>
        <option value="rock">Rock</option>
        <option value="ghost">Ghost</option>
        <option value="dragon">Dragon</option>
        <option value="dark">Dark</option>
        <option value="steel">Steel</option>
        <option value="fairy">Fairy</option>
        <option value="shadow">Shadow</option>
      </select>

      <label for="category">Category</label>
      <select v-model="moveFilters.category">
        <option value="">-</option>
        <option value="status">Status</option>
        <option value="physical">Physical</option>
        <option value="special">Special</option>
      </select>
    </aside>
  </div>
</template>

<script setup lang="ts">
import PokemonType from '@/components/PokemonType.vue';
import MoveDamageClass from '@/components/Table/MoveDamageClass.vue';
import VueTable from '@/components/Table/VueTable.vue';
import { type CacheDatabase } from '@/lib/CacheService';
import { getIdFromUrl, getPokemonDisplayName } from '@/lib/stringHelpers';
import { useMoves } from '@/lib/useMoves';
import { getCoreRowModel, useVueTable } from '@tanstack/vue-table';
import type { Move } from 'pokenode-ts';
import { computed, h, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';

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

const moveFilters = reactive({
  category: undefined,
  type: undefined,
});

const filters = computed<CacheDatabase['moves'][1]>(() => {
  const order = sorting.value.at(0);

  return {
    category: moveFilters.category,
    type: moveFilters.type,
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
      cell: (data) => h(RouterLink, { to: `/move/${data.row.original.id}`, innerText: data.getValue() }),
      meta: { link: true },
    },
    {
      id: 'type',
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
      accessorFn: (data) => data.damage_class?.name ?? '',
      cell: (data) => h(MoveDamageClass, { moveDamageClass: data.getValue() }),
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

<style scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
}

aside {
  background-color: lightsteelblue;
  margin: 10px 10px 10px 0;
  padding: 10px 5px;
  border-radius: 25px;
  border: 2px solid black;
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  h1 {
    text-indent: 5px;
    font-size: large;
    font-weight: bold;
    padding-bottom: 10px;
  }
}
</style>
