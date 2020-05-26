module.exports = (dir) => {
  const packageJson = require(`${dir}/package.json`);

  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.jsx?$": `${__dirname}/.jest-babel-transform.js`,
      "^.+\\.tsx?$": require.resolve("ts-jest"),
    },
    testMatch: ["<rootDir>/**/__tests__/**/*.test.[jt]s?(x)"],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    roots: [`<rootDir>`],
    snapshotSerializers: [
      `${__dirname}/packages/jest-serializer-graphql-schema`,
    ],

    rootDir: dir,
    name: packageJson.name,
    displayName: packageJson.name,

    setupFiles: [`${__dirname}/__tests__/setup-mock-fs.ts`],
  };
};
