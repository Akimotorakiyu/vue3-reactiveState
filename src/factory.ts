import { passThrough } from "./passThrough";
import { createReactiveStore } from "./store";
import { createReactiveWeakStore } from "./weakStore";

export const factory = <T, Args extends unknown[]>(
  fn: (args: Args) => Promise<T>
) => {
  const postal = passThrough<T>();

  const storehouse = () => {
    return createReactiveStore(fn);
  };

  const warehouse = () => {
    return createReactiveWeakStore(fn);
  };

  return {
    postal,
    storehouse,
    warehouse,
  };
};
