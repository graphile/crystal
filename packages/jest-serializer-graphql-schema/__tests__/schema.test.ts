import fetch from "node-fetch";
import {
  getIntrospectionQuery,
  IntrospectionQuery,
  buildClientSchema,
} from "graphql";

const GraphQLSchemaSnapshotSerializer = require("../src");
expect.addSnapshotSerializer(GraphQLSchemaSnapshotSerializer);

const getSchema = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ query: getIntrospectionQuery() }),
    headers: { "Content-Type": "application/json" },
  });
  const result = await (response.json() as Promise<{
    data: IntrospectionQuery;
  }>);
  return buildClientSchema(result.data);
};

test("Pokemon GraphQL API has a consistent schema", async () => {
  const schema = await getSchema("https://graphql-pokemon.now.sh");
  expect(schema).toMatchSnapshot();
});
