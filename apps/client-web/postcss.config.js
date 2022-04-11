const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, './tailwind.config.js'),
    },
    autoprefixer: {},
    // https://tailwindcss.com/docs/optimizing-for-production
    cssnano: {
      preset: 'default',
    },
  },
};
