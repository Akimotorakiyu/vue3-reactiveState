import { provide, inject } from "vue";

/**
 * 一般是用这个
 * @returns
 */
export const passThrough = <T>() => {
  const symbolKey = Symbol();

  const provider = (state: T) => {
    return provide(symbolKey, state);
  };

  const injector = (state: T) => {
    return inject(symbolKey, state);
  };

  return {
    provider,
    injector,
  };
};

/**
 *  这个应该是用不到的
 * @param state
 * @returns
 */
export const passThroughState = <T>(state: T) => {
  const symbolKey = Symbol();

  const provider = () => {
    return provide(symbolKey, state);
  };

  const injector = () => {
    return inject(symbolKey, state);
  };

  return {
    provider,
    injector,
  };
};
