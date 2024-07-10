//eslint-disable-next-line no-undef
module.exports = {
  transform: {
    '\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
  "moduleNameMapper": {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  }
};
