import { Ref, ComputedRef } from "vue";
import { createPortal } from "./Portal";
import { createReactiveStore } from "./store";
import { createReactiveWeakStore } from "./weakStore";
import { createMessageQueue } from "./message";

import { IReactiveStore } from "./type";

export const createFactory = <T, Args extends any[], E = any>(
  fn: (...args: Args) => Promise<T>,
  watch?: {
    messageQueen: ReturnType<typeof createMessageQueue>;
    handler: (
      state: Ref<T>,
      updater: (...args: Args) => Promise<Ref<T>>,
      updateing: ComputedRef<boolean>,
      event: E,
      ...args: Args
    ) => void;
  }
) => {
  const postal = createPortal<IReactiveStore<T, Args>>();

  const storehouse = () => {
    const house = createReactiveStore(fn, watch);
    house.postal = postal;

    return house;
  };

  const warehouse = () => {
    const house = createReactiveWeakStore(fn, watch);
    house.postal = postal;

    return house;
  };

  return {
    postal,
    storehouse,
    warehouse,
  };
};
