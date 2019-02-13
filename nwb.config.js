module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'KineticLib',
      externals: {
        react: 'React'
      }
    }
  }
}
