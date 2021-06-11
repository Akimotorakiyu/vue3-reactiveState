import { Ref } from "vue";

export interface IReactiveStore<T> {
  useData: () => {
    state: Ref<T>;
    promise: Promise<T>;
  };
  updater: () => Promise<T>;
  updateing: Ref<boolean>;
}
