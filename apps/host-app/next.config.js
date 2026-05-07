const NextFederationPlugin = require('@module-federation/nextjs-mf');

const ADMIN_ORIGIN = process.env.NEXT_PUBLIC_ADMIN_APP_URL || 'http://localhost:3001';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui', '@repo/config'],
  webpack(config, options) {
    config.resolve.plugins = (config.resolve.plugins || []).filter((plugin) => {
      const name =
        plugin && typeof plugin === 'object' && plugin.constructor && plugin.constructor.name;
      return name !== 'OptionalPeerDependencyResolverPlugin';
    });

    const { isServer } = options;
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        remotes: {
          admin: `admin@${ADMIN_ORIGIN}/_next/static/${isServer ? 'ssr' : 'chunks'}/remoteEntry.js`,
        },
        filename: 'static/chunks/remoteEntry.js',
        shared: {},
      })
    );
    return config;
  },
};

module.exports = nextConfig;
