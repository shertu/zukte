const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  // https://webpack.js.org/configuration/mode/
  mode: "development",

  // https://webpack.js.org/configuration/devtool/
  devtool: "inline-source-map",

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    hot: true,
    open: true,
  },
});
