const NextFederationPlugin = require('@module-federation/nextjs-mf');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/ui', '@repo/config'],
  webpack(config, _options) {
    config.resolve.plugins = (config.resolve.plugins || []).filter((plugin) => {
      const name =
        plugin && typeof plugin === 'object' && plugin.constructor && plugin.constructor.name;
      return name !== 'OptionalPeerDependencyResolverPlugin';
    });

    config.plugins.push(
      new NextFederationPlugin({
        name: 'admin',
        remotes: {},
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './admin-metrics': './src/federation/AdminMetricsPanel.tsx',
          './admin-widget': './src/federation/AdminWidget.tsx',
        },
        shared: {},
      })
    );
    return config;
  },
};

module.exports = nextConfig;
