import { buildSchema, defaultPlugins, QueryQueryPlugin } from "../src";

test("generates empty schema (with no Mutation type)", async () => {
  const schema = await buildSchema([...defaultPlugins, QueryQueryPlugin]);
  expect(schema).toMatchSnapshot();
});
