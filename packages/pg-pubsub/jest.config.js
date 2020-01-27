module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  snapshotSerializers: ["jest-serializer-graphql-schema"],
  testRegex: "(/__tests__/.*\\.(test|spec))\\.[tj]sx?$",
};
