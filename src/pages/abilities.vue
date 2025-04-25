<template>
  <VueTable :table="table" :is-loading="abilities.isLoading.value" />
</template>

<script setup lang="ts">
import VueTable from '@/components/Table/VueTable.vue';
import { useCache } from '@/lib/CacheService';
import { PokeApiService } from '@/lib/PokeApiService';
import { getPokemonDisplayName } from '@/lib/stringHelpers';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table';
import type { Ability } from 'pokenode-ts';
import { h } from 'vue';

const columnHelper = createColumnHelper<Ability>();
const abilities = useCache('abilities', {}, PokeApiService.getAllAbilities, []);
const table = useVueTable({
  data: abilities.state,
  columns: [
    columnHelper.accessor('name', {
      id: 'abilityName',
      header: 'Name',
      enableSorting: true,
      cell: (cell) => {
        return h('a', {
          href: `/abilities/${cell.row.original.id}`,
          innerText: getPokemonDisplayName(cell.getValue()),
        });
      },
      size: 150,
    }),
    {
      id: 'pokemonCount',
      header: 'Number of Pokemon',
      accessorFn: (ability) => ability.pokemon.length,
      enableSorting: true,
      size: 200,
      meta: {
        textCenter: true,
      },
    },
    columnHelper.accessor('flavor_text_entries.flavor_text', {
      id: 'abilityDescription',
      header: 'Short description',
      enableSorting: false,
      cell: (cell) =>
        cell.row.original.flavor_text_entries.find((fte) => fte.language.name === 'en')?.flavor_text ?? '-',
      meta: {
        flex1: true,
      },
    }),
  ],
  getCoreRowModel: getCoreRowModel<Ability>(),
  getSortedRowModel: getSortedRowModel<Ability>(),
  getPaginationRowModel: getPaginationRowModel<Ability>(),
  getFilteredRowModel: getFilteredRowModel<Ability>(),
  globalFilterFn: 'includesString',
  enableSorting: true,
  initialState: {
    sorting: [
      {
        id: 'pokemonCount',
        desc: true,
      },
    ],
    pagination: {
      pageSize: 30,
    },
    globalFilter: '',
  },
});
</script>

<style scoped></style>
