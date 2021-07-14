import { Ref } from "vue";
import { Portal } from "./Portal";
import { MessageCenter, MessageProtcol } from "./message";

export interface IReactiveStore<
  T,
  Args extends unknown[],
  Protcol extends MessageProtcol
> {
  updater: (...args: Args) => Promise<Ref<T>>;
  updateing: Ref<boolean>;
  state: Ref<T>;
  provider(): void;
  portal: Portal<IReactiveStore<T, Args, Protcol>>;
  messageCenter: MessageCenter<Protcol>;
}
