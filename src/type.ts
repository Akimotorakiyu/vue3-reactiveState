import { Ref } from "vue";

export interface IReactiveStore<T, Args> {
  useData: (args: Args) => {
    state: Ref<T>;
    promise: Promise<T>;
  };
  updater: (args: Args) => Promise<T>;
  updateing: Ref<boolean>;
}
