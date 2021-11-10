import { types as t } from "@babel/core";
import generate from "@babel/generator";
import template from "@babel/template";
import { writeFile } from "fs/promises";
import type { GraphQLSchema } from "graphql";

export async function exportSchema(
  schema: GraphQLSchema,
  toPath: string,
): Promise<void> {
  const config = schema.toConfig();
  const statement = template`\
export const schema = new GraphQLSchema({
  description: ${
    config.description ? t.stringLiteral(config.description) : t.nullLiteral()
  }
});
`();
  const statements = Array.isArray(statement) ? statement : [statement];
  const ast = t.file(t.program(statements));
  const { code } = generate(ast, {});
  /*
  const output = `\
export const schema = new GraphQLSchema({
  description:
});
`;
*/
  await writeFile(toPath, code);
}
