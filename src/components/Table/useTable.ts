import type { MyPokemonType } from '@/lib/PokemonService';
import { computed, ref, type Ref } from 'vue';

export type TableColumnType =
  | { type: 'img'; value: string }
  | number
  | string
  | { type: 'pokemon-types'; value: MyPokemonType[] };

export type TableColumn<T> = {
  name: string;
  label: string;
  nonsortable?: boolean;
  width?: string;
  map: (value: T, index: number, array: T[]) => TableColumnType;
};

export type RowMetadata = {
  id: number;
};

export type TableRow = {
  cells: TableColumnType[];
  metadata: RowMetadata;
};

export function useTable<T>(config: {
  columns: TableColumn<T>[];
  mapToRowMetadata: (value: T, index: number, array: T[]) => RowMetadata;
  values: Ref<T[]>;
}) {
  const page = ref(1);
  const rows = computed(() => {
    return config.values.value.map((val, index, array) => {
      const cells = config.columns.map((column) => column.map(val, index, array));
      const metadata = config.mapToRowMetadata(val, index, array);

      return {
        cells,
        metadata,
      };
    });
  });

  const setPage = (newPage: number) => {
    if (newPage < 1) {
      return;
    }

    page.value = newPage;
  };

  return {
    columns: config.columns,
    rows: rows,
    page,
    setPage,
  };
}
