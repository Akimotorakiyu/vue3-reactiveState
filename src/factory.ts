import { Ref, ComputedRef } from "vue";
import { createReactiveStore } from "./store";
import { createMessageCenter } from "./message";

export const createStoreFactory = () => {
  const messageCenter = createMessageCenter();

  const storeFactory = <T, Args extends any[], E = any>(
    fn: (...args: Args) => Promise<T>,
    handler?: (
      ctx: {
        state: Ref<T>;
        updater: (...args: Args) => Promise<Ref<T>>;
        updateing: ComputedRef<boolean>;
      },
      event: E,
      ...args: Args
    ) => void
  ) => {
    const house = createReactiveStore(
      fn,
      handler
        ? {
            messageCenter,
            handler,
          }
        : undefined
    );

    return house;
  };

  return {
    storeFactory,
    messageCenter,
  };
};
