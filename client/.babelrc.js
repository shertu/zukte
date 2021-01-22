const BabelPresetEnv = require("@babel/preset-env");
const BabelPresetReact = require("@babel/preset-react");
const BabelPluginClassProperties = require("@babel/plugin-proposal-class-properties");
const BabelPluginTransformTypescript = require("@babel/plugin-transform-typescript");

module.exports = {
  presets: [BabelPresetEnv, BabelPresetReact],
  plugins: [
    [
      BabelPluginTransformTypescript,
      {
        // this is required to prevent babel parsing TSX files incorrectly
        isTSX: true,
      },
    ],
    BabelPluginClassProperties,
  ],
};
