import { ref } from "vue";

const createReactiveStore = <T>(fn: () => Promise<T>) => {
  const state = ref<T>();
  const updateState = async () => {
    state.value = await fn();
  };
  const useData = () => {
    return {
      state,
      promise: updateState(),
    };
  };
  return { useData };
};
