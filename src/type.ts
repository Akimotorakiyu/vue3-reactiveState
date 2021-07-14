import { Ref } from "vue";
import { Portal } from "./Portal";
export interface IReactiveStore<T, Args extends unknown[]> {
  updater: (...args: Args) => Promise<Ref<T>>;
  updateing: Ref<boolean>;
  state: Ref<T>;
  provider(): void;
}
