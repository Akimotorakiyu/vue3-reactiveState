import { Ref, ComputedRef } from "vue";
import { passThrough } from "./passThrough";
import { createReactiveStore } from "./store";
import { createReactiveWeakStore } from "./weakStore";
import { useMessageQueen } from "./message";
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
  const postal = passThrough<T>();

  const storehouse = () => {
    return createReactiveStore(fn, watch);
  };

  const warehouse = () => {
    return createReactiveWeakStore(fn, watch);
  };

  return {
    postal,
    storehouse,
    warehouse,
  };
};
