import { useRouteQuery } from '@vueuse/router';
import { reactive } from 'vue';

export type OrderType = '' | 'asc' | 'desc';

export type TableParams = {
  page?: number;
  take?: number;
  orderBy?: string;
  orderType?: OrderType;
};

export function useTableParams() {
  const params = reactive({
    page: useRouteQuery('page', 1, { mode: 'replace', transform: Number }),
    orderBy: useRouteQuery('orderBy', '' as string, { mode: 'replace' }),
    orderType: useRouteQuery('orderType', '' as OrderType, { mode: 'replace' }),
  });

  const setPage = (newPage: number) => {
    if (newPage < 1) {
      return;
    }

    params.page = newPage;
  };

  const changeOrder = (newOrderBy: string) => {
    if (params.orderBy === newOrderBy) {
      if (params.orderType === '') {
        params.orderType = 'asc';
      } else if (params.orderType === 'asc') {
        params.orderType = 'desc';
      } else {
        params.orderType = '';
        params.orderBy = '';
      }
    } else {
      params.orderBy = newOrderBy;
      params.orderType = 'asc';
    }
  };

  return {
    params,
    setPage,
    changeOrder,
  };
}
