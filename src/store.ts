import {
  computed,
  ref,
  Ref,
  ComputedRef,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { IReactiveStore } from "./type";
import { MessageCenter, MessageProtcol } from "./message";
import { Portal } from "./Portal";
export const createReactiveStore = <
  T,
  Args extends unknown[],
  Protcol extends MessageProtcol
>(
  fn: (...args: Args) => Promise<T>,
  portal: Portal<IReactiveStore<T, Args>>,
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

  if (watch) {
    const remover = watch.messageCenter.addAction((event, ...args) => {
      watch.handlers[event]?.({ state, updater, updateing }, event, ...args);
    });

    if (getCurrentInstance()) {
      onUnmounted(() => {
        remover();
      });
    }
  }

  const reactiveStore = {
    state,
    updater,
    updateing,
    provider() {
      portal.provider(reactiveStore);
    },
  };

  return reactiveStore;
};
