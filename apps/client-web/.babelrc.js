const plugins = [
  [
    // https://github.com/vercel/next.js/issues/9607
    'babel-plugin-transform-imports',
    {
      '@material-ui/core': {
        transform: '@material-ui/core/${member}',
        // transform: '@material-ui/core/esm/${member}',
        preventFullImport: true,
      },
      '@material-ui/icons': {
        transform: '@material-ui/icons/${member}',
        // transform: '@material-ui/icons/esm/${member}',
        preventFullImport: true,
      },
    },
  ],
];

module.exports = {
  presets: ['next/babel'],
  plugins: plugins,
};
