// TODO: Remove react-children-utilities
// const withTM = require('next-transpile-modules')(['react-children-utilities']); // pass the modules you would like to see transpiled

// module.exports = withTM();

module.exports = {
  webpack: function (config) {
    const originalEntry = config.entry;
    config.entry = async () => {
      const entries = await originalEntry();

      // This breaks fast-refresh for some reason
      // if (
      //   entries['main.js'] &&
      //   !entries['main.js'].includes('./lib/react-render-hook.js')
      // ) {
      //   entries['main.js'].unshift('./lib/react-render-hook.js');
      // }

      return entries;
    };

    const rule = config.module.rules
      .find((rule) => rule.oneOf)
      .oneOf.find(
        (r) =>
          // Find the global CSS loader
          r.issuer && r.issuer.include && r.issuer.include.includes('_app'),
      );
    if (rule) {
      rule.issuer.include = [
        rule.issuer.include,
        // Allow `monaco-editor` to import global CSS:
        /[\\/]node_modules[\\/]monaco-editor[\\/]/,
      ];
    }

    return config;
  },
};
