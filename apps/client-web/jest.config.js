module.exports = {
  // preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  roots: ['./components'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'babel-jest',
  },
};
