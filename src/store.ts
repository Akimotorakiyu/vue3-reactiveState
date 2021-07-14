import { computed, ref, Ref, ComputedRef } from "vue";
import { IReactiveStore } from "./type";
import { MessageCenter, MessageProtcol } from "./message";
export const createReactiveStore = <
  T,
  Args extends unknown[],
  Protcol extends MessageProtcol
>(
  fn: (...args: Args) => Promise<T>,
  watch?: {
    messageCenter: MessageCenter<Protcol>;
    handlers: {
      [E in keyof Protcol]?: (
        ctx: {
          state: Ref<T>;
          updater: (...args: Args) => Promise<Ref<T>>;
          updateing: ComputedRef<boolean>;
        },
        event: E,
        ...args: Protcol[E]
      ) => void;
    };
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
    watch.messageCenter.addAction((event, ...args) => {
      watch.handlers[event]?.({ state, updater, updateing }, event, ...args);
    });
  }

  return { state, useData, updater, updateing };
};
