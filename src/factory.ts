import { Ref, ComputedRef } from "vue";
import { createReactiveStore } from "./store";
import { createMessageCenter } from "./message";
import { createPortal } from "./Portal";
import { IReactiveStore } from "./type";

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
    const storeHouse = () => {
      const store = createReactiveStore(
        fn,
        handler
          ? {
              messageCenter,
              handler,
            }
          : undefined
      );

      return store;
    };

    const portal = createPortal<IReactiveStore<T, Args>>();

    return { storeHouse, portal };
  };

  return {
    storeFactory,
    messageCenter,
  };
};
