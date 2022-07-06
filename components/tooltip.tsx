import type { ReactElement, ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { keyframes } from '@nelson-ui/core';
import { styled } from '@stitches/react';
import Tippy from '@tippyjs/react/headless';
import type { Placement, Content, Props } from 'tippy.js';
import { followCursor } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import type { BoxProps } from '@nelson-ui/react';
import { Box } from '@nelson-ui/react';

const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
});

const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
});

const StyledContent = styled(TooltipPrimitive.Content, {
  borderRadius: 4,
  padding: '10px 15px',
  fontSize: 15,
  lineHeight: 1,
  color: '$text',
  backgroundColor: '$grey-900',
  boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

const StyledArrow = styled(TooltipPrimitive.Arrow, {
  fill: 'white',
});

export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = StyledContent;

const StyledTooltip = styled('div', {
  borderRadius: '10px',
  padding: '12px 16px',
  color: '$text',
  backgroundColor: '$grey-900',
  // boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  // boxShadow: 'rgba(255,255,255, 0.2) 0 0 2px',
  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',
    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': { animationName: slideDownAndFade },
      '&[data-side="right"]': { animationName: slideLeftAndFade },
      '&[data-side="bottom"]': { animationName: slideUpAndFade },
      '&[data-side="left"]': { animationName: slideRightAndFade },
    },
  },
});

export type TippyAttrs = {
  'data-placement': Placement;
  'data-reference-hidden'?: string;
  'data-escaped'?: string;
};

export type TooltipRender = (attrs: TippyAttrs) => ReactNode;

export const TooltipTippy: React.FC<{
  render: ReactNode;
  children: ReactElement;
  tippyProps?: Partial<Props>;
  containerProps?: BoxProps;
}> = ({ render, children, tippyProps, containerProps }) => {
  return (
    <Tippy
      {...tippyProps}
      plugins={[followCursor]}
      render={attrs => (
        <StyledTooltip {...containerProps} {...attrs}>
          {render}
        </StyledTooltip>
      )}
    >
      {children}
    </Tippy>
  );
};
