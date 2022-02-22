import React, { useEffect, useMemo } from 'react';
import NextHead from 'next/head';
import { atom, useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';

export const docTitleState = atom('');

export const useSetTitle = (title: string) => {
  const [_, setTitle] = useAtom(docTitleState);
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
};

export const Head: React.FC = ({ children }) => {
  const title = useAtomValue(docTitleState);
  const titleText = useMemo(() => {
    return title ? `- ${title}` : 'Bridge';
  }, [title]);
  return (
    <NextHead>
      <title>✨ Magic {titleText} ✨ </title>
      <link rel="icon" href="/burst.svg" type="image/svg+xml"></link>
      {children}
    </NextHead>
  );
};
