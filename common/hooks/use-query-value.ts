import type { Atom } from 'jotai';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';

export function useQueryAtomValue<T>(anAtom: Atom<T>) {
  const atom = useMemo(() => anAtom, [anAtom]);
  const value = useAtomValue(atom);
  return value;
}
