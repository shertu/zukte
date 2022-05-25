import React from 'react';

type AsyncFn = () => Promise<void>;

/**
 * A custom react hook which enable step-wise iteration through an iterator.
 */
export function useAsyncIterator<T, TReturn, TNext = undefined>(
  iterator: AsyncIterator<T, TReturn, TNext>
): [T[], boolean, AsyncFn] {
  // const [_iterator] = React.useState(iterator);
  const [v, setV] = React.useState<T[]>([]);
  const [d, setD] = React.useState<boolean>(false);

  React.useEffect(() => {}, [iterator]);

  const next = React.useCallback<AsyncFn>(async () => {
    const ir = await iterator.next();
    if (ir.done) {
      setD(ir.done);
    } else {
      setV([...v, ir.value]);
    }
  }, [iterator, v]);

  return [v, d, next];
}
