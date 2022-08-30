const { printSchema } = require("graphql");
const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");
const { snapshot } = require("../../helpers-v5");

test("Simple schema print (no ordering)", () =>
  withPgClient(async client => {
    const schema = await createPostGraphileSchema(client, ["a", "b", "c"], {
      subscriptions: true,
    });
    const filePath = `${__filename.replace(/\.test\.[jt]s$/, "")}.graphql`;
    return snapshot(printSchema(schema), filePath);
  }));
