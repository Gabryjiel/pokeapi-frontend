<template>
  <div class="table">
    <div class="table-header table-row">
      <div v-for="column in props.columns" :key="column.name" :class="{
        cell: true,
        nonsortable: column.nonsortable
      }" :style="{ width: column.width ?? '100%' }">
        {{ column.label }}
      </div>
    </div>

    <div class="table-body">
      <div class="table-row" v-for="row in props.rows" :key="row.metadata.id">
        <div v-for="(cell, index) in row.cells" :key="`${row.metadata.id}:${cell}`" :class="{
          cell: true,
          ['types-cell']: typeof cell === 'object' && cell.type === 'pokemon-types'
        }" :style="{ width: props.columns[index].width ?? '100%' }">
          <template v-if="typeof cell === 'string' || typeof cell === 'number'">
            {{ cell }}
          </template>

          <template v-else-if="typeof cell === 'object'">
            <template v-if="cell.type === 'img'">
              <img :src="cell.value" />
            </template>

            <template v-else-if="cell.type === 'pokemon-types'">
              <PokemonType class="types-cell" :key="type.name" v-for="type in cell.value" :type="type.name"
                :type-no="type.id" />
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
import PokemonType from '../PokemonType.vue';
import type { TableColumn, TableRow } from './useTable';


const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: TableColumn<any>[]
  rows: TableRow[];
  page: number;
  setPage: (newPage: number) => void;
}>();

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

.table-row {
  display: flex;
  justify-content: space-evenly;
  height: 3rem;

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

  .sortable {
    &:hover {
      color: slateblue;
      cursor: pointer;
    }
  }
}

.table-row:nth-of-type(even) {
  background-color: lightgrey;
}
</style>
