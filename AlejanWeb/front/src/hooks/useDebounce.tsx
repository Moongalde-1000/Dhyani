import { useEffect, useCallback } from 'react';

// Define the type for the effect function
type EffectCallback = () => void | (() => void | undefined);

// Define the type for the dependencies array
type DependencyList = ReadonlyArray<unknown>;

export default function useDebounce(effect: EffectCallback, dependencies: DependencyList, delay: number) {
  const callback = useCallback(effect, dependencies);

  useEffect(() => {
    const timeout = setTimeout(callback, delay);
    return () => clearTimeout(timeout);
  }, [callback, delay]);
}
