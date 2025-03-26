<template>
  <table>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :id="header.id"
          @click="table.setSorting(sorter(header))"
        >
          <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in table.getRowModel().rows" :key="row.id">
        <td v-for="cell in row.getVisibleCells()" :key="cell.id">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useAbilities } from '@/lib/usePokemon';
import { useTableParams } from '@/lib/useTableParams';
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getSortedRowModel,
  useVueTable,
  type Header,
  type SortingState,
} from '@tanstack/vue-table';
import type { Ability } from 'pokenode-ts';

const columnHelper = createColumnHelper<Ability>();

const sorter = (header: Header<Ability, unknown>) => (prev: SortingState) => {
  const start = prev.at(0);

  if (start === undefined || start.id !== header.id) {
    return [{ id: header.id, desc: false }];
  } else if (start.desc) {
    return [];
  } else {
    return [{ id: header.id, desc: true }];
  }
};

const tableParams = useTableParams();
const abilities = useAbilities({ page: tableParams.page });
const table = useVueTable({
  data: abilities.state,
  columns: [
    columnHelper.accessor('name', {
      id: 'abilityName',
      header: 'Name',
      //cell: (cell) => cell.row.original.names.find((n) => n.language.name === 'en')?.name ?? cell.getValue(),
      cell: () => 'div',
    }),
    columnHelper.accessor('flavor_text_entries.flavor_text', {
      id: 'abilityDescription',
      header: 'Short description',
      cell: (cell) =>
        cell.row.original.flavor_text_entries.find((fte) => fte.language.name === 'en')?.flavor_text ?? '-',
    }),
    {
      id: 'pokemonCount',
      header: 'Number of Pokemon',
      accessorFn: (ability) => ability.pokemon.length,
    },
  ],
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  enableSorting: true,
  initialState: {
    sorting: [
      {
        id: 'pokemonCount',
        desc: true,
      },
    ],
  },
});
</script>

<style scoped></style>
