const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Inter var', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'entail-red': '#EF5D60',
        'entail-orange': '#ED7F40',
        'entail-yellow': '#FED766',
        'entail-yellow-text': '#D5A725',
        'entail-green': '#14AC37',
        'entail-blue': '#189FB7',
        'entail-indigo': '#6073FF',
        'entail-violet': '#A864FF',
        'entail-pink': '#EF66CA',

        'entail-text-dark': '#EFF1F3',
        'entail-cards-dark': '#2C2A31',
        'entail-base-dark': '#1C1C1F',
        'entail-buckets-dark': '#0B0B0D',

        'entail-text-light': '#2C2A31',
        'entail-cards-light': '#EFF1F3',
        'entail-base-light': '#DFDFE0',
        'entail-buckets-light': '#D1D1D2',

        'entail-text-secondary': '#696773',
      },
    },
    screens: defaultTheme.screens,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
