import { computed, ref, watchEffect } from "vue";
import { IReactiveStore } from "./type";
export const createReactiveStore = <T, Args extends unknown[]>(
  fn: (args: Args) => Promise<T>
): IReactiveStore<T, Args> => {
  const state = ref<T>();
  const updateingPromise = ref<Promise<T>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const updateState = async (args: Args) => {
    const value = await fn(args);
    state.value = value;
    return value;
  };

  const updater = async (args: Args) => {
    if (!updateingPromise.value) {
      updateingPromise.value = updateState(args);
    }
    const value = await updateingPromise.value;
    updateingPromise.value = null;
    return value;
  };

  const useData = (args: Args) => {
    return {
      state,
      promise: updater(args),
    };
  };
  return { useData, updater, updateing };
};
