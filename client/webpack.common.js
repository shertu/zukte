const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var webpack = require('webpack');

module.exports = {
  // https://webpack.js.org/concepts/entry-points/
  entry: [
    require("regenerator-runtime/path").path,
    path.resolve(__dirname, "src/webpack-entry.ts"),
  ],

  plugins: [
    // https://webpack.js.org/plugins/html-webpack-plugin/
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      favicon: path.resolve(__dirname, "src/favicon.ico"),
    }),

    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin(),
  ],

  // https://webpack.js.org/configuration/resolve/
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },

  module: {
    rules: [
      {
        test: /\.html$/i,
        // https://webpack.js.org/loaders/html-loader/
        loader: "html-loader",
      },
      {
        test: /\.(css|less)$/i,
        use: [
          // https://webpack.js.org/plugins/mini-css-extract-plugin/
          MiniCssExtractPlugin.loader,

          // https://webpack.js.org/loaders/css-loader/
          "css-loader",

          // https://webpack.js.org/loaders/less-loader/
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: {
                  //'primary-color': '#1DA57A',
                },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          // https://webpack.js.org/loaders/babel-loader/
          "babel-loader",
        ],
      },
    ],
  },
};
