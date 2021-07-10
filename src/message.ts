export type Listenner<Args extends unknown[]> = (
  ...args: Args
) => void | Promise<void>;

export interface MessageQueue {
  removeAction: <Args extends unknown[]>(listenner: Listenner<Args>) => void;
  addAction: <Args extends unknown[]>(listenner: Listenner<Args>) => () => void;
  dispatch: <Args extends unknown[]>(...args: Args) => (void | Promise<void>)[];
}

export const createMessageQueue = (): MessageQueue => {
  const listennerSet = new Set<Listenner<unknown[]>>();

  const removeAction = <Args extends unknown[]>(listenner: Listenner<Args>) => {
    listennerSet.delete(listenner as any);
  };

  const addAction = <Args extends unknown[]>(listenner: Listenner<Args>) => {
    listennerSet.add(listenner as any);

    return () => {
      removeAction(listenner);
    };
  };

  const dispatch = <Args extends unknown[]>(...args: Args) => {
    return [...listennerSet].map((listenner) => listenner(...args));
  };

  return {
    addAction,
    dispatch,
    removeAction,
  };
};
