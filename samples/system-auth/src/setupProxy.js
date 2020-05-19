const setupProxy = require('@kineticdata/react/proxyhelper');

const createProxyMiddleware = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    createProxyMiddleware("/app", {
      ...setupProxy(),
      secure: false,
    })
  )
}