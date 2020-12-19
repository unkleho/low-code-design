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

    return config;
  },
};
