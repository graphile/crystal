const { printSchema } = require("graphql");
const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");

test("Simple schema print (no ordering)", () =>
  withPgClient(async client => {
    const schema = await createPostGraphileSchema(client, ["a", "b", "c"], {
      subscriptions: true,
    });
    expect(printSchema(schema)).toMatchSnapshot();
  }));
