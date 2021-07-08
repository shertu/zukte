const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, '../client-web/tailwind.config.js'),
    },
  },
};
