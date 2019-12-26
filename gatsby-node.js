const path = require('path');
exports.onCreateWebpackConfig = args => {
  args.actions.setWebpackConfig({
    resolve: {
      alias: {
        '@kineticdata/react': path.resolve(__dirname, '../src/'),
      },
    },
  });
};
