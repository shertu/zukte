module.exports = {
  // preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  roots: ['./components', './utilities'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'babel-jest',
  },
};
