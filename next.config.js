const { resolve } = require('path');
const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },
  eslint: {
    dirs: ['common', 'components', 'pages', 'scripts', 'test'],
  },
  webpack: config => {
    const alias = config.resolve.alias || (config.resolve.alias = {});
    alias['jotai'] = resolve(__dirname, 'node_modules', 'jotai');
    alias['react-query'] = resolve(__dirname, 'node_modules', 'react-query');
    alias['jotai-query-toolkit'] = resolve(__dirname, 'node_modules', 'jotai-query-toolkit');
    alias['@stitches/react'] = resolve(__dirname, 'node_modules', '@stitches/react');
    alias['@stitches/core'] = resolve(__dirname, 'node_modules', '@stitches/core');
    return {
      ...config,
      watchOptions: {
        ...(config.watchOptions || {}),
        ignored: ['**/node_modules', '**/.next', '**/.yalc'],
      },
    };
  },
  async headers() {
    return [
      {
        // matching all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
