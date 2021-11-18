import generate from "@babel/generator";
import { parseExpression } from "@babel/parser";
import type { TemplateBuilderOptions } from "@babel/template";
import template from "@babel/template";
import * as t from "@babel/types";
import { writeFile } from "fs/promises";
import { $$crystalWrapped } from "graphile-crystal";
import type {
  GraphQLArgumentConfig,
  GraphQLDirective,
  GraphQLDirectiveConfig,
  GraphQLEnumTypeConfig,
  GraphQLFieldConfig,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLInputFieldConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputObjectTypeConfig,
  GraphQLInterfaceTypeConfig,
  GraphQLNamedType,
  GraphQLObjectTypeConfig,
  GraphQLScalarTypeConfig,
  GraphQLSchema,
  GraphQLSchemaConfig,
  GraphQLType,
  GraphQLUnionTypeConfig,
} from "graphql";
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
} from "graphql";
import type { URL } from "url";
import { inspect } from "util";

//const reallyGenerate = (generate as any).default as typeof generate;
const reallyGenerate = generate;

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

type AnyFunction = {
  (...args: any[]): any;
  displayName?: string;
};

function isExportedFn<T extends AnyFunction, TTuple extends any[]>(
  thing: T,
): thing is T & {
  $exporter$args: [...TTuple];
  $exporter$factory: (...args: TTuple) => T;
} {
  return "$exporter$factory" in thing;
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
      declaration: t.Statement | null;
    };
  } = Object.create(null);
  _directives: {
    [typeName: string]: {
      directive: GraphQLDirective;
      variableName: t.Identifier;
      declaration: t.Statement | null;
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
    const spec: CodegenFile["_types"][string] = {
      type,
      variableName: VARIABLE_NAME,
      declaration: null,
    };
    this._types[type.name] = spec;
    // Must perform declaration _AFTER_ registering type, otherwise we might
    // get infinite recursion.
    spec.declaration = this.makeTypeDeclaration(type, VARIABLE_NAME);
    return VARIABLE_NAME;
  }

  declareDirective(directive: GraphQLDirective): t.Identifier {
    const existing = this._directives[directive.name];
    if (existing) {
      if (existing.directive !== directive) {
        throw new Error("Duplicate types with same name found! Error!");
      }
      return existing.variableName;
    }
    const config = directive.toConfig();
    const VARIABLE_NAME = this.makeVariable(config.name);
    const spec: CodegenFile["_directives"][string] = {
      directive,
      variableName: VARIABLE_NAME,
      declaration: null,
    };
    this._directives[config.name] = spec;
    const locationHint = `@${config.name}`;
    // Must perform declaration _AFTER_ registering type, otherwise we might
    // get infinite recursion.
    const iDirectiveLocation = this.import("graphql", "DirectiveLocation");
    spec.declaration = declareGraphQLEntity(
      this,
      VARIABLE_NAME,
      "GraphQLDirective",
      {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        locations: t.arrayExpression(
          config.locations.map((l) =>
            t.memberExpression(iDirectiveLocation, t.identifier(String(l))),
          ),
        ),
        args:
          config.args && Object.keys(config.args).length > 0
            ? this.makeFieldArgs(config.args, `${locationHint}.args`)
            : null,
        isRepeatable: t.booleanLiteral(config.isRepeatable),
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
      },
    );
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

  // For objects and interfaces
  private makeObjectFields(
    fields: GraphQLFieldConfigMap<any, any>,
    typeName: string,
  ): t.Expression {
    const obj = Object.entries(fields).reduce((memo, [fieldName, config]) => {
      if (!fieldName.startsWith("__")) {
        const locationHint = `${typeName}.fields[${fieldName}]`;
        const mappedConfig: {
          [key in keyof GraphQLFieldConfig<any, any> as Exclude<
            keyof GraphQLFieldConfig<any, any>,
            "astNode"
          >]-?: t.Expression | null;
        } = {
          description: desc(config.description),
          type: this.typeExpression(config.type),
          args:
            config.args && Object.keys(config.args).length > 0
              ? this.makeFieldArgs(
                  config.args,
                  `${typeName}.fields[${fieldName}].args`,
                )
              : null,
          resolve: config.resolve
            ? func(this, config.resolve, `${locationHint}.resolve`)
            : null,
          subscribe: config.subscribe
            ? func(this, config.subscribe, `${locationHint}.subscribe`)
            : null,
          deprecationReason: desc(config.deprecationReason),
          extensions: extensions(
            this,
            config.extensions,
            `${locationHint}.extensions`,
          ),
        };
        memo[fieldName] = configToAST(mappedConfig);
      }
      return memo;
    }, {} as { [key: string]: t.Expression | null });
    return t.objectExpression(objectToObjectProperties(obj));
  }

  private makeInputObjectFields(
    fields: GraphQLInputFieldConfigMap,
    typeName: string,
  ): t.Expression {
    const obj = Object.entries(fields).reduce((memo, [fieldName, config]) => {
      if (!fieldName.startsWith("__")) {
        const locationHint = `${typeName}.fields[${fieldName}]`;
        const mappedConfig: {
          [key in keyof GraphQLInputFieldConfig as Exclude<
            keyof GraphQLInputFieldConfig,
            "astNode"
          >]-?: t.Expression | null;
        } = {
          description: desc(config.description),
          type: this.typeExpression(config.type),
          defaultValue:
            config.defaultValue !== undefined
              ? convertToAST(
                  this,
                  config.defaultValue,
                  `${locationHint}.defaultValue`,
                )
              : null,
          deprecationReason: desc(config.deprecationReason),
          extensions: extensions(
            this,
            config.extensions,
            `${locationHint}.extensions`,
          ),
        };
        memo[fieldName] = configToAST(mappedConfig);
      }
      return memo;
    }, {} as { [key: string]: t.Expression | null });
    return t.objectExpression(objectToObjectProperties(obj));
  }

  private makeFieldArgs(
    args: GraphQLFieldConfigArgumentMap,
    baseLocationHint: string,
  ): t.Expression {
    const obj = Object.entries(args).reduce((memo, [argName, config]) => {
      if (!argName.startsWith("__")) {
        const locationHint = `${baseLocationHint}[${argName}]`;
        const mappedConfig: {
          [key in keyof GraphQLArgumentConfig as Exclude<
            keyof GraphQLArgumentConfig,
            "astNode"
          >]-?: t.Expression | null;
        } = {
          description: desc(config.description),
          type: this.typeExpression(config.type),
          defaultValue:
            config.defaultValue !== undefined
              ? convertToAST(
                  this,
                  config.defaultValue,
                  `${locationHint}.defaultValue`,
                )
              : null,
          deprecationReason: desc(config.deprecationReason),
          extensions: extensions(
            this,
            config.extensions,
            `${locationHint}.extensions`,
          ),
        };
        memo[argName] = configToAST(mappedConfig);
      }
      return memo;
    }, {} as { [key: string]: t.Expression | null });
    return t.objectExpression(objectToObjectProperties(obj));
  }

  private makeTypeDeclaration(
    type: GraphQLNamedType,
    VARIABLE_NAME: t.Identifier,
  ): t.Statement {
    if (type instanceof GraphQLObjectType) {
      const config = type.toConfig();
      return declareGraphQLEntity(this, VARIABLE_NAME, "GraphQLObjectType", {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        isTypeOf: config.isTypeOf
          ? func(this, config.isTypeOf, `${config.name}.isTypeOf`)
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
        fields: t.arrowFunctionExpression(
          [],
          this.makeObjectFields(config.fields, config.name),
        ),
        interfaces:
          config.interfaces.length > 0
            ? t.arrowFunctionExpression(
                [],
                t.arrayExpression(
                  config.interfaces.map((interfaceType) =>
                    this.declareType(interfaceType),
                  ),
                ),
              )
            : null,
      });
    } else if (type instanceof GraphQLInterfaceType) {
      const config = type.toConfig();
      return declareGraphQLEntity(this, VARIABLE_NAME, "GraphQLInterfaceType", {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        resolveType: config.resolveType
          ? func(this, config.resolveType, `${config.name}.resolveType`)
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
        fields: t.arrowFunctionExpression(
          [],
          this.makeObjectFields(config.fields, config.name),
        ),
        interfaces:
          config.interfaces.length > 0
            ? t.arrayExpression(
                config.interfaces.map((interfaceType) =>
                  this.declareType(interfaceType),
                ),
              )
            : null,
      });
    } else if (type instanceof GraphQLUnionType) {
      const config = type.toConfig();
      return declareGraphQLEntity(this, VARIABLE_NAME, "GraphQLUnionType", {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        resolveType: config.resolveType
          ? func(this, config.resolveType, `${config.name}.resolveType`)
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
        types: t.arrayExpression(config.types.map((t) => this.declareType(t))),
      });
    } else if (type instanceof GraphQLInputObjectType) {
      const config = type.toConfig();
      return declareGraphQLEntity(
        this,
        VARIABLE_NAME,
        "GraphQLInputObjectType",
        {
          name: t.stringLiteral(config.name),
          description: desc(config.description),
          extensions: extensions(
            this,
            config.extensions,
            `${config.name}.extensions`,
          ),
          fields: t.arrowFunctionExpression(
            [],
            this.makeInputObjectFields(config.fields, config.name),
          ),
        },
      );
    } else if (type instanceof GraphQLScalarType) {
      const config = type.toConfig();
      return declareGraphQLEntity(this, VARIABLE_NAME, "GraphQLScalarType", {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        specifiedByURL: desc(config.specifiedByURL),
        serialize: func(this, config.serialize, `${config.name}.serialize`),
        parseValue: func(this, config.parseValue, `${config.name}.parseValue`),
        parseLiteral: func(
          this,
          config.parseLiteral,
          `${config.name}.parseLiteral`,
        ),
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
      });
    } else if (type instanceof GraphQLEnumType) {
      const config = type.toConfig();
      return declareGraphQLEntity(this, VARIABLE_NAME, "GraphQLEnumType", {
        name: t.stringLiteral(config.name),
        description: desc(config.description),
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
        ),
        values: objectNullPrototype(
          Object.entries(config.values).map(([key, value]) =>
            t.objectProperty(
              t.identifier(key),
              convertToAST(
                this,
                value,
                `${config.name}.values[${JSON.stringify(key)}]`,
              ),
            ),
          ),
        ),
      });
    } else {
      const never: never = type;
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
    const typeDeclarationStatements = Object.values(this._types)
      .map((v) => v.declaration)
      .filter(isNotNullish);
    const directiveDeclarationStatements = Object.values(this._directives)
      .map((v) => v.declaration)
      .filter(isNotNullish);
    const allStatements = [
      ...importStatements,
      ...typeDeclarationStatements,
      ...directiveDeclarationStatements,
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

const declareConstructorWithConfig = template.statement(
  `\
export const VARIABLE_NAME = new CONSTRUCTOR(CONFIG);
`,
  templateOptions,
);

type GraphQLEntityName =
  | "GraphQLSchema"
  | "GraphQLDirective"
  | "GraphQLObjectType"
  | "GraphQLInterfaceType"
  | "GraphQLUnionType"
  | "GraphQLInputObjectType"
  | "GraphQLScalarType"
  | "GraphQLEnumType";
type ConfigForGraphQLEntity<TKey extends GraphQLEntityName> =
  TKey extends "GraphQLSchema"
    ? GraphQLSchemaConfig
    : TKey extends "GraphQLDirective"
    ? GraphQLDirectiveConfig
    : TKey extends "GraphQLObjectType"
    ? GraphQLObjectTypeConfig<unknown, unknown>
    : TKey extends "GraphQLInterfaceType"
    ? GraphQLInterfaceTypeConfig<unknown, unknown>
    : TKey extends "GraphQLUnionType"
    ? GraphQLUnionTypeConfig<unknown, unknown>
    : TKey extends "GraphQLInputObjectType"
    ? GraphQLInputObjectTypeConfig
    : TKey extends "GraphQLScalarType"
    ? GraphQLScalarTypeConfig<unknown, unknown>
    : TKey extends "GraphQLEnumType"
    ? GraphQLEnumTypeConfig
    : never;

function declareGraphQLEntity<TKey extends GraphQLEntityName>(
  file: CodegenFile,
  VARIABLE_NAME: t.Identifier,
  constructorName: TKey,
  config: {
    [key in keyof ConfigForGraphQLEntity<TKey> as Exclude<
      keyof ConfigForGraphQLEntity<TKey>,
      "astNode" | "extensionASTNodes"
    >]-?: t.Expression | null;
  },
) {
  return declareConstructorWithConfig({
    VARIABLE_NAME,
    CONSTRUCTOR: file.import("graphql", constructorName),
    CONFIG: configToAST(config),
  });
}

function desc(description: string | null | undefined): t.Expression | null {
  return description ? t.stringLiteral(description) : null;
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

function configToAST(o: {
  [key: string]: t.Expression | null;
}): t.ObjectExpression {
  return t.objectExpression(objectToObjectProperties(o));
}

function objectToObjectProperties(o: {
  [key: string]: t.Expression | null;
}): t.ObjectProperty[] {
  return Object.entries(o)
    .filter(([, value]) => value != null)
    .map(([key, value]) => t.objectProperty(t.identifier(key), value!));
}

function extensions(
  file: CodegenFile,
  extensions: object | null | undefined,
  locationHint: string,
): t.Expression | null {
  if (extensions == null || Object.keys(extensions).length === 0) {
    return null;
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
  fn: AnyFunction,
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
      return t.callExpression(
        iCrystalWrapResolve,
        crystalSpec.original
          ? [
              func(
                file,
                crystalSpec.original,
                locationHint + `[$$crystalWrapped]`,
              ),
            ]
          : [t.identifier("undefined")],
      );
    }
  }

  // Determine if we should wrap it in an IIFE to put the variables into
  // scope; e.g.:
  //
  // `(() => { const foo = 1, bar = 2; return /*>*/() => {return foo+bar}/*<*/})();`
  if (isExportedFn(fn)) {
    const funcAST = funcToAst(fn.$exporter$factory, locationHint);
    return t.callExpression(
      funcAST,
      fn.$exporter$args.map((arg, i) =>
        convertToAST(
          file,
          arg,
          `${locationHint}[$$scope][${JSON.stringify(i)}]`,
        ),
      ),
    );
  } else {
    return funcToAst(fn, locationHint);
  }
}

function funcToAst(fn: AnyFunction, locationHint: string): t.Expression {
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
  toPath: string | URL,
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

  const customDirectives = config.directives.filter(
    (d) =>
      ![
        "skip",
        "include",
        "deprecated",
        "specifiedBy",
        "defer",
        "stream",
      ].includes(d.name),
  );

  file.addStatements(
    declareGraphQLEntity(file, schemaExportName, "GraphQLSchema", {
      description: desc(config.description),
      query: config.query ? file.declareType(config.query) : t.nullLiteral(),
      mutation: config.mutation
        ? file.declareType(config.mutation)
        : t.nullLiteral(),
      subscription: config.subscription
        ? file.declareType(config.subscription)
        : t.nullLiteral(),
      types: t.arrayExpression(types),
      directives:
        customDirectives.length > 0
          ? t.arrayExpression(
              customDirectives.map((directive) =>
                file.declareDirective(directive),
              ),
            )
          : null,
      extensions: extensions(file, config.extensions, "schema.extensions"),
      assumeValid: null, // TODO: t.booleanLiteral(true),
    }),
  );

  const ast = file.toAST();

  const { code } = reallyGenerate(ast, {});
  await writeFile(toPath, code);
}
