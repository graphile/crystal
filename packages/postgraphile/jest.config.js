module.exports = {
  ...require("../../jest.config.base")(__dirname),
  testMatch: ["<rootDir>/**/__tests__/*-test.[jt]s"],
  roots: ["<rootDir>/src"],
};
