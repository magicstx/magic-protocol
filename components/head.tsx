import React, { useEffect, useMemo } from 'react';
import NextHead from 'next/head';
import { atom, useAtom } from 'jotai';
import { useAtomValue, useUpdateAtom } from 'jotai/utils';
import { getAppIcon, getAppName } from '../common/constants';
import { pageTitleState, docTitleState } from '../common/store';

export const useSetTitle = (title: string) => {
  const setTitle = useUpdateAtom(docTitleState);
  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);
};

export const Head: React.FC = ({ children }) => {
  const titleText = useAtomValue(pageTitleState);
  const appName = useMemo(() => {
    return getAppName();
  }, []);
  const icon = useMemo(() => {
    return getAppIcon() || '/star-white.svg';
  }, []);
  return (
    <NextHead>
      <title>{titleText}</title>
      <link rel="icon" href={icon} type="image/svg+xml"></link>
      <meta property="og:title" content={appName} />
      {children}
    </NextHead>
  );
};
