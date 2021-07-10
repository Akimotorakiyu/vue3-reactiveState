import { Ref } from "vue";
import { Portal } from "./Portal";
export interface IReactiveStore<T, Args extends unknown[]> {
  useData: (...args: Args) => {
    state: Ref<T>;
    promise: Promise<Ref<T>>;
  };
  updater: (...args: Args) => Promise<Ref<T>>;
  updateing: Ref<boolean>;
  state: Ref<T>;
  postal: Portal<IReactiveStore<T, Args>>;
}
