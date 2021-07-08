const plugins = [
  [
    'babel-plugin-transform-imports',
    {
      '@material-ui/core': {
        transform: '@material-ui/core/${member}',
        // transform: '@material-ui/core/esm/${member}', https://github.com/vercel/next.js/issues/9607
        preventFullImport: true,
      },
      /** @todo transform icon library imports */
    },
  ],
];

module.exports = {
  presets: ['next/babel'],
  plugins: plugins,
};
