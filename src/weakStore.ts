import { computed, ref, watchEffect, Ref, ComputedRef } from "vue";
import { IReactiveStore } from "./type";
import { useMessageQueen } from "./message";

export const createReactiveWeakStore = <T, Args extends unknown[], E = string>(
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
  const symbol = {};
  const weakMap = new WeakMap<Object, Ref<T>>();

  const updateingPromise = ref<Promise<Ref<T>>>();
  const updateing = computed(() => {
    return updateingPromise.value ? true : false;
  });

  const takeState = () => {
    let state = weakMap.get(symbol);
    if (!state) {
      weakMap.set(symbol, (state = ref() as Ref<T>));
    }
    return state;
  };

  const updateState = async (...args: Args) => {
    const state = takeState();

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
    const state = takeState();
    return {
      state,
      promise: updater(...args),
    };
  };

  if (watch) {
    watch.messageQueen.on((event: E, ...args: Args) => {
      watch.handler(takeState(), updater, updateing, event, ...args);
    });
  }

  return {
    get state() {
      return takeState();
    },
    useData,
    updater,
    updateing,
  };
};
