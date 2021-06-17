import { Ref } from "vue";

export interface IReactiveStore<T, Args extends unknown[]> {
  useData: (...args: Args) => {
    state: Ref<T>;
    promise: Promise<Ref<T>>;
  };
  updater: (...args: Args) => Promise<Ref<T>>;
  updateing: Ref<boolean>;
  state: Ref<T>;
}
