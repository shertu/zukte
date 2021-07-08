const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const fs = require('fs');

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
    // https://webpack.js.org/concepts/hot-module-replacement/
    hot: true,

    // supplement for hot-module-replacement with SPA router
    historyApiFallback: true,

    // HTTPS is required to use open id connect
    https: true,

    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        secure: false,
      },
      '/signin-oidc': {
        target: 'https://localhost:5001',
        secure: false,
      },
      '/swagger': {
        target: 'https://localhost:5001',
        secure: false,
      },
    },
  },
});
