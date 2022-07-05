import { wrapWithMicroStacks } from '@micro-stacks/nextjs';
import { network, LOCAL_URL, getAppName, getAppIcon } from './constants';
type WrapArgs = Parameters<ReturnType<typeof wrapWithMicroStacks>>;

export function withMicroStacks(...args: WrapArgs) {
  const appName = getAppName();
  const appIcon = getAppIcon() || `${LOCAL_URL}/star-black.svg`;
  return wrapWithMicroStacks({
    authOptions: {
      appDetails: {
        name: appName,
        icon: appIcon,
      },
    },
    network,
    useCookies: true,
  })(...args);
}
