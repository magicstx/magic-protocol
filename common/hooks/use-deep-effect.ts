import { DependencyList, useEffect, useRef } from 'react';
import isEqual from 'lodash-es/isEqual';

function useDeepCompareMemoize<T>(value: T) {
  const ref = useRef<T>(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

type Effect = Parameters<typeof useEffect>[0];

export function useDeepEffect(cb: Effect, deps: DependencyList) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(cb, deps.map(useDeepCompareMemoize));
}
