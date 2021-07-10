import { Ref, ComputedRef } from "vue";
import { passThrough } from "./passThrough";
import { createReactiveStore } from "./store";
import { createReactiveWeakStore } from "./weakStore";
import { useMessageQueen } from "./message";

import { IReactiveStore } from "./type";

export const factory = <T, Args extends any[], E = any>(
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
) => {
  const postal = passThrough<IReactiveStore<T, Args>>();

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
