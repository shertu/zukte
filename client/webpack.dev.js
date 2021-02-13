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

    // HTTPS connection is required to use open id connect
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
    },
  },
});
