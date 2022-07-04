import React from 'react';

type Input<T = string> = [T, (input: T) => void];

export function useInput<T>(input: Input<T>) {
  const [value, setter] = input;
  const onChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.currentTarget.value as unknown as T);
    },
    [setter]
  );
  return {
    value,
    onChange,
  };
}
