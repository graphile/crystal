const { lexicographicSortSchema, printSchema } = require("graphql");
const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");
const { snapshot } = require("../../helpers-v5");

let countByPath = Object.create(null);

exports.test =
  (testPath, schemas, options, setup, finalCheck = async () => {}) =>
  () =>
    withPgClient(async client => {
      if (setup) {
        if (typeof setup === "function") {
          await setup(client);
        } else {
          await client.query(setup);
        }
      }
      const schema = await createPostGraphileSchema(client, schemas, options);
      const i = testPath in countByPath ? countByPath[testPath] + 1 : 1;
      countByPath[testPath] = i;
      const sorted = lexicographicSortSchema(schema);
      const printed = printSchema(sorted);
      const filePath = `${testPath.replace(/\.test\.[jt]s$/, "")}.${i}.graphql`;
      await snapshot(printed, filePath);
      await finalCheck(schema);
    });
