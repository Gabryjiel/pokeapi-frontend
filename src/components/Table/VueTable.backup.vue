<template>
  <div class="table-container">
    <div class="table">
      <div class="table-header">
        <div class="table-header-row" v-for="headerGroup in props.tableData.getHeaderGroups()" :key="headerGroup.id">
          <div
            v-for="header in headerGroup.headers"
            :key="header.id"
            :id="header.id"
            :class="{
              'table-header-row-cell': true,
              flex1: header.column.columnDef.meta?.flex1 === true,
            }"
            :style="{ width: `${header.getSize()}px` }"
            @click="handleSorting(header)"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
          </div>
        </div>
      </div>

      <div class="table-body">
        <div class="table-body-row" v-for="row in props.tableData.getRowModel().rows" :key="row.id">
          <div
            :class="{
              'table-body-row-cell': true,
              'text-center': cell.column.columnDef.meta?.textCenter === true,
              flex1: cell.column.columnDef.meta?.flex1 === true,
            }"
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :style="{ width: `${cell.column.getSize()}px` }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </div>
        </div>
      </div>

      <div class="table-footer">
        <button @click="props.setPage(1)" :disabled="page === 1">1</button>
        <button @click="props.setPage(page - 1)" :disabled="page === 1">-1</button>
        {{ page }}
        <button @click="props.setPage(page + 1)">Następny</button>
        <button @click="props.setPage(2)">Ostatni</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderType } from '@/lib/useTableParams';
import { FlexRender, type Header, type RowData, type SortingState, type Table } from '@tanstack/vue-table';

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    flex1?: boolean;
    textCenter?: boolean;
  }
}

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tableData: Table<any>;
  page: number;
  setPage: (newPage: number) => void;
  orderBy: string;
  orderType: OrderType;
  changeOrder: (newOrderBy: string) => void;
}>();

const sorter = (header: Header<unknown, unknown>) => (prev: SortingState) => {
  const start = prev.at(0);

  if (start === undefined || start.id !== header.id) {
    return [{ id: header.id, desc: false }];
  } else if (start.desc) {
    return [];
  } else {
    return [{ id: header.id, desc: true }];
  }
};

const handleSorting = (header: Header<unknown, unknown>) => {
  sorter(header);
};
</script>

<style scoped>
.table-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px;
  background-color: lightsteelblue;
}

.table {
  border: 2px solid black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  overflow: hidden;
}

.table-header,
.table-header-row {
  display: flex;
  height: 30px;
  width: 100%;
  font-weight: 700;
}

.table-header-row-cell {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-body {
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  background-color: whitesmoke;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  overflow: auto;
}

.table-body-row {
  display: flex;
  padding: 5px 0;

  &:nth-of-type(even) {
    background-color: lightgray;
  }
}

.table-body-row-cell {
  text-indent: 5px;
}

.flex1 {
  flex: 1 0 0;
}

.text-center {
  text-align: center;
}

.table-footer {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  padding: 10px;
}
</style>
