import { onMounted, ref, type Ref } from 'vue';

export function useRouteParams<T extends object>(defaultParams?: Partial<T>) {
  const params = ref<Partial<T>>({});

  onMounted(() => {
    const url = new URL(location.href);

    for (const key in defaultParams) {
      const k = key as keyof T;
      const v = defaultParams[k];
      params[k] = v;
    }

    for (const [key, value] of url.searchParams.entries()) {
      const k = key as keyof typeof params;
      params[k] = ref(value);
    }
  });
}
