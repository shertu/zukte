const BabelPresetEnv = require("@babel/preset-env");
const BabelPresetReact = require("@babel/preset-react");
const BabelPluginClassProperties = require("@babel/plugin-proposal-class-properties");
const BabelPluginTransformTypescript = require("@babel/plugin-transform-typescript");
const BabelPluginImport = require("babel-plugin-import");

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
    [BabelPluginImport, {
      "libraryName": "antd",
      "style": true,   // or 'css'
    }]
  ],
};
