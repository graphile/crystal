import { types as t } from "@babel/core";
import generate from "@babel/generator";
import { parseExpression } from "@babel/parser";
import type { TemplateBuilderOptions } from "@babel/template";
import template from "@babel/template";
import { writeFile } from "fs/promises";
import { $$crystalWrapped, ExecutablePlan } from "graphile-crystal";
import type {
  GraphQLFieldConfigMap,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLType,
} from "graphql";
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
} from "graphql";
import { inspect } from "util";

const templateOptions: TemplateBuilderOptions = {
  plugins: ["typescript"],
};

export function isNotNullish<T>(input: T | null | undefined): input is T {
  return input != null;
}

function isImportable(
  thing: unknown,
): thing is { $$export: { moduleName: string; exportName: string } } {
  return thing != null && "$$export" in (thing as object | AnyFunction);
}

type AnyFunction = (...args: any[]) => any;

function hasScope<T extends AnyFunction>(
  thing: T,
): thing is T & { $$scope: { [variableName: string]: any } } {
  return "$$scope" in thing;
}

const BUILTINS = ["Int", "Float", "Boolean", "ID", "String"];
function isBuiltinType(type: GraphQLNamedType): boolean {
  return type.name.startsWith("__") || BUILTINS.includes(type.name);
}

class CodegenFile {
  _variables: {
    [name: string]: true;
  } = Object.create(null);
  _imports: {
    [fromModule: string]: {
      [exportName: "default" | "*" | string]: {
        variableName: t.Identifier;
        asType?: boolean;
      };
    };
  } = Object.create(null);
  _types: {
    [typeName: string]: {
      type: GraphQLNamedType;
      variableName: t.Identifier;
      declaration: t.Statement;
    };
  } = Object.create(null);

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

  declareType(type: GraphQLNamedType): t.Identifier {
    const existing = this._types[type.name];
    if (existing) {
      if (existing.type !== type) {
        throw new Error("Duplicate types with same name found! Error!");
      }
      return existing.variableName;
    }
    if (BUILTINS.includes(type.name)) {
      return this.import("graphql", "GraphQL" + type.name);
    }
    if (isBuiltinType(type)) {
      throw new Error(
        `declareType called with introspection type '${type.name}'`,
      );
    }
    const VARIABLE_NAME = this.makeVariable(type.name);
    this._types[type.name] = {
      type,
      variableName: VARIABLE_NAME,
      declaration: this.makeTypeDeclaration(type, VARIABLE_NAME),
    };
    return VARIABLE_NAME;
  }

  private typeExpression(type: GraphQLType): t.Expression {
    if (type instanceof GraphQLNonNull) {
      const iGraphQLNonNull = this.import("graphql", "GraphQLNonNull");
      return t.newExpression(iGraphQLNonNull, [
        this.typeExpression(type.ofType),
      ]);
    } else if (type instanceof GraphQLList) {
      const iGraphQLList = this.import("graphql", "GraphQLList");
      return t.newExpression(iGraphQLList, [this.typeExpression(type.ofType)]);
    } else {
      return this.declareType(type);
    }
  }

  private makeObjectFields(
    fields: GraphQLFieldConfigMap<any, any>,
    typeName: string,
  ): t.Expression {
    const properties: t.ObjectProperty[] = [];
    for (const fieldName in fields) {
      if (!fieldName.startsWith("__")) {
        const config = fields[fieldName]!;
        const locationHint = `${typeName}.fields[${fieldName}]`;
        properties.push(
          t.objectProperty(
            t.identifier(fieldName),
            expressionObjectFieldSpec({
              DESCRIPTION: desc(config.description),
              TYPE: this.typeExpression(config.type),
              ARGS: t.identifier("undefined"), // TODO
              RESOLVE: func(this, config.resolve, `${locationHint}.resolve`),
              SUBSCRIBE: func(
                this,
                config.subscribe,
                `${locationHint}.subscribe`,
              ),
              DEPRECATION_REASON: desc(config.deprecationReason),
              EXTENSIONS: extensions(
                this,
                config.extensions,
                `${locationHint}.extensions`,
              ),
            }),
          ),
        );
      }
    }
    return t.objectExpression(properties);
  }

  private makeTypeDeclaration(
    type: GraphQLNamedType,
    VARIABLE_NAME: t.Identifier,
  ): t.Statement {
    if (type instanceof GraphQLObjectType) {
      const config = type.toConfig();
      return declareObjectType({
        VARIABLE_NAME,
        CONSTRUCTOR: this.import("graphql", "GraphQLObjectType"),
        TYPE_NAME: t.stringLiteral(config.name),
        DESCRIPTION: desc(config.description),
        IS_TYPE_OF: func(this, config.isTypeOf, `${type.name}.isTypeOf`),
        EXTENSIONS: extensions(
          this,
          config.extensions,
          `${type.name}.extensions`,
        ),
        FIELDS: t.arrowFunctionExpression(
          [],
          this.makeObjectFields(config.fields, config.name),
        ),
        INTERFACES: t.arrayExpression([]), // TODO
      });
    } else if (type instanceof GraphQLScalarType) {
      return declareScalarType({
        VARIABLE_NAME,
        CONSTRUCTOR: this.import("graphql", "GraphQLScalarType"),
        TYPE_NAME: t.stringLiteral(type.name),
        DESCRIPTION: desc(type.description),
        SPECIFIED_BY_URL: desc(type.specifiedByURL),
        SERIALIZE: func(this, type.serialize, `${type.name}.serialize`),
        PARSE_VALUE: func(this, type.parseValue, `${type.name}.parseValue`),
        PARSE_LITERAL: func(
          this,
          type.parseLiteral,
          `${type.name}.parseLiteral`,
        ),
        EXTENSIONS: extensions(
          this,
          type.extensions,
          `${type.name}.extensions`,
        ),
      });
    } else {
      const never /* TODO: : never*/ = type;
      throw new Error(
        `Did not understand type: ${(never as any).constructor.name}`,
      );
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
    const typeDeclarationStatements = Object.values(this._types).map(
      (v) => v.declaration,
    );
    const allStatements = [
      ...importStatements,
      ...typeDeclarationStatements,
      ...this._statements,
    ];
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

const expressionObjectFieldSpec = template.expression(
  `\
{
  description: DESCRIPTION,
  type: TYPE,
  args: ARGS,
  resolve: RESOLVE,
  subscribe: SUBSCRIBE,
  deprecationReason: DEPRECATION_REASON,
  extensions: EXTENSIONS,
}
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

function convertToAST(
  file: CodegenFile,
  thing: unknown,
  locationHint: string,
  depth = 0,
): t.Expression {
  if (depth > 100) {
    throw new Error(
      `convertToAST: potentially infinite recursion at ${locationHint}. TODO: allow exporting recursive structures.`,
    );
  }
  if (thing === null) {
    return t.nullLiteral();
  } else if (thing === undefined) {
    return t.identifier("undefined");
  } else if (typeof thing === "boolean") {
    return t.booleanLiteral(thing);
  } else if (typeof thing === "string") {
    return t.stringLiteral(thing);
  } else if (typeof thing === "number") {
    return t.numericLiteral(thing);
  } else if (isImportable(thing)) {
    const { moduleName, exportName } = thing.$$export;
    return file.import(moduleName, exportName);
  } else if (Array.isArray(thing)) {
    return t.arrayExpression(
      thing.map((entry, i) =>
        convertToAST(file, entry, locationHint + `[${i}]`, depth + 1),
      ),
    );
  } else if (typeof thing === "function") {
    return func(file, thing as AnyFunction, locationHint);
  } else if (typeof thing === "object" && thing != null) {
    return t.objectExpression(
      Object.entries(thing).map(([key, value]) =>
        t.objectProperty(
          t.identifier(key),
          convertToAST(
            file,
            value,
            locationHint + `[${JSON.stringify(key)}]`,
            depth + 1,
          ),
        ),
      ),
    );
  } else {
    throw new Error(
      `convertToAST: did not understand item (${inspect(
        thing,
      )}) at ${locationHint}`,
    );
  }
}

function extensions(
  file: CodegenFile,
  extensions: object | null | undefined,
  locationHint: string,
) {
  if (extensions == null) {
    return t.objectExpression([]);
  }
  return convertToAST(file, extensions, locationHint);
}

/** Maps to `Object.assign(Object.create(null), {...})` */
export function objectNullPrototype(
  properties: t.ObjectProperty[],
): t.Expression {
  return t.callExpression(
    t.memberExpression(t.identifier("Object"), t.identifier("assign")),
    [
      t.callExpression(
        t.memberExpression(t.identifier("Object"), t.identifier("create")),
        [t.nullLiteral()],
      ),
      t.objectExpression(properties),
    ],
  );
}

function iife(statements: t.Statement[]): t.Expression {
  return t.callExpression(
    t.arrowFunctionExpression([], t.blockStatement(statements)),
    [],
  );
}

function func(
  file: CodegenFile,
  fn: AnyFunction | null | undefined,
  locationHint: string,
): t.Expression {
  if (fn == null) {
    return t.identifier("undefined");
  }
  const crystalSpec = fn[$$crystalWrapped] as {
    original: AnyFunction | undefined;
    isSubscribe: boolean;
  };
  if (crystalSpec) {
    if (crystalSpec.isSubscribe) {
      const iMakeCrystalSubscriber = file.import(
        "graphile-crystal",
        "makeCrystalSubscriber",
      );
      return t.callExpression(iMakeCrystalSubscriber, []);
    } else {
      const iCrystalWrapResolve = file.import(
        "graphile-crystal",
        "crystalWrapResolve",
      );
      return t.callExpression(iCrystalWrapResolve, [
        func(file, crystalSpec.original, locationHint + `[$$crystalWrapped]`),
      ]);
    }
  }

  // Determine if we should wrap it in an IIFE to put the variables into
  // scope; e.g.:
  //
  // `(() => { const foo = 1, bar = 2; return /*>*/() => {return foo+bar}/*<*/})();`
  const funcAST = funcToAst(fn);
  const scope = hasScope(fn) ? fn.$$scope : null;
  const scopeKeys = scope ? Object.keys(scope) : null;
  const variableDeclarations =
    scope && scopeKeys
      ? scopeKeys
          .map((key) => {
            const value = scope[key];
            const convertedValue = convertToAST(
              file,
              value,
              `${locationHint}[$$scope][${JSON.stringify(key)}]`,
            );
            if (
              convertedValue.type === "Identifier" &&
              convertedValue.name === key
            ) {
              // The import is sufficient for it to be in scope
              return null;
            }
            return t.variableDeclarator(t.identifier(key), convertedValue);
          })
          .filter(isNotNullish)
      : [];

  if (variableDeclarations.length > 0) {
    return iife([
      t.variableDeclaration("const", variableDeclarations),
      t.returnStatement(funcAST),
    ]);
  } else {
    return funcAST;
  }
}

function funcToAst(fn: AnyFunction): t.Expression {
  const funcString = fn.toString().trim();
  try {
    const result = parseExpression(funcString, {
      sourceType: "module",
      plugins: ["typescript"],
    });
    return result;
  } catch (e) {
    try {
      // Parsing failed; so it's not any of these:
      //
      // - () => {}
      // - async () => {}
      // - function(){}
      // - async function(){}
      //
      // Guessing it must be a property method declaration then; let's try adding the `function` keyword
      const modifiedDefinition = funcString.startsWith("async ")
        ? "async function " + funcString.substring(6)
        : "function " + funcString;
      const result = parseExpression(modifiedDefinition, {
        sourceType: "module",
        plugins: ["typescript"],
      });
      return result;
    } catch {
      console.error(
        `Function export error - failed to process function definition '${fn.toString()}'`,
      );
      throw e;
    }
  }
}

export async function exportSchema(
  schema: GraphQLSchema,
  toPath: string,
): Promise<void> {
  const config = schema.toConfig();
  const file = new CodegenFile();

  const schemaExportName = file.makeVariable("schema");

  const types = config.types
    .map((type) => {
      if (!isBuiltinType(type)) {
        return file.declareType(type);
      }
    })
    .filter(isNotNullish);

  const iGraphQLSchema = file.import("graphql", "GraphQLSchema");

  file.addStatements(
    declareGraphqlSchema({
      VARIABLE_NAME: schemaExportName,
      CONSTRUCTOR: iGraphQLSchema,
      DESCRIPTION: desc(config.description),
      QUERY: config.query ? file.declareType(config.query) : t.nullLiteral(),
      MUTATION: config.mutation
        ? file.declareType(config.mutation)
        : t.nullLiteral(),
      SUBSCRIPTION: config.subscription
        ? file.declareType(config.subscription)
        : t.nullLiteral(),
      TYPES: t.arrayExpression(types),
      DIRECTIVES: t.nullLiteral(), // TODO
      EXTENSIONS: extensions(file, config.extensions, "schema.extensions"),
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
