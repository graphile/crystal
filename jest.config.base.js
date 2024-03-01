if (!("GRAPHILE_ENV" in process.env)) {
  process.env.GRAPHILE_ENV = "test";
}
module.exports = (dir) => {
  const packageJson = require(`${dir}/package.json`);

  return {
    testEnvironment: "node",
    transform: {
      "^.+\\.jsx?$": `${__dirname}/.jest-babel-transform.js`,
      "^.+\\.tsx?$": `${__dirname}/.jest-babel-transform.js`,
    },
    testMatch: ["<rootDir>/**/__tests__/**/*.test.[jt]s?(x)"],
    moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
    roots: [`<rootDir>`],
    snapshotSerializers: [
      `${__dirname}/utils/jest-serializer-graphql-schema`,
      `${__dirname}/utils/jest-serializer-simple`,
    ],
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },

    rootDir: dir,
    // name: packageJson.name,
    displayName: packageJson.name,
    globals: {
      /*
      "ts-jest": {
        // Ref: https://github.com/votingworks/ballot-encoder/pull/13/files/b5bbb770c1cc0777c0aee1455b61497afd46cccd#r381505804
        // ts-jest assumes it can walk up from its location on disk to find
        // package.json, but this is not true when operating in the yarn PnP
        // virtual file system. Instead, we provide it directly.
        packageJson,
      },
      */
    },

    setupFiles: [`${__dirname}/__tests__/setup-mock-fs.ts`],
    // Jest doesn't currently support prettier v3; see https://github.com/jestjs/jest/issues/14305
    prettierPath: require.resolve("@localrepo/prettier2-for-jest"),
  };
};
