module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', './node_modules/gts/'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'require-jsdoc': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
