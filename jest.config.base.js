module.exports = (dir) => {
  const packageJson = require(`${dir}/package.json`);

  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.tsx?$": "babel-jest",
    },
    testMatch: ["<rootDir>/**/__tests__/**/*.test.[jt]s?(x)"],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    roots: [`<rootDir>`],
    snapshotSerializers: ["jest-serializer-graphql-schema"],

    rootDir: dir,
    name: packageJson.name,
    displayName: packageJson.name,
  };
};
