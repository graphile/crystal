const { lexicographicSortSchema } = require("graphql");
const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");

exports.test = (schemas, options, setup, finalCheck = () => {}) => () =>
  withPgClient(async (client) => {
    if (setup) {
      if (typeof setup === "function") {
        await setup(client);
      } else {
        await client.query(setup);
      }
    }
    let spy;
    if (
      options &&
      (options.ignoreRBAC === false || options.ignoreIndexes === false)
    ) {
      // Ignore warnings from ignoreRBAC/ignoreIndexes
      spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    }
    const schema = await createPostGraphileSchema(client, schemas, options);
    expect(lexicographicSortSchema(schema)).toMatchSnapshot();
    await finalCheck(schema);
  });
