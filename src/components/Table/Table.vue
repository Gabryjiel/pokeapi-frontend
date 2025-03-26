<template>
  <div class="table">
    <div class="table-header">
      <div
        v-for="column in props.columns.filter((column) => !props.hiddenColumns.includes(column.name))"
        :key="column.name"
        :class="{
          cell: true,
          sortable: !column.nonsortable,
          ordered: props.orderBy === column.name,
        }"
        :style="{ width: column.width ?? '100%' }"
        @click="onHeaderClick(column)"
      >
        <div style="position: relative">
          {{ column.label }}
          <div
            v-if="props.orderBy === column.name"
            :class="{
              orderArrow: true,
              asc: props.orderType === 'asc',
              desc: props.orderType === 'desc',
            }"
          ></div>
        </div>
      </div>
    </div>

    <div class="table-body">
      <div class="table-row" v-for="row in props.rows" :key="row.metadata.id">
        <div
          v-for="(cell, index) in row.cells"
          :key="`${row.metadata.id}:${cell}`"
          :class="{
            cell: true,
            ['types-cell']: typeof cell === 'object' && cell.type === 'pokemon-types',
            linksCell: typeof cell === 'object' && cell.type === 'links',
          }"
          :style="{ width: props.columns[index].width ?? '100%' }"
        >
          <template v-if="typeof cell === 'string' || typeof cell === 'number'">
            {{ cell }}
          </template>

          <template v-else-if="typeof cell === 'object'">
            <template v-if="cell.type === 'img'">
              <img :src="cell.value" />
            </template>

            <template v-else-if="cell.type === 'pokemon-types'">
              <PokemonType
                class="types-cell"
                v-for="type in cell.value"
                :key="type.name"
                :type="type.name"
                :type-no="type.id"
              />
            </template>

            <template v-else-if="cell.type === 'link'">
              <RouterLink :to="cell.value.href">
                {{ cell.value.label }}
              </RouterLink>
            </template>

            <template v-else-if="cell.type === 'links'">
              <RouterLink v-for="link in cell.value" :key="link.href" :to="link.href">
                {{ link.label }}
              </RouterLink>
            </template>
          </template>

          <template v-else>
            {{ cell }}
          </template>
        </div>
      </div>
    </div>

    <div class="table-footer">
      <button @click="props.setPage(1)" :disabled="page === 1">Pierwszy</button>
      <button @click="props.setPage(page - 1)" :disabled="page === 1">Poprzedni</button>
      {{ page }}
      <button @click="props.setPage(page + 1)">Następny</button>
      <button @click="props.setPage(2)">Ostatni</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderType } from '@/lib/useTableParams';
import PokemonType from '../PokemonType.vue';
import type { TableColumn, TableRow } from './useTable';

const props = defineProps<{
  hiddenColumns: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: TableColumn<any>[];
  rows: TableRow[];
  page: number;
  setPage: (newPage: number) => void;
  setOrderBy: (columnName: string) => void;
  orderBy: string;
  orderType: OrderType;
}>();

const onHeaderClick = (column: TableColumn<unknown>) => {
  if (column.nonsortable) {
    return;
  }

  props.setOrderBy(column.name);
};
</script>

<style scoped>
.table {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 3px solid black;
  border-radius: 10px;
  overflow: hidden;
  background-color: whitesmoke;
}

.table-header {
  height: 5%;
  font-weight: bold;
  border-bottom: 1px solid black;
}

.table-body {
  height: 90%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.table-footer {
  height: 5%;
  border-top: 1px solid black;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

a {
  text-decoration: none;
}

.table-header,
.table-row {
  display: flex;
  justify-content: space-evenly;
  min-height: 3rem;
  align-items: center;

  div {
    text-align: center;
  }
}

.table-row {
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    img {
      height: 100%;
    }
  }

  .types-cell {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .linksCell {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .sortable {
    user-select: none;
    position: relative;
    &:hover {
      color: slateblue;
      cursor: pointer;
    }

    &.ordered {
      color: gray;
    }

    .orderArrow {
      position: absolute;
      right: -10px;

      &.desc::after {
        content: '^';
        transform: rotate(180deg);
      }

      &.asc::after {
        content: '^';
      }
    }
  }
}

.table-row:nth-of-type(even) {
  background-color: lightgrey;
}
</style>
