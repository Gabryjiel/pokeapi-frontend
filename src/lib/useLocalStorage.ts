import { ref } from 'vue';

export function useLocalStorage<Type>(key: string, defaultValue: Type) {
  const localStorageValue = localStorage.getItem(key);
  const value = ref<Type>(localStorageValue === null ? defaultValue : JSON.parse(localStorageValue));

  const setValue = (setter: Type | ((oldValue: Type) => Type)) => {
    if (typeof setter !== 'function') {
      value.value = setter;
    } else {
      value.value = setter(value.value);
    }

    localStorage.setItem(key, JSON.stringify(value.value));
  };

  return [value, setValue] as const;
}
