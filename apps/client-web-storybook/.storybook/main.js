const path = require('path');

module.exports = {
  stories: ['../../client-web/components/**/*.stories.tsx'],
  addons: ['@storybook/addon-essentials'],
  typescript: {
    reactDocgen: 'false', // added because there are known issues with the default lib
  },
  webpackFinal: async config => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
      // include: path.resolve(__dirname, '../'),
    });

    // Return the altered config
    return config;
  },
};
