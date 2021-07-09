export type Listenner<Args extends unknown[]> = (...args: Args) => void;

export const useMessageQueen = () => {
  const listennerSet = new Set<Listenner<unknown[]>>();

  const remove = <Args extends unknown[]>(listenner: Listenner<Args>) => {
    listennerSet.delete(listenner as any);
  };

  const on = <Args extends unknown[]>(listenner: Listenner<Args>) => {
    listennerSet.add(listenner as any);

    return () => {
      remove(listenner);
    };
  };
  const emit = <Args extends unknown[]>(...args: Args) => {
    listennerSet.forEach((listenner) => listenner(...args));
  };

  return {
    on,
    emit,
    remove,
  };
};
