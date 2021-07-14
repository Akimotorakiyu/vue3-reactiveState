export type Listenner<
  E extends string | number | symbol,
  Args extends unknown[]
> = (event: E, ...args: Args) => void | Promise<void>;

export interface MessageProtcol {
  [props: string]: unknown[];
}

export interface MessageCenter<Protcol extends MessageProtcol> {
  removeAction: <E extends keyof Protcol, Args extends Protcol[E]>(
    listenner: Listenner<E, Args>
  ) => void;
  addAction: <E extends keyof Protcol, Args extends Protcol[E]>(
    listenner: Listenner<E, Args>
  ) => () => void;
  dispatch: <E extends keyof Protcol, Args extends Protcol[E]>(
    event: E,
    ...args: Args
  ) => (void | Promise<void>)[];
}

export const createMessageCenter = <
  Protcol extends MessageProtcol
>(): MessageCenter<Protcol> => {
  const listennerSet = new Set<
    Listenner<string | number | symbol, unknown[]>
  >();

  const removeAction = <E extends keyof Protcol, Args extends Protcol[E]>(
    listenner: Listenner<E, Args>
  ) => {
    listennerSet.delete(listenner as any);
  };

  const addAction = <E extends keyof Protcol, Args extends Protcol[E]>(
    listenner: Listenner<E, Args>
  ) => {
    listennerSet.add(listenner as any);

    return () => {
      removeAction(listenner);
    };
  };

  const dispatch = <E extends keyof Protcol, Args extends Protcol[E]>(
    event: E,
    ...args: Args
  ) => {
    return [...listennerSet].map((listenner) => listenner(event, ...args));
  };

  return {
    addAction,
    dispatch,
    removeAction,
  };
};
