import type { MyPokemonType } from '@/lib/PokemonService';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { computed, type Ref } from 'vue';

export type TableColumnType =
  | { type: 'img'; value: string }
  | number
  | string
  | { type: 'pokemon-types'; value: MyPokemonType[] }
  | { type: 'link'; value: { label: string; href: string } }
  | { type: 'links'; value: { label: string; href: string }[] };

export type TableColumn<T> = {
  name: string;
  label: string;
  invisible?: boolean;
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

export function useTable<T>(
  values: Ref<T[]>,
  config: {
    id: string;
    columns: TableColumn<T>[];
    mapToRowMetadata: (value: T, index: number, array: T[]) => RowMetadata;
  },
) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    config.id,
    config.columns.filter((c) => c.invisible === true).map((c) => c.name),
  );

  const rows = computed(() => {
    return values.value.map((val, index, array) => {
      const cells = config.columns
        .filter((column) => !hiddenColumns.value.includes(column.name))
        .map((column) => column.map(val, index, array));
      const metadata = config.mapToRowMetadata(val, index, array);

      return {
        cells,
        metadata,
      };
    });
  });

  return {
    columns: config.columns,
    rows: rows,
    hiddenColumns,
    setHiddenColumns,
  };
}
