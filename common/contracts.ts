import { WebProvider } from '@clarigen/web';
import { network } from './constants';

export const webProvider = () => {
  return WebProvider({ network });
};
