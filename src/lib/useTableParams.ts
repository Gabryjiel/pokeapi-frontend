import { useRouteQuery } from '@vueuse/router';

export type OrderType = '' | 'asc' | 'desc';

export function useTableParams() {
  const page = useRouteQuery('page', 1, { mode: 'replace', transform: Number });
  const orderBy = useRouteQuery('orderBy', '' as string, { mode: 'replace' });
  const orderType = useRouteQuery('orderType', '' as OrderType, { mode: 'replace' });

  const setPage = (newPage: number) => {
    if (newPage < 1) {
      return;
    }

    page.value = newPage;
  };

  const changeOrder = (newOrderBy: string) => {
    if (orderBy.value === newOrderBy) {
      if (orderType.value === '') {
        orderType.value = 'asc';
      } else if (orderType.value === 'asc') {
        orderType.value = 'desc';
      } else {
        orderType.value = '';
        orderBy.value = '';
      }
    } else {
      orderBy.value = newOrderBy;
      orderType.value = 'asc';
    }
  };

  return {
    page,
    orderBy,
    orderType,
    setPage,
    changeOrder,
  };
}
