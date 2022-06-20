import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { network, LOCAL_URL } from './constants';
type WrapArgs = Parameters<ReturnType<typeof wrapWithMicroStacks>>;

export function withMicroStacks(...args: WrapArgs) {
  return wrapWithMicroStacks({
    authOptions: {
      appDetails: {
        name: 'Magic Bridge',
        icon: `${LOCAL_URL}/burst.svg`,
      },
    },
    network,
    useCookies: true,
  })(...args);
}
