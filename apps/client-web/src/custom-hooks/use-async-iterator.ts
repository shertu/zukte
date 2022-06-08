import React from 'react';

type AsyncFn = () => Promise<void>;

/**
 * A custom hook which enables step-wise iteration through an async iterator.
 */
export function useAsyncIterator<T, TReturn, TNext = undefined>(
  iterator: AsyncIterator<T, TReturn, TNext>
): [T[], boolean, AsyncFn] {
  const [_iterator] = React.useState(iterator);
  const [v, setV] = React.useState<T[]>([]);
  const [d, setD] = React.useState<boolean>(false);

  const next = React.useCallback<AsyncFn>(async () => {
    const ir = await _iterator.next();
    if (ir.done) {
      setD(ir.done);
    } else {
      setV([...v, ir.value]);
    }
  }, [_iterator, v]);

  return [v, d, next];
}
