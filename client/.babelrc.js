const BabelPresetEnv = require("@babel/preset-env");
const BabelPresetReact = require("@babel/preset-react");

module.exports = {
  presets: [BabelPresetReact],
  plugins: [
    "@babel/plugin-transform-typescript",
    "@babel/plugin-proposal-class-properties",
  ],
};
