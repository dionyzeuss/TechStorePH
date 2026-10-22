const withTM = require('next-transpile-modules')(['bcrypt', '@mapbox/node-pre-gyp']);

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    config.module.rules.push({
      test: /\.node$/,
      loader: 'node-loader',
    });
    return config;
  },
  transpileModules: ['bcrypt', '@mapbox/node-pre-gyp'],
};

module.exports = nextConfig;