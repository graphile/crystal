const rootConfig = require("../../jest.config.base")(__dirname);

module.exports = {
  ...rootConfig,
  testMatch: [...rootConfig.testMatch, "**/*.test.graphql"],
  transform: {
    ...rootConfig.transform,
    "^.+\\.mts$": "<rootDir>/../../.jest-babel-transform.js",
    "^.+\\.graphql$": "<rootDir>/__tests__/transform-graphql.js",
  },
  moduleFileExtensions: [...rootConfig.moduleFileExtensions, "mts", "graphql"],
};
