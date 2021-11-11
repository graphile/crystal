import { types as t } from "@babel/core";
import generate from "@babel/generator";
import { parseExpression } from "@babel/parser";
import type { TemplateBuilderOptions } from "@babel/template";
import template from "@babel/template";
import { writeFile } from "fs/promises";
import type { GraphQLNamedType, GraphQLSchema } from "graphql";
import { GraphQLScalarType } from "graphql";
import { GraphQLObjectType } from "graphql";

const templateOptions: TemplateBuilderOptions = {
  plugins: ["typescript"],
};

export function isNotNullish<T>(input: T | null | undefined): input is T {
  return input != null;
}

class CodegenFile {
  _variables: {
    [name: string]: true;
  } = {};
  _imports: {
    [fromModule: string]: {
      [exportName: "default" | "*" | string]: {
        variableName: t.Identifier;
        asType?: boolean;
      };
    };
  } = {};
  _statements: t.Statement[] = [];

  addStatements(statements: t.Statement | t.Statement[]): void {
    if (Array.isArray(statements)) {
      this._statements.push(...statements);
    } else {
      this._statements.push(statements);
    }
  }

  makeVariable(preferredName: string): t.Identifier {
    for (let i = 0; i < 10000; i++) {
      const variableName = preferredName + (i > 0 ? String(i + 1) : "");
      if (!this._variables[variableName]) {
        this._variables[variableName] = true;
        return t.identifier(variableName);
      }
    }
    throw new Error("Could not find a suitable variable name");
  }

  import(
    fromModule: string,
    exportName: "default" | "*" | string = "default",
    asType = false,
  ): t.Identifier {
    const importedModule =
      this._imports[fromModule] ??
      (this._imports[fromModule] = Object.create(
        null,
      ) as typeof this._imports[string]);
    const existing = importedModule[exportName];
    if (existing) {
      if (!asType) {
        existing.asType = false;
      }
      return existing.variableName;
    } else {
      const preferredName =
        exportName === "default" || exportName === "*"
          ? fromModule
          : exportName;
      const variableName = this.makeVariable(preferredName);
      importedModule[exportName] = {
        variableName,
        asType,
      };
      return variableName;
    }
  }

  toAST(): t.File {
    const importStatements: t.Statement[] = [];
    Object.keys(this._imports)
      .sort()
      .forEach((moduleName) => {
        const importedModule = this._imports[moduleName];
        const MODULE_NAME = t.stringLiteral(moduleName);
        if (!importedModule) {
          return;
        }
        const {
          "*": starImport,
          default: defaultImport,
          ...rest
        } = importedModule;
        if (starImport) {
          const VARIABLE_NAME = starImport.variableName;
          importStatements.push(
            starImport.asType
              ? importStarAsType({ MODULE_NAME, VARIABLE_NAME })
              : importStar({ MODULE_NAME, VARIABLE_NAME }),
          );
        }
        const exportNames = Object.keys(rest).sort();
        if (defaultImport || exportNames.length > 0) {
          const importStatement = t.importDeclaration(
            [
              ...(defaultImport
                ? [t.importDefaultSpecifier(defaultImport.variableName)]
                : []),
              ...(exportNames.length
                ? exportNames.map((name) =>
                    t.importSpecifier(
                      rest[name]!.variableName,
                      t.identifier(name),
                    ),
                  )
                : []),
            ],
            MODULE_NAME,
          );
          importStatements.push(importStatement);
        }
      });
    const allStatements = [...importStatements, ...this._statements];
    return t.file(t.program(allStatements));
  }
}

const importStarAsType = template.statement(
  `\
import type VARIABLE_NAME from MODULE_NAME;
`,
  templateOptions,
);
const importStar = template.statement(
  `\
import * as VARIABLE_NAME from MODULE_NAME;
`,
  templateOptions,
);

const declareObjectType = template.statement(
  // GraphQLObjectType
  `\
const VARIABLE_NAME = new CONSTRUCTOR({
  name: TYPE_NAME,
  description: DESCRIPTION,
  isTypeOf: IS_TYPE_OF,
  extensions: EXTENSIONS,
  fields: FIELDS,
  interfaces: INTERFACES
});
`,
  templateOptions,
);

const declareScalarType = template.statement(
  // GraphQLScalarType
  `\
const VARIABLE_NAME = new CONSTRUCTOR({
  name: TYPE_NAME,
  description: DESCRIPTION,
  specifiedByURL: SPECIFIED_BY_URL,
  serialize: SERIALIZE,
  parseValue: PARSE_VALUE,
  parseLiteral: PARSE_LITERAL,
  extensions: EXTENSIONS,
});
`,
  templateOptions,
);

const declareGraphqlSchema = template(
  // GraphQLSchema
  `\
export const VARIABLE_NAME = new CONSTRUCTOR({
  description: DESCRIPTION,
  query: QUERY,
  mutation: MUTATION,
  subscription: SUBSCRIPTION,
  types: TYPES,
  directives: DIRECTIVES,
  extensions: EXTENSIONS,
  assumeValid: ASSUME_VALID,
});
`,
  templateOptions,
);

function desc(description: string | null | undefined): t.Expression {
  return description ? t.stringLiteral(description) : t.nullLiteral();
}

function extensions(extensions: object) {
  // TODO
  return t.objectExpression([]);
}

function func(
  file: CodegenFile,
  func: Function | null | undefined,
): t.Expression {
  if (func == null) {
    return t.nullLiteral();
  }
  // TODO
  const result = parseExpression(func.toString(), {
    sourceType: "module",
    plugins: ["typescript"],
  });
  return result;
}

function declareType(file: CodegenFile, type: GraphQLNamedType): t.Identifier {
  if (type instanceof GraphQLObjectType) {
    const VARIABLE_NAME = file.makeVariable(type.name);
    file.addStatements(
      declareObjectType({
        VARIABLE_NAME,
        CONSTRUCTOR: file.import("graphql", "GraphQLObjectType"),
        TYPE_NAME: t.stringLiteral(type.name),
        DESCRIPTION: desc(type.description),
        IS_TYPE_OF: func(file, type.isTypeOf),
        EXTENSIONS: extensions(type.extensions),
        FIELDS: t.objectExpression([]), // TODO
        INTERFACES: t.arrayExpression([]), // TODO
      }),
    );
    return VARIABLE_NAME;
  } else if (type instanceof GraphQLScalarType) {
    const VARIABLE_NAME = file.makeVariable(type.name);
    file.addStatements(
      declareScalarType({
        VARIABLE_NAME,
        CONSTRUCTOR: file.import("graphql", "GraphQLScalarType"),
        TYPE_NAME: t.stringLiteral(type.name),
        DESCRIPTION: desc(type.description),
        SPECIFIED_BY_URL: type.specifiedByURL,
        SERIALIZE: func(file, type.serialize),
        PARSE_VALUE: func(file, type.parseValue),
        PARSE_LITERAL: func(file, type.parseLiteral),
        EXTENSIONS: extensions(type.extensions),
      }),
    );
    return VARIABLE_NAME;
  } else {
    const never /* TODO: : never*/ = type;
    throw new Error(
      `Did not understand type: ${(never as any).constructor.name}`,
    );
  }
}

const BUILTINS = ["Int", "Float", "Boolean", "ID", "String"];

export async function exportSchema(
  schema: GraphQLSchema,
  toPath: string,
): Promise<void> {
  const config = schema.toConfig();
  const file = new CodegenFile();

  const schemaExportName = file.makeVariable("schema");

  const types = config.types
    .map((type) => {
      if (!type.name.startsWith("__") && !BUILTINS.includes(type.name)) {
        return declareType(file, type);
      }
    })
    .filter(isNotNullish);

  const iGraphQLSchema = file.import("graphql", "GraphQLSchema");

  file.addStatements(
    declareGraphqlSchema({
      VARIABLE_NAME: schemaExportName,
      CONSTRUCTOR: iGraphQLSchema,
      DESCRIPTION: desc(config.description),
      QUERY: t.nullLiteral(),
      MUTATION: t.nullLiteral(),
      SUBSCRIPTION: t.nullLiteral(),
      TYPES: t.arrayExpression(types),
      DIRECTIVES: t.nullLiteral(),
      EXTENSIONS: t.nullLiteral(),
      ASSUME_VALID: t.booleanLiteral(false),
    }),
  );

  const ast = file.toAST();

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
