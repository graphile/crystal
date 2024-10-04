const rootConfig = require("../../jest.config.base")(__dirname);

module.exports = {
  ...rootConfig,
  testMatch: [...rootConfig.testMatch, "**/*.test.graphql"],
  transform: {
    ...rootConfig.transform,
    "^.+\\.graphql$": "<rootDir>/__tests__/transform-graphql.mjs",
  },
  moduleFileExtensions: [...rootConfig.moduleFileExtensions, "graphql"],
  workerIdleMemoryLimit: "1GiB",
  maxWorkers: process.env.JEST_MAX_WORKERS || "75%",
};
