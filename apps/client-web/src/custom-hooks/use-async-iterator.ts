import React from 'react';

export function useAsyncIterator<T, TReturn = any, TNext = undefined>(
  iterator: AsyncIterator<T, TReturn, TNext>
): [T[], boolean, () => Promise<void>] {
  const [vs, setVs] = React.useState<T[]>([]);
  const [done, setDone] = React.useState<boolean>(false);

  async function next() {
    const ir = await iterator.next();
    if (ir.done) {
      setDone(ir.done);
    } else {
      setVs([...vs, ir.value]);
    }
  }

  return [vs, done, next];
}
