<template>
  <VueTable :table="table" :is-loading="data.isLoading.value" :no-pagination="true" />
</template>

<script setup lang="ts">
import VueTable from '@/components/Table/VueTable.vue';
import { useCache } from '@/lib/CacheService';
import { PokeApiService } from '@/lib/PokeApiService';
import { capitalize, getPokemonDisplayName } from '@/lib/stringHelpers';
import { getCoreRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import type { Nature } from 'pokenode-ts';

const data = useCache('natures', {}, PokeApiService.nature.getAll, []);
const table = useVueTable({
  data: data.state,
  columns: [
    {
      id: 'name',
      header: 'Nature',
      accessorFn: (data) => capitalize(data.name),
      enableSorting: true,
      meta: {
        textCenter: true,
        flex1: true,
      },
    },
    {
      id: 'increasedStat',
      header: 'Increased stat',
      accessorFn: (data) => getPokemonDisplayName(data.increased_stat?.name) ?? '-',
      enableSorting: true,
      meta: {
        textCenter: true,
        flex1: true,
      },
    },
    {
      id: 'decreasedStat',
      header: 'Decreased stat',
      accessorFn: (data) => getPokemonDisplayName(data.decreased_stat?.name) ?? '-',
      enableSorting: true,
      meta: {
        textCenter: true,
        flex1: true,
      },
    },
    {
      id: 'likedFlavour',
      header: 'Likes',
      accessorFn: (data) => capitalize(data.likes_flavor?.name) ?? '-',
      enableSorting: true,
      meta: {
        textCenter: true,
        flex1: true,
      },
    },
    {
      id: 'hatedFlavour',
      header: 'Hates',
      accessorFn: (data) => capitalize(data.hates_flavor?.name) ?? '-',
      enableSorting: true,
      meta: {
        textCenter: true,
        flex1: true,
      },
    },
  ],
  getCoreRowModel: getCoreRowModel<Nature>(),
  getSortedRowModel: getSortedRowModel<Nature>(),
});
</script>

<style scoped></style>
