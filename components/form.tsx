import { styled } from '@stitches/react';
import { Box } from '@nelson-ui/react';
// import { styled } from '../common/theme';

export const Input = styled('input', {
  all: 'unset',
  width: '100%',
  display: 'inline-flex',
  alignItems: 'left',
  justifyContent: 'left',
  textAlign: 'left',
  borderRadius: '$medium',
  border: '1px solid $color-border-subdued',
  padding: '0 18px',
  height: '64px',
  fontSize: '16px',
  lineHeight: 1,
  color: '$text',
  boxSizing: 'border-box',
  backgroundColor: '$color-surface',
});
