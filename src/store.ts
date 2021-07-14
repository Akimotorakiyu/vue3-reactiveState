import {
  computed,
  ref,
  Ref,
  ComputedRef,
  getCurrentInstance,
  onUnmounted,
} from "vue";
import { MessageCenter, MessageProtcol } from "./message";
import { Portal } from "./Portal";
export interface IReactiveStore<
  T,
  Args extends unknown[],
  Protcol extends MessageProtcol
> {
  updater: (...args: Args) => Promise<Ref<T>>;
  updateing: Ref<boolean>;
  state: Ref<T>;
  provider(): void;
  portal: Portal<IReactiveStore<T, Args, Protcol>>;
  messageCenter: MessageCenter<Protcol>;
}

export const createReactiveStore = <
  T,
  Args extends unknown[],
  Protcol extends MessageProtcol
>(
  fn: (...args: Args) => Promise<T>,
  portal: Portal<IReactiveStore<T, Args, Protcol>>,
  messageCenter: MessageCenter<Protcol>,
  handlers?: {
    [E in keyof Protcol]?: (
      ctx: {
        state: Ref<T>;
        updater: (...args: Args) => Promise<Ref<T>>;
        updateing: ComputedRef<boolean>;
      },
      event: E,
      ...args: Protcol[E]
    ) => void;
  }
): IReactiveStore<T, Args, Protcol> => {
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

  if (handlers) {
    const remover = messageCenter.addAction((event, ...args) => {
      handlers[event]?.({ state, updater, updateing }, event, ...args);
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
    portal,
    messageCenter,
  };

  return reactiveStore;
};
