module.exports = {
  snapshotSerializers: [`${__dirname}/packages/jest-serializer-graphql-schema`],
  roots: ["<rootDir>/packages"],
  transform: {
    "^.+\\.jsx?$": "<rootDir>/.jest-wrapper.js",
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["<rootDir>/packages/*/**/__tests__/**/*.test.[jt]s?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testEnvironment: "node",
};
