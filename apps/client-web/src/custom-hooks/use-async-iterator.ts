import React from 'react';

type AsyncFn = () => Promise<void>;

export function useAsyncIterator<T, TReturn = any, TNext = undefined>(
  iterator: AsyncIterator<T, TReturn, TNext>
): [T[], boolean, AsyncFn] {
  const next = React.useCallback<AsyncFn>(async () => {
    const ir = await iterator.next();
    if (ir.done) {
      setD(ir.done);
    } else {
      setV([...v, ir.value]);
    }
  }, [iterator]);

  const [v, setV] = React.useState<T[]>([]);
  const [d, setD] = React.useState<boolean>(false);

  return [v, d, next];
}
