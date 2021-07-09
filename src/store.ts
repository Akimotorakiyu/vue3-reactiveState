import { computed, ref, Ref, ComputedRef } from "vue";
import { passThrough } from "./passThrough";
import { IReactiveStore } from "./type";

import { useMessageQueen } from "./message";
export const createReactiveStore = <T, Args extends unknown[], E = string>(
  fn: (...args: Args) => Promise<T>,
  watch?: {
    messageQueen: ReturnType<typeof useMessageQueen>;
    handler: (
      state: Ref<T>,
      updater: (...args: Args) => Promise<Ref<T>>,
      updateing: ComputedRef<boolean>,
      event: E,
      ...args: Args
    ) => void;
  }
): IReactiveStore<T, Args> => {
  const state = ref<T>() as Ref<T>;
  const updateingPromise = ref<Promise<Ref<T>>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const updateState = async (...args: Args) => {
    const value = await fn(...args);
    state.value = value;
    return state;
  };

  const updater = async (...args: Args) => {
    if (!updateingPromise.value) {
      updateingPromise.value = updateState(...args);
    }
    const value = await updateingPromise.value;
    updateingPromise.value = undefined;
    return value;
  };

  const useData = (...args: Args) => {
    return {
      state,
      promise: updater(...args),
    };
  };

  if (watch) {
    watch.messageQueen.on((event: E, ...args: Args) => {
      watch.handler(state, updater, updateing, event, ...args);
    });
  }
  return { state, useData, updater, updateing };
};
