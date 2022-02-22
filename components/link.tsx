import React from 'react';
import NextLink from 'next/link';
import { BoxProps } from '@nelson-ui/react';
import { getTxUrl } from '../common/utils';
import { Text, TextProps } from './text';

export interface LinkProps extends TextProps {
  href: string;
  prefetch?: boolean;
}

// // eslint-disable-next-line react/display-name
// export const Link = React.forwardRef(({ to, prefetch, ...props }: LinkProps, ref) => {
//   return (
//     <Text as="a" color="$text" {...props} textDecoration="none" ref={ref}>
//       {children}
//     </Text>
//   );
// })

export const Link: React.FC<LinkProps> = ({ href, prefetch, children, ...props }) => {
  return (
    <NextLink href={href} passHref>
      <Text as="a" color="$text" {...props} textDecoration="none">
        {children}
      </Text>
    </NextLink>
  );
};

export const TransactionLink: React.FC<{ txid?: string }> = ({ txid }) => {
  if (!txid) return null;
  return (
    <Link href={getTxUrl(txid)} color="$action-primary" target="_blank">
      View Transaction
    </Link>
  );
};
