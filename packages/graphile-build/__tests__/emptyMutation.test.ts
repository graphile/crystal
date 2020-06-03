import { buildSchema, defaultPlugins } from "../src";

test("generates empty schema (with no Mutation type)", async () => {
  const schema = await buildSchema([...defaultPlugins]);
  expect(schema).toMatchSnapshot();
});
