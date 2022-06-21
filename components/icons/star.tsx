import React from 'react';
import { Box, BoxProps } from '@nelson-ui/react';

export const StarIcon: React.FC<BoxProps> = props => {
  return (
    <Box display="inline-block" height="25px" width="26px" {...props}>
      <svg
        width="25"
        height="26"
        viewBox="0 0 25 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.5475 12.9684C19.4856 12.4574 12.805 5.65362 12.3047 0.5H12.2428C11.741 5.65362 5.06034 12.4574 0 12.9684V13.0316C5.06034 13.5411 11.741 20.3448 12.2428 25.5H12.3047C12.805 20.3464 19.4856 13.5426 24.5475 13.0316V12.9684Z"
          fill="url(#paint0_linear_810_2561)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_810_2561"
            x1="6.23747"
            y1="6.4"
            x2="19.4467"
            y2="19.0587"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F8A4E5" />
            <stop offset="0.234375" stopColor="#5E7FFF" />
            <stop offset="0.473958" stopColor="#38FBFC" />
            <stop offset="0.53125" stopColor="#56F9F4" />
            <stop offset="0.645833" stopColor="#FFEFC5" />
            <stop offset="0.739583" stopColor="#F8A4E5" />
            <stop offset="1" stopColor="#38FBFC" />
          </linearGradient>
        </defs>
      </svg>
    </Box>
  );
};
