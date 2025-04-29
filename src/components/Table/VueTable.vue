<template>
  <div class="table-container">
    <div class="table">
      <div class="table-header">
        <div class="table-header-row" v-for="headerGroup in props.table.getHeaderGroups()" :key="headerGroup.id">
          <div
            v-for="header in headerGroup.headers"
            :key="header.id"
            :id="header.id"
            :class="{
              'table-header-row-cell': true,
              sortable: header.column.getCanSort(),
              flex1: header.column.columnDef.meta?.flex1 === true,
            }"
            :style="{ width: `${header.getSize()}px` }"
            @click="props.table.setSorting(sorter(header))"
          >
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            <span
              v-if="props.table.getState().sorting.at(0)?.id === header.id"
              :class="{
                orderArrow: true,
                asc: !props.table.getState().sorting.at(0)?.desc,
                desc: props.table.getState().sorting.at(0)?.desc,
              }"
            ></span>
          </div>
        </div>
      </div>

      <div class="table-body">
        <div v-if="props.isLoading" class="loading">Loading...</div>
        <div v-else class="table-body-row" v-for="row in props.table.getRowModel().rows" :key="row.id">
          <div
            :class="{
              'table-body-row-cell': true,
              'text-center': cell.column.columnDef.meta?.textCenter,
              flex1: cell.column.columnDef.meta?.flex1,
              bold: cell.column.columnDef.meta?.bold,
              link: cell.column.columnDef.meta?.link,
            }"
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :style="{ width: `${cell.column.getSize()}px` }"
          >
            <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </div>
        </div>
      </div>

      <div v-if="!props.noPagination" class="table-footer">
        <div />

        <div class="pagination">
          <button @click="props.table.firstPage" :disabled="!props.table.getCanPreviousPage()">
            {{ '<<' }}
          </button>
          <button @click="props.table.previousPage" :disabled="!props.table.getCanPreviousPage()">
            {{ '<' }}
          </button>
          {{ props.table.getState().pagination.pageIndex + 1 }} {{ ' / ' }} {{ props.table.getPageCount() }}
          <button @click="props.table.nextPage" :disabled="!props.table.getCanNextPage()">
            {{ '>' }}
          </button>
          <button @click="() => props.table.lastPage()" :disabled="!props.table.getCanNextPage()">
            {{ '>>' }}
          </button>
        </div>

        <input
          type="search"
          placeholder="Search"
          :value="props.table.getState().globalFilter"
          @input="props.table.setGlobalFilter(($event.target as HTMLInputElement)?.value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FlexRender, type Header, type RowData, type SortingState, type Table } from '@tanstack/vue-table';

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    flex1?: boolean;
    textCenter?: boolean;
    bold?: boolean;
    link?: boolean;
  }
}

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
  isLoading?: boolean;
  noPagination?: boolean;
}>();

const sorter = (header: Header<unknown, unknown>) => (prev: SortingState) => {
  if (!header.column.getCanSort()) {
    return prev;
  }

  const start = prev.at(0);

  if (start === undefined || start.id !== header.id) {
    return [{ id: header.id, desc: false }];
  } else if (start.desc) {
    return [];
  } else {
    return [{ id: header.id, desc: true }];
  }
};
</script>

<style scoped>
.table-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 10px;
}

.table {
  border: 2px solid black;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  overflow: hidden;
  background-color: lightsteelblue;
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

  .orderArrow {
    right: -10px;

    &.desc::after {
      content: '^';
      transform: rotate(180deg);
      display: inline-block;
    }

    &.asc::after {
      content: '^';
      display: inline-block;
    }
  }
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
  display: flex;
  align-items: center;
}

.sortable {
  user-select: none;
  position: relative;
  color: darkblue;

  &:hover {
    color: slateblue;
    cursor: pointer;
  }
}

.flex1 {
  flex: 1 0 0;
}

.text-center {
  justify-content: center;
}

.bold {
  font-weight: bold;
}

.link a {
  text-decoration: none;
  color: darkslateblue;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }

  &:visited {
    color: gray;
  }
}

.table-footer {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 20px;

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    padding: 10px;
  }

  input {
    height: 30px;
  }
}
</style>
