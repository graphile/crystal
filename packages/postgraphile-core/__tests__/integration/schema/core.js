const printSchemaOrdered = require("../../printSchemaOrdered");
const { withPgClient } = require("../../helpers");
const { createPostGraphileSchema } = require("../../..");

exports.test = (schemas, options, setup) => () =>
  withPgClient(async client => {
    if (setup) {
      if (typeof setup === 'function') {
        await setup(client);
      } else {
        await client.query(setup);
      }
    }
    const schema = await createPostGraphileSchema(client, schemas, options);
    expect(printSchemaOrdered(schema)).toMatchSnapshot();
  });
