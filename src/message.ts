export interface MessageProtcol {
  [props: string]: unknown[];
}

export type Listenner<Args extends unknown[]> = (...args: Args) => void;

const useMessageQueen = <T extends MessageProtcol>() => {
  const listennerMap = new Map<keyof T, Set<Listenner<T[keyof T]>>>();

  const on = <E extends keyof T>(event: E, listenner: Listenner<T[E]>) => {
    let set = listennerMap.get(event);
    if (!set) {
      listennerMap.set(event, (set = new Set()));
    }
    set.add(listenner as any);
  };

  const emit = <E extends keyof T>(event: E, ...args: T[E]) => {
    listennerMap.get(event)?.forEach((listenner) => listenner(...args));
  };

  const remove = <E extends keyof T>(event: E, listenner: Listenner<T[E]>) => {
    listennerMap.get(event)?.delete(listenner as any);
  };

  return {
    on,
    emit,
    remove,
  };
};
