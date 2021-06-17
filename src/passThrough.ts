import { provide, inject } from "vue";

export const passThroughT = <T>() => {
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

export const passThroughS = <T>(state: T) => {
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
