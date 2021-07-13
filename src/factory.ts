import { Ref, ComputedRef } from "vue";
import { createReactiveStore } from "./store";
import { createMessageQueue } from "./message";

export const createFactory = () => {
  const messageQueen = createMessageQueue();

  const storehouse = <T, Args extends any[], E = any>(
    fn: (...args: Args) => Promise<T>,
    handler?: (
      state: Ref<T>,
      updater: (...args: Args) => Promise<Ref<T>>,
      updateing: ComputedRef<boolean>,
      event: E,
      ...args: Args
    ) => void
  ) => {
    const house = createReactiveStore(
      fn,
      handler
        ? {
            messageQueen,
            handler,
          }
        : undefined
    );

    return house;
  };

  return {
    storehouse,
  };
};
