const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  // https://webpack.js.org/configuration/mode/
  mode: "development",

  // https://webpack.js.org/configuration/devtool/
  devtool: "inline-source-map",

  // https://webpack.js.org/concepts/output/
  output: {
    publicPath: "/",
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    hot: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:5000',
      '/signin-oidc': 'http://localhost:5000',
      // onProxyReq: function (proxyReq, req, res) {
      //   if (proxyReq.getHeader('origin')) {
      //     proxyReq.setHeader('origin', 'http://localhost:3000')
      //   }
      //   proxyReq.setHeader('x-added', 'foobar');
      // },
      // cookieDomainRewrite: ""
    },
  },
});
