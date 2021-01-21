const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge(common, {
  // https://webpack.js.org/configuration/mode/
  mode: "production",

  // https://webpack.js.org/configuration/devtool/
  devtool: "source-map",

  // https://webpack.js.org/concepts/output/
  output: {
    path: path.resolve(__dirname, "../laravel/public/wwwroot"),
    publicPath: "/wwwroot/",
    //filename: '[name].bundle.js',
  },

  optimization: {
    minimizer: [
      // https://webpack.js.org/plugins/terser-webpack-plugin/
      new TerserPlugin(),

      // https://github.com/NMFR/optimize-css-assets-webpack-plugin
      new OptimizeCssAssetsPlugin({
        cssProcessor: require("cssnano"),
      }),
    ],
  },

  plugins: [
    // https://github.com/johnagan/clean-webpack-plugin
    new CleanWebpackPlugin(),

    // https://github.com/webpack-contrib/stylelint-webpack-plugin
    new StylelintPlugin({
      files: "src/**/*.(css|less|vue)",
      fix: true,
    }),

    // https://github.com/webpack-contrib/eslint-webpack-plugin
    new ESLintPlugin({
      files: "src/**/*.(js|ts|vue)",
      fix: true,
    }),

    // https://github.com/webpack-contrib/webpack-bundle-analyzer
    //new BundleAnalyzerPlugin(),
  ],
});
