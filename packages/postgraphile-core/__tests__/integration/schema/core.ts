import { lexicographicSortSchema, GraphQLSchema } from "graphql";
import { withPgClient } from "../../helpers";
import { createPostGraphileSchema } from "../../..";
import { PoolClient } from "pg";

export const test = (
  schemas: string | string[],
  options: GraphileEngine.PostGraphileCoreOptions = {},
  setup: ((client: PoolClient) => void) | string | null = null,
  finalCheck: (schema: GraphQLSchema) => void = () => {},
) => () =>
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
