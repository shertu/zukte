import React from 'react';

export function useWindow(
  callback: (window: Window & typeof globalThis) => void
): void {
  React.useEffect(() => {
    callback(window);
  }, [callback]);
}
