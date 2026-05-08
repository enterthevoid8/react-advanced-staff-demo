import { useCallback, useLayoutEffect, useRef } from "react";

export function useStableEvent<T extends (...args: never[]) => unknown>(handler: T) {
  const handlerRef = useRef(handler);

  useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args: Parameters<T>) => {
    return handlerRef.current(...args);
  }, []);
}