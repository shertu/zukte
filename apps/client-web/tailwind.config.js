/* eslint-disable node/no-unpublished-require */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    ...defaultTheme,
    extend: {
      colors: {
        darker: 'rgba(0, 0, 0, 0.04)',
        primary: {
          100: '#f7d9d5',
          200: '#efb3ac',
          300: '#e88d82',
          400: '#e06759',
          500: '#d8412f',
          600: '#ad3426',
          700: '#82271c',
          800: '#561a13',
          900: '#2b0d09',
        },
        secondary: {
          100: '#fdf4eb',
          200: '#fbead6',
          300: '#f9dfc2',
          400: '#f7d5ad',
          500: '#f5ca99',
          600: '#c4a27a',
          700: '#93795c',
          800: '#62513d',
          900: '#31281f',
        },
      },
      spacing: {
        'office-word': '2.54cm',
      },
    },
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
  },
};
