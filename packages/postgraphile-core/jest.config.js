module.exports = {
  snapshotSerializers: ["jest-serializer-graphql-schema"],
  transform: {
    "^.+\\.jsx?$": "../../.jest-wrapper.js",
  },
  testRegex: "__tests__/.*\\.test\\.js$",
};
