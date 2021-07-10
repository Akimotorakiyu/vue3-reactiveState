import { computed, ref, Ref, ComputedRef } from "vue";
import { createPortal } from "./Portal";
import { IReactiveStore } from "./type";

import { createMessageQueue, MessageQueue } from "./message";
export const createReactiveStore = <T, Args extends unknown[], E = string>(
  fn: (...args: Args) => Promise<T>,
  watch?: {
    messageQueen: MessageQueue;
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
    watch.messageQueen.addAction((event: E, ...args: Args) => {
      watch.handler(state, updater, updateing, event, ...args);
    });
  }

  const postal = createPortal<IReactiveStore<T, Args>>();

  return { state, useData, updater, updateing, postal };
};
