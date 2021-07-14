import { provide, inject } from "vue";

export interface Portal<T> {
  provider: (state: T) => void;
  injector: () => T;
  symbolKey: symbol;
}

/**
 * 一般是用这个
 * @returns
 */
export const createPortal = <T>(): Portal<T> => {
  const symbolKey = Symbol();

  const provider = (state: T) => {
    return provide(symbolKey, state);
  };

  const injector = () => {
    return inject<T>(symbolKey)!;
  };

  return {
    provider,
    injector,
    symbolKey,
  };
};
