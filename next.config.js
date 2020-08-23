const withTM = require('next-transpile-modules')(['react-children-utilities']); // pass the modules you would like to see transpiled

// module.exports = withTM();

module.exports = withTM({
  webpack: function (cfg) {
    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();

      // This breaks fast-refresh for some reason
      if (
        entries['main.js'] &&
        !entries['main.js'].includes('./lib/react-render-hook.js')
      ) {
        entries['main.js'].unshift('./lib/react-render-hook.js');
      }

      return entries;
    };

    return cfg;
  },
});
