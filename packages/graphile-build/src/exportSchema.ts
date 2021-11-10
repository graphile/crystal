import { types as t } from "@babel/core";
import generate from "@babel/generator";
import { writeFile } from "fs/promises";
import type { GraphQLSchema } from "graphql";

export async function exportSchema(
  schema: GraphQLSchema,
  toPath: string,
): Promise<void> {
  const config = schema.toConfig();
  const ast = t.file(
    t.program([
      t.exportNamedDeclaration(
        t.variableDeclaration("const", [
          t.variableDeclarator(
            t.identifier("schema"),
            t.newExpression(t.identifier("GraphQLSchema"), [
              t.objectExpression([
                t.objectProperty(
                  t.identifier("description"),
                  config.description
                    ? t.stringLiteral(config.description)
                    : t.nullLiteral(),
                ),
              ]),
            ]),
          ),
        ]),
      ),
    ]),
  );
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
