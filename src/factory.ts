import { Ref, ComputedRef } from "vue";
import { createReactiveStore } from "./store";
import { createMessageCenter, MessageProtcol } from "./message";
import { createPortal } from "./Portal";
import { IReactiveStore } from "./type";

export const createStoreFactory = <Protcol extends MessageProtcol>() => {
  const messageCenter = createMessageCenter<Protcol>();

  const storeFactory = <T, Args extends any[]>(
    fn: (...args: Args) => Promise<T>,
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
  ) => {
    const portal = createPortal<IReactiveStore<T, Args, Protcol>>();

    const storeHouse = () => {
      const reactiveStore = createReactiveStore(
        fn,
        portal,
        messageCenter,
        handlers
      );

      return reactiveStore;
    };

    return { storeHouse, portal };
  };

  return {
    storeFactory,
    messageCenter,
  };
};
