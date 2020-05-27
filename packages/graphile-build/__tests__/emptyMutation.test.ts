import { buildSchema, defaultPlugins } from "../";

test("generates empty schema (with no Mutation type)", async () => {
  const schema = await buildSchema([...defaultPlugins]);
  expect(schema).toMatchSnapshot();
});
