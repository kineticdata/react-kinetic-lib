// webpack.config.js
const path = require('path');
const neutrino = require('neutrino');
const webpackConfig = neutrino().webpack();

module.exports = {
  ...webpackConfig,
  entry: {
    index: path.resolve('src', 'index.js'),
  },
};
