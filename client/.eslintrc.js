module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "google"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  // https://github.com/google/eslint-config-google/blob/master/index.js
  rules: {
    "react/react-in-jsx-scope": "off",
    "max-len": ["error", {
      code: 80,
      tabWidth: 2,
      ignoreUrls: true,
      ignorePattern: "import .*",
    }],
    "sort-imports": ["error"],
    "@typescript-eslint/member-delimiter-style": ["error"],
    "no-console": ["error"],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
