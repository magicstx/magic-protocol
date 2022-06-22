const { resolve } = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack: config => {
    const alias = config.resolve.alias || (config.resolve.alias = {});
    alias['jotai'] = resolve(__dirname, 'node_modules', 'jotai');
    alias['react-query'] = resolve(__dirname, 'node_modules', 'react-query');
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
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },
};
