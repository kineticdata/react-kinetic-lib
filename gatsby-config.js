module.exports = {
  pathPrefix: '/react-kinetic-lib',
  plugins: ['gatsby-theme-docz'],
  proxy: {
    prefix: '/app',
    url: 'https://kineticdata.kinops.io',
  },
};
