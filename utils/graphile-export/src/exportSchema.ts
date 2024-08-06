import { writeFile } from "node:fs/promises";
import type { URL } from "node:url";
import { inspect } from "node:util";

import generate from "@babel/generator";
import { parse } from "@babel/parser";
import type { TemplateBuilderOptions } from "@babel/template";
import template from "@babel/template";
import type { NodePath } from "@babel/traverse";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import type {
  GraphQLArgumentConfig,
  GraphQLDirective,
  GraphQLDirectiveConfig,
  GraphQLEnumTypeConfig,
  GraphQLEnumValueConfig,
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
} from "grafast/graphql";
import {
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLUnionType,
  isDirective,
  isNamedType,
  isSchema,
  printSchema,
} from "grafast/graphql";
import type { GraphQLSchemaNormalizedConfig } from "graphql/type/schema";
import type { PgSQL, SQL } from "pg-sql2";

import type { ExportOptions } from "./interfaces.js";
import { optimize } from "./optimize/index.js";
import { reservedWords } from "./reservedWords.js";
import { wellKnown } from "./wellKnown.js";

// Cannot import sql because it's optional
//     import { sql } from "pg-sql2";
// Instead:
let sql: PgSQL | undefined;
import("pg-sql2").then(
  (pgSql2) => {
    sql = pgSql2.sql;
  },
  (_e) => {
    // no pg-sql2 module; no matter
  },
);

function isSQL(thing: unknown): thing is SQL {
  if (sql !== undefined) {
    return sql.isSQL(thing);
  } else {
    // An approximation
    if (typeof sql === "object" && sql !== null) {
      return Object.getOwnPropertySymbols(thing).some(
        (s) => s.description === "pg-sql2-type",
      );
    } else {
      return false;
    }
  }
}

// Do **NOT** allow variables that start with `__`!
export const canRepresentAsIdentifier = (key: string) =>
  /^(?:[a-z$]|_[a-z0-9$])[a-z0-9_$]*$/i.test(key);

function identifierOrLiteral(key: string | number) {
  if (typeof key === "number") {
    return t.numericLiteral(key);
  }
  if (canRepresentAsIdentifier(key)) {
    return t.identifier(key);
  } else {
    return t.stringLiteral(key);
  }
}
function literal(key: string | number) {
  if (typeof key === "number") {
    return t.numericLiteral(key);
  } else {
    return t.stringLiteral(key);
  }
}

function locationHintToIdentifierName(locationHint: string): string {
  let result = locationHint;
  result = result.replace(/[[.]/g, "__").replace(/\]/g, "");
  result = result.replace(/[^a-z0-9_]+/gi, "");
  result = result.replace(/^([0-9])/, "_$1");
  if (result.includes("scope")) {
    console.log({ locationHint, result });
  }
  return result;
}

function getNameForThing(
  thing: any,
  locationHint: string,
  baseNameHint: string,
): string {
  if (thing.$exporter$name) {
    return thing.$exporter$name;
  } else if (typeof thing === "function") {
    if (baseNameHint) {
      return baseNameHint;
    }
    const thingName = (thing as any).name ?? (thing as any).displayName ?? null;
    if (thingName) {
      return (baseNameHint ? baseNameHint + "-" : "") + thingName;
    }
    return locationHintToIdentifierName(locationHint);
  } else {
    const thingConstructor = thing.constructor;
    const thingConstructorNameRaw =
      thingConstructor?.$exporter$name ??
      thingConstructor?.name ??
      thingConstructor?.displayName ??
      null;
    const thingConstructorName = ["Array", "Object", "Set", "Map"].includes(
      thingConstructorNameRaw,
    )
      ? null
      : thingConstructorNameRaw;
    const thingName = (thing as any).name ?? (thing as any).displayName ?? null;
    const name =
      thingConstructorName && thingName
        ? `${thingName}${thingConstructorName}`
        : thingName ?? thingConstructorName ?? null;
    return baseNameHint || name
      ? (baseNameHint ?? "") + (baseNameHint && name ? "-" : "") + (name ?? "")
      : "value";
  }
}

function trimDef(def: string): string {
  const str = def.replace(/\s+/g, " ");
  const PREFIX_LENGTH = 60;
  const SUFFIX_LENGTH = 10;
  if (str.length < PREFIX_LENGTH + SUFFIX_LENGTH + 10) {
    return str;
  } else {
    return (
      str.slice(0, 0 + PREFIX_LENGTH) +
      "..." +
      str.slice(str.length - SUFFIX_LENGTH)
    );
  }
}

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
  return (
    (typeof thing === "object" || typeof thing === "function") &&
    thing !== null &&
    "$$export" in (thing as object | AnyFunction)
  );
}

type AnyFunction = {
  (...args: any[]): any;
  displayName?: string;
};

type ExportedFromFactory<T, TTuple extends any[]> = T & {
  $exporter$args: [...TTuple];
  $exporter$factory: (...args: TTuple) => T;
  $exporter$name: string | undefined;
};

function isExportedFromFactory<T, TTuple extends any[]>(
  thing: T,
): thing is ExportedFromFactory<T, TTuple> {
  return (
    (typeof thing === "object" || typeof thing === "function") &&
    thing !== null &&
    "$exporter$factory" in thing
  );
}

const BUILTINS = ["Int", "Float", "Boolean", "ID", "String"];
function isBuiltinType(type: GraphQLNamedType): boolean {
  return type.name.startsWith("__") || BUILTINS.includes(type.name);
}

const RESERVED_VARIABLES: Record<string, true> = {
  // Reserved variables
  AbortController: true,
  Array: true,
  Buffer: true,
  DOMException: true,
  Error: true,
  Event: true,
  EventTarget: true,
  JSON: true,
  Math: true,
  MessageChannel: true,
  MessageEvent: true,
  MessagePort: true,
  Object: true,
  TextDecoder: true,
  TextEncoder: true,
  URL: true,
  URLSearchParams: true,
  WebAssembly: true,
  __dirname: true,
  __filename: true,
  atob: true,
  btoa: true,
  clearImmediate: true,
  clearInterval: true,
  clearTimeout: true,
  console: true,
  exports: true,
  global: true,
  module: true,
  performance: true,
  process: true,
  queueMicrotask: true,
  require: true,
  setImmediate: true,
  setInterval: true,
  setTimeout: true,
  structuredClone: true,
};
for (const reservedWord of reservedWords) {
  RESERVED_VARIABLES[reservedWord] = true;
}
Object.freeze(RESERVED_VARIABLES);

class CodegenFile {
  _variables: {
    [name: string]: true;
  } = Object.assign(Object.create(null), RESERVED_VARIABLES);

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

  _values: Map<any, t.Expression> = new Map();

  _funcToAstCache: Map<AnyFunction, FunctionExpressionIncludingAttributes> =
    new Map();

  constructor(public options: ExportOptions) {}

  addStatements(statements: t.Statement | t.Statement[]): void {
    if (Array.isArray(statements)) {
      this._statements.push(...statements);
    } else {
      this._statements.push(statements);
    }
  }

  makeVariable(preferredName: string): t.Identifier {
    const allowedName = preferredName.replace(/[^_a-z0-9]+/gi, "_");
    for (let i = 0; i < 10000; i++) {
      const variableName = allowedName + (i > 0 ? String(i + 1) : "");
      if (!this._variables[variableName]) {
        this._variables[variableName] = true;
        return t.identifier(variableName);
      }
    }
    throw new Error("Could not find a suitable variable name");
  }

  import(
    fromModule: string,
    exportNames: "default" | "*" | string | string[] = "default",
    asType = false,
  ): t.Identifier | t.MemberExpression {
    if (Array.isArray(exportNames)) {
      const [exportName, ...path] = exportNames;
      if (!exportName) {
        throw new Error("Could not determine the export name");
      }
      const variable = this.importOnly(fromModule, exportName, asType);
      if (path.length) {
        let result: t.Node = variable;
        for (const pathSegment of path) {
          result = t.memberExpression(result, identifierOrLiteral(pathSegment));
        }
        return result;
      } else {
        return variable;
      }
    } else {
      const variable = this.importOnly(fromModule, exportNames, asType);
      return variable;
    }
  }

  importOnly(
    fromModule: string,
    exportName: "default" | "*" | string = "default",
    asType = false,
  ): t.Identifier {
    const importedModule =
      this._imports[fromModule] ??
      (this._imports[fromModule] = Object.create(
        null,
      ) as (typeof this._imports)[string]);
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
      return this.importOnly("graphql", "GraphQL" + type.name);
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
    this.addStatements(spec.declaration);
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
            t.memberExpression(
              iDirectiveLocation,
              identifierOrLiteral(String(l)),
            ),
          ),
        ),
        args:
          config.args && Object.keys(config.args).length > 0
            ? this.makeFieldArgs(
                config.args,
                `${locationHint}.args`,
                `@${config.name}.args`,
              )
            : null,
        isRepeatable: t.booleanLiteral(config.isRepeatable),
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
          `@${config.name}.extensions`,
        ),
      },
    );
    this.addStatements(spec.declaration);
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

  private makeEnumValue(
    config: GraphQLEnumValueConfig,
    typeName: string,
    enumValueName: string,
  ): t.Expression {
    const locationHint = `${typeName}.values[${JSON.stringify(enumValueName)}]`;
    const mappedConfig: {
      [key in keyof GraphQLEnumValueConfig as Exclude<
        keyof GraphQLEnumValueConfig,
        "astNode"
      >]-?: t.Expression | null;
    } = {
      description: desc(config.description),
      value: convertToIdentifierViaAST(
        this,
        config.value,
        `${typeName}.${enumValueName}`,
        `${locationHint}.value`,
      ),
      extensions: extensions(
        this,
        config.extensions,
        `${locationHint}.extensions`,
        `${typeName}.extensions`,
      ),
      deprecationReason: desc(config.deprecationReason),
    };
    return configToAST(mappedConfig);
  }

  // For objects and interfaces
  private makeObjectFields(
    fields: GraphQLFieldConfigMap<any, any>,
    typeName: string,
  ): t.Expression {
    const obj = Object.entries(fields).reduce(
      (memo, [fieldName, config]) => {
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
                    `${typeName}.${fieldName}`,
                  )
                : null,
            resolve: config.resolve
              ? func(
                  this,
                  config.resolve,
                  `${locationHint}.resolve`,
                  `${typeName}.${fieldName}.resolve`,
                )
              : null,
            subscribe: config.subscribe
              ? func(
                  this,
                  config.subscribe,
                  `${locationHint}.subscribe`,
                  `${typeName}.${fieldName}.subscribe`,
                )
              : null,
            deprecationReason: desc(config.deprecationReason),
            extensions: extensions(
              this,
              config.extensions,
              `${locationHint}.extensions`,
              `${typeName}.${fieldName}.extensions`,
            ),
          };
          memo[fieldName] = configToAST(mappedConfig);
        }
        return memo;
      },
      {} as { [key: string]: t.Expression | null },
    );
    return t.objectExpression(objectToObjectProperties(obj));
  }

  private makeInputObjectFields(
    fields: GraphQLInputFieldConfigMap,
    typeName: string,
  ): t.Expression {
    const obj = Object.entries(fields).reduce(
      (memo, [fieldName, config]) => {
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
                ? convertToIdentifierViaAST(
                    this,
                    config.defaultValue,
                    `${typeName}.${fieldName}.defaultValue`,
                    `${locationHint}.defaultValue`,
                  )
                : null,
            deprecationReason: desc(config.deprecationReason),
            extensions: extensions(
              this,
              config.extensions,
              `${locationHint}.extensions`,
              `${typeName}.${fieldName}.extensions`,
            ),
          };
          memo[fieldName] = configToAST(mappedConfig);
        }
        return memo;
      },
      {} as { [key: string]: t.Expression | null },
    );
    return t.objectExpression(objectToObjectProperties(obj));
  }

  private makeFieldArgs(
    args: GraphQLFieldConfigArgumentMap,
    baseLocationHint: string,
    nameHint: string,
  ): t.Expression {
    const obj = Object.entries(args).reduce(
      (memo, [argName, config]) => {
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
                ? convertToIdentifierViaAST(
                    this,
                    config.defaultValue,
                    `${nameHint}.${argName}.defaultValue`,
                    `${locationHint}.defaultValue`,
                  )
                : null,
            deprecationReason: desc(config.deprecationReason),
            extensions: extensions(
              this,
              config.extensions,
              `${locationHint}.extensions`,
              `${nameHint}.${argName}.extensions`,
            ),
          };
          memo[argName] = configToAST(mappedConfig);
        }
        return memo;
      },
      {} as { [key: string]: t.Expression | null },
    );
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
          ? func(
              this,
              config.isTypeOf,
              `${config.name}.isTypeOf`,
              `${config.name}.isTypeOf`,
            )
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
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
          ? func(
              this,
              config.resolveType,
              `${config.name}.resolveType`,
              `${config.name}.resolveType`,
            )
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
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
          ? func(
              this,
              config.resolveType,
              `${config.name}.resolveType`,
              `${config.name}.resolveType`,
            )
          : null,
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
          `${config.name}.extensions`,
        ),
        types: t.arrowFunctionExpression(
          [],
          t.arrayExpression(config.types.map((t) => this.declareType(t))),
        ),
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
            `${config.name}.extensions`,
          ),
          isOneOf: config.isOneOf
            ? t.booleanLiteral(true)
            : t.identifier("undefined"),
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
        serialize: func(
          this,
          config.serialize,
          `${config.name}.serialize`,
          `${config.name}.serialize`,
        ),
        parseValue: func(
          this,
          config.parseValue,
          `${config.name}.parseValue`,
          `${config.name}.parseValue`,
        ),
        parseLiteral: func(
          this,
          config.parseLiteral,
          `${config.name}.parseLiteral`,
          `${config.name}.parseLiteral`,
        ),
        extensions: extensions(
          this,
          config.extensions,
          `${config.name}.extensions`,
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
          `${config.name}.extensions`,
        ),
        values: objectNullPrototype(
          Object.entries(config.values).map(([key, value]) =>
            t.objectProperty(
              identifierOrLiteral(key),
              this.makeEnumValue(value, config.name, key),
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
/**
 * A manual way of doing this (which doesn't seem to work).
 *
 * ```
 * const importStar = template.statement(
 *   `import * as VARIABLE_NAME from MODULE_NAME;`,
 *   templateOptions,
 * );
 * ```
 */
const importStar = (args: {
  VARIABLE_NAME: t.Identifier;
  MODULE_NAME: t.StringLiteral;
}) =>
  t.importDeclaration(
    [t.importNamespaceSpecifier(args.VARIABLE_NAME)],
    args.MODULE_NAME,
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

/**
 * Returns if the key can be used as a regular object key (and will be seen as
 * one of the "own" properties of the object) when created using object literal
 * syntax.
 *
 * I.e. returns `true` unless key is `__proto__`
 *
 * @see {@link https://tc39.es/ecma262/#sec-runtime-semantics-propertydefinitionevaluation}
 */
function canBeRegularObjectKey(key: string): boolean {
  return key !== "__proto__";
}

function _convertToAST(
  file: CodegenFile,
  thing: unknown,
  locationHint: string,
  nameHint: string,
  depth: number,
  reference: t.Expression,
): t.Expression {
  const handleSubvalue = (
    value: any,
    tKey: t.Expression,
    key: string | number,
  ) => {
    const existingIdentifier = getExistingIdentifier(file, value);
    if (existingIdentifier) {
      return existingIdentifier;
    } else if (isExportedFromFactory(value)) {
      const val = convertToIdentifierViaAST(
        file,
        value,
        nameHint + `.${key}`,
        locationHint + `[${JSON.stringify(key)}]`,
        depth + 1,
      );
      return val;
    } else {
      const newReference = t.memberExpression(
        reference,
        tKey,
        !t.isIdentifier(tKey),
      );
      file._values.set(value, newReference);
      const val = _convertToAST(
        file,
        value,
        locationHint + `[${JSON.stringify(key)}]`,
        nameHint + `.${key}`,
        depth + 1,
        newReference,
      );
      return val;
    }
  };
  if (depth > 100) {
    throw new Error(
      `_convertToAST: potentially infinite recursion at ${locationHint}. TODO: allow exporting recursive structures.`,
    );
  }
  if (isSQL(thing)) {
    throw new Error(
      `Exporting of 'sql' values is not supported (at ${locationHint}), please wrap in EXPORTABLE: ${
        sql ? sql.compile(thing).text : inspect(thing)
      }`,
    );
  } else if (Array.isArray(thing)) {
    return t.arrayExpression(
      thing.map((entry, i) => {
        const tKey = identifierOrLiteral(i);
        return handleSubvalue(entry, tKey, i);
      }),
    );
  } else if (typeof thing === "function") {
    return func(file, thing as AnyFunction, locationHint, nameHint);
  } else if (isSchema(thing)) {
    throw new Error(
      `Attempted to export GraphQLSchema directly from \`_convertToAST\` (at ${locationHint}); this is currently unsupported.`,
    );
  } else if (typeof thing === "object" && thing != null) {
    const prototype = Object.getPrototypeOf(thing);
    if (prototype !== null && prototype !== Object.prototype) {
      throw new Error(
        `Attempting to export an instance of a class (at ${locationHint}); you should wrap this definition in EXPORTABLE! (Class: ${thing.constructor})`,
      );
    }
    const propertyPairs: Array<
      [
        keyLiteral: t.StringLiteral | t.NumericLiteral | t.Identifier,
        value: t.Expression,
      ]
    > = [];
    const entries = Object.entries(thing);
    const hasUnsafeKeys = entries.some(([key]) => !canBeRegularObjectKey(key));
    entries.forEach(([key, value]) => {
      const tKey = hasUnsafeKeys ? literal(key) : identifierOrLiteral(key);
      const subvalue = handleSubvalue(value, tKey, key);
      propertyPairs.push([tKey, subvalue]);
    });
    if (prototype === null) {
      if (hasUnsafeKeys) {
        // Object.fromEntries([[k, v], [k, v], ...])
        return t.callExpression(
          t.memberExpression(
            t.identifier("Object"),
            t.identifier("fromEntries"),
          ),
          [
            t.arrayExpression(
              propertyPairs.map(([key, val]) => t.arrayExpression([key, val])),
            ),
          ],
        );
      } else if (propertyPairs.length === 0) {
        return t.callExpression(
          t.memberExpression(t.identifier("Object"), t.identifier("create")),
          [t.nullLiteral()],
        );
      } else {
        const obj = t.objectExpression(
          propertyPairs.map(([key, val]) => t.objectProperty(key, val)),
        );
        return t.callExpression(
          t.memberExpression(t.identifier("Object"), t.identifier("assign")),
          [
            t.callExpression(
              t.memberExpression(
                t.identifier("Object"),
                t.identifier("create"),
              ),
              [t.nullLiteral()],
            ),
            obj,
          ],
        );
      }
    } else {
      if (hasUnsafeKeys) {
        throw new Error(
          `Unexportable key found on non-null-prototype object (at ${locationHint})`,
        );
      } else {
        const obj = t.objectExpression(
          propertyPairs.map(([key, val]) => t.objectProperty(key, val)),
        );
        return obj;
      }
    }
  } else {
    throw new Error(
      `_convertToAST: did not understand item (${inspect(
        thing,
      )}) at ${locationHint}`,
    );
  }
}

const getExistingIdentifier = (file: CodegenFile, thing: unknown) => {
  const existingIdentifier = file._values.get(thing);
  if (existingIdentifier) {
    return existingIdentifier;
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
  } else if (wellKnown(file.options, thing)) {
    const { moduleName, exportName } = wellKnown(file.options, thing)!;
    return file.import(moduleName, exportName);
  } else if (isImportable(thing)) {
    const { moduleName, exportName } = thing.$$export;
    return file.import(moduleName, exportName);
  } else if (isDirective(thing)) {
    return file.declareDirective(thing);
  } else if (isNamedType(thing)) {
    return file.declareType(thing);
  }
};

function importWellKnownOrFactory(
  file: CodegenFile,
  value: unknown,
  locationHint: string,
  nameHint: string,
): t.Expression | undefined {
  if (isImportable(value)) {
    return file.import(value.$$export.moduleName, value.$$export.exportName);
  } else if (wellKnown(file.options, value)) {
    const { moduleName, exportName } = wellKnown(file.options, value)!;
    return file.import(moduleName, exportName);
  } else if (isExportedFromFactory(value)) {
    return factoryAst(file, value, locationHint, nameHint);
  } else {
    return undefined;
  }
}

function convertToIdentifierViaAST(
  file: CodegenFile,
  thing: unknown,
  baseNameHint: string,
  locationHint: string,
  depth = 0,
): t.Expression {
  const existingIdentifier = getExistingIdentifier(file, thing);
  if (existingIdentifier) {
    return existingIdentifier;
  }

  // Prevent infinite loop by declaring the variableIdentifier immediately
  const nameHint = getNameForThing(thing, locationHint, baseNameHint);
  const variableIdentifier = file.makeVariable(nameHint || "value");
  file._values.set(thing, variableIdentifier);

  const ast =
    importWellKnownOrFactory(file, thing, locationHint, nameHint) ??
    _convertToAST(
      file,
      thing,
      locationHint,
      nameHint,
      depth,
      variableIdentifier,
    );
  if (ast.type === "Identifier") {
    console.warn(
      `graphile-export error: AST returned an identifier '${ast.name}'; this could cause an infinite loop.`,
    );
  }
  file.addStatements(
    t.variableDeclaration("const", [
      t.variableDeclarator(variableIdentifier, ast),
    ]),
  );
  return variableIdentifier;
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
    .map(([key, value]) => t.objectProperty(identifierOrLiteral(key), value!));
}

function extensions(
  file: CodegenFile,
  extensions: object | null | undefined,
  locationHint: string,
  nameHint: string,
): t.Expression | null {
  if (extensions == null || Object.keys(extensions).length === 0) {
    return null;
  }
  return convertToIdentifierViaAST(file, extensions, nameHint, locationHint);
}

/** Maps to `Object.assign(Object.create(null), {...})` */
export function objectNullPrototype(
  properties: t.ObjectProperty[],
): t.Expression {
  const objectCreateNull = t.callExpression(
    t.memberExpression(t.identifier("Object"), t.identifier("create")),
    [t.nullLiteral()],
  );
  if (properties.length === 0) {
    return objectCreateNull;
  }
  return t.callExpression(
    t.memberExpression(t.identifier("Object"), t.identifier("assign")),
    [objectCreateNull, t.objectExpression(properties)],
  );
}

/*
function iife(statements: t.Statement[]): t.Expression {
  return t.callExpression(
    t.arrowFunctionExpression([], t.blockStatement(statements)),
    [],
  );
}
*/

function func(
  file: CodegenFile,
  fn: AnyFunction,
  locationHint: string,
  nameHint: string,
): t.Expression {
  if (fn == null) {
    return t.identifier("undefined");
  }

  // Determine if we should wrap it in an IIFE to put the variables into
  // scope; e.g.:
  //
  // `(() => { const foo = 1, bar = 2; return /*>*/() => {return foo+bar}/*<*/})();`
  return (
    importWellKnownOrFactory(file, fn, locationHint, nameHint) ??
    funcToAst(file, fn, locationHint, nameHint).ast
  );
}

const shouldOptimizeFactoryCalls = true;

function factoryAst<TTuple extends any[]>(
  file: CodegenFile,
  fn: ExportedFromFactory<unknown, TTuple>,
  locationHint: string,
  nameHint: string,
) {
  const factory = fn.$exporter$factory;
  const { functionWithoutOwnAttributesAST: funcAST } = funcToAst(
    file,
    factory,
    locationHint,
    nameHint,
  );
  const depArgs = fn.$exporter$args.map((arg, i) => {
    if (typeof arg === "string") {
      return t.stringLiteral(arg);
    } else if (typeof arg === "number") {
      return t.numericLiteral(arg);
    } else if (typeof arg === "boolean") {
      return t.booleanLiteral(arg);
    } else if (arg === null) {
      return t.nullLiteral();
    } else if (arg === undefined) {
      return t.identifier("undefined");
    }
    const param = funcAST.params[i];
    const paramName = param && param.type === "Identifier" ? param.name : null;
    return convertToIdentifierViaAST(
      file,
      arg,
      paramName || "parameter",
      `${locationHint}[$$scope][${JSON.stringify(i)}]`,
    );
  });

  // DEBT: we should be able to remove this now that we have the
  // post-processing via babel, however currently the result of doing so is
  // messy.
  if (shouldOptimizeFactoryCalls) {
    /*
     * Factories take the form of an IIFE: `((a, b, c) => ...)(x, y, z)`; where
     * the corresponding argument names match up with the names of the values
     * we're passing we can remove both the arg and the value and rely on it
     * being available in the ambient scope.
     *
     * Further, if we get down to the situation where we have `(() => ...)()`
     * and the `...` is not a block, then it must be an expression so we can
     * just return it directly and get rid of the IIFE.
     */
    const factoryArgNames = funcAST.params.map((p) =>
      p.type === "Identifier" ? p.name : null,
    );
    const depArgsNames = depArgs.map((d) =>
      d.type === "Identifier" ? d.name : null,
    );
    for (let i = factoryArgNames.length - 1; i >= 0; i--) {
      if (factoryArgNames[i] === depArgsNames[i]) {
        funcAST.params.splice(i, 1);
        depArgs.splice(i, 1);
      }
    }
    if (funcAST.params.length === 0 && funcAST.body.type !== "BlockStatement") {
      return funcAST.body;
    }
    return t.callExpression(funcAST, depArgs);
  } else {
    return t.callExpression(funcAST, depArgs);
  }
}

interface FunctionExpressionIncludingAttributes {
  functionWithoutOwnAttributesAST:
    | t.FunctionExpression
    | t.ArrowFunctionExpression;
  ast: t.CallExpression | t.FunctionExpression | t.ArrowFunctionExpression;
}

function funcToAst(
  file: CodegenFile,
  fn: AnyFunction,
  locationHint: string,
  _nameHint: string,
): FunctionExpressionIncludingAttributes {
  if (file._funcToAstCache.has(fn)) {
    return file._funcToAstCache.get(fn)!;
  }
  const path = _funcToAst(fn, locationHint, _nameHint);

  const externalReferences = new Set<string>();

  const localBindings = path.scope.bindings;
  path.traverse({
    Identifier(path) {
      if (
        t.isReferenced(path.node, path.parent) && // Is a variable reference
        !path.scope.hasBinding(path.node.name) && // Not defined in local scope
        !localBindings[path.node.name] // Not a parameter of the function
      ) {
        externalReferences.add(path.node.name);
      }
    },
  });

  // Remove global things they're allowed to reference
  externalReferences.delete("Buffer");
  externalReferences.delete("console");
  externalReferences.delete("process");
  externalReferences.delete("setTimeout");
  externalReferences.delete("setInterval");

  if (externalReferences.size > 0) {
    throw new Error(
      `The function being exported as ${locationHint} references external variables: \`${[
        ...externalReferences,
      ].join(
        "`, `",
      )}\`. Please ensure this function is wrapped in \`EXPORTABLE(() => ...)\`. Fn:\n${fn}`,
    );
  }

  const fnExpression = path.node;
  const ownProps = Object.entries(fn);
  const result = (() => {
    if (ownProps.length > 0) {
      // Need to assign things to it
      const properties = ownProps.map(([key, value]) => {
        return t.objectProperty(
          identifierOrLiteral(key),
          convertToIdentifierViaAST(
            file,
            value,
            `${locationHint}.${key}`,
            `${locationHint}['${key}']`,
          ),
        );
      });
      return {
        functionWithoutOwnAttributesAST: fnExpression,
        ast: t.callExpression(
          t.memberExpression(t.identifier("Object"), t.identifier("assign")),
          [fnExpression, t.objectExpression(properties)],
        ),
      };
    } else {
      return {
        functionWithoutOwnAttributesAST: fnExpression,
        ast: fnExpression,
      };
    }
  })();

  file._funcToAstCache.set(fn, result);

  return result;
}

function parseExpressionViaDoc(funcString: string) {
  const doc = parse(`const f = ${funcString}`, {
    sourceType: "module",
    plugins: ["typescript"],
  });
  let result: null | NodePath<t.Expression> = null as any;
  traverse(doc, {
    VariableDeclaration(path) {
      result = path.get("declarations.0.init") as NodePath<t.Expression>;
      path.stop();
    },
  });
  if (!result) {
    throw new Error(
      `graphile-export internal error - failed to find the variable declaration (?!!)`,
    );
  }
  return result!;
}

function _funcToAst(fn: AnyFunction, locationHint: string, _nameHint: string) {
  const funcString = fn.toString().trim();
  try {
    const path = parseExpressionViaDoc(funcString);
    const result = path.node;
    if (
      result.type !== "FunctionExpression" &&
      result.type !== "ArrowFunctionExpression"
    ) {
      if (result.type === "ClassExpression") {
        throw Object.assign(
          new Error(
            `We don't support exporting classes directly, instead you should mark your class as importable via:
Object.defineProperty(${
              result.id?.name ?? "MyClass"
            }, '$$export', { value: { moduleName: 'my-module', exportName: '${
              result.id?.name ?? "MyClass"
            }' } });`,
          ),
          { retry: false },
        );
      }
      throw new Error(
        `Expected FunctionExpression or ArrowFunctionExpression but saw ${result.type}`,
      );
    }
    return path as NodePath<typeof result>;
  } catch (e) {
    if (e.retry === false) {
      throw e;
    }
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
        ? "async function " + funcString.slice(6)
        : "function " + funcString;
      const path = parseExpressionViaDoc(modifiedDefinition);
      const result = path.node;
      if (
        result.type !== "FunctionExpression" &&
        result.type !== "ArrowFunctionExpression"
      ) {
        throw new Error(
          `Expected FunctionExpression or ArrowFunctionExpression but saw ${result.type}`,
        );
      }
      return path as NodePath<typeof result>;
    } catch {
      throw new Error(
        `Function export error at ${locationHint} - failed to process function definition '${trimDef(
          fn.toString(),
        )}'\n    ${String(e.stack ?? e)
          .split("\n")
          .join("\n    ")}`,
      );
    }
  }
}

interface SchemaExportDetails {
  schema: GraphQLSchema;
  config: GraphQLSchemaNormalizedConfig;
  options: ExportOptions;
  customTypes: GraphQLNamedType[];
  customDirectives: GraphQLDirective[];
  file: CodegenFile;
}

/**
 * Exposes a `GraphQLSchema` object built via GraphQL.js constructors
 */
function exportSchemaGraphQLJS({
  config,
  customTypes,
  customDirectives,
  file,
}: SchemaExportDetails) {
  const schemaExportName = file.makeVariable("schema");

  const types = customTypes.map((type) => {
    return file.declareType(type);
  });

  file.addStatements(
    declareGraphQLEntity(file, schemaExportName, "GraphQLSchema", {
      description: desc(config.description),
      query: config.query ? file.declareType(config.query) : t.nullLiteral(),
      mutation: config.mutation ? file.declareType(config.mutation) : null,
      subscription: config.subscription
        ? file.declareType(config.subscription)
        : null,
      types: t.arrayExpression(types),
      directives:
        customDirectives.length > 0
          ? t.arrayExpression(
              customDirectives.map((directive) =>
                file.declareDirective(directive),
              ),
            )
          : null,
      extensions: extensions(
        file,
        config.extensions,
        "schema.extensions",
        "schema.extensions",
      ),
      // @ts-ignore
      enableDeferStream:
        // @ts-ignore
        config.enableDeferStream != null
          ? // @ts-ignore
            t.booleanLiteral(config.enableDeferStream)
          : null,
      assumeValid: null, // TODO: t.booleanLiteral(true),
    }),
  );
}

/**
 * Exposes as `typeDefs`/`plans` for simplified read.
 *
 * EXPERIMENTAL!
 */
function exportSchemaTypeDefs({
  schema,
  customTypes,
  file,
}: SchemaExportDetails) {
  const typeDefsExportName = file.makeVariable("typeDefs");
  const plansExportName = file.makeVariable("plans");
  const schemaExportName = file.makeVariable("schema");

  const typeDefsString = printSchema(schema);
  const graphqlAST = t.templateLiteral(
    [t.templateElement({ raw: typeDefsString.replace(/[\\`]/g, "\\$&") })],
    [],
  );
  graphqlAST.leadingComments = [
    { type: "CommentBlock", value: " GraphQL " } as any,
  ];

  const plansProperties: t.ObjectProperty[] = [];
  customTypes.forEach((type) => {
    if (type instanceof GraphQLObjectType) {
      const typeProperties: t.ObjectProperty[] = [];

      if (type.extensions.grafast?.assertStep) {
        typeProperties.push(
          t.objectProperty(
            t.identifier("__assertStep"),
            convertToIdentifierViaAST(
              file,
              type.extensions.grafast.assertStep,
              `${type.name}AssertStep`,
              `${type.name}.extensions.assertStep`,
            ),
          ),
        );
      }

      for (const [fieldName, field] of Object.entries(type.toConfig().fields)) {
        // Use shorthand if there's only a `plan` and nothing else
        const planAST = field.extensions?.grafast?.plan
          ? convertToIdentifierViaAST(
              file,
              field.extensions?.grafast?.plan,
              `${type.name}.${fieldName}Plan`,
              `${type.name}.fields[${fieldName}].extensions.grafast.plan`,
            )
          : null;
        const subscribePlanAST = field.extensions?.grafast?.subscribePlan
          ? convertToIdentifierViaAST(
              file,
              field.extensions?.grafast?.subscribePlan,
              `${type.name}.${fieldName}SubscribePlan`,
              `${type.name}.fields[${fieldName}].extensions.grafast.subscribePlan`,
            )
          : null;
        const originalResolver = field.resolve;
        const originalSubscribe = field.subscribe;
        const resolveAST = originalResolver
          ? convertToIdentifierViaAST(
              file,
              originalResolver,
              `${type.name}.${fieldName}Resolve`,
              `${type.name}.fields[${fieldName}].resolve`,
            )
          : null;
        const subscribeAST = originalResolver
          ? convertToIdentifierViaAST(
              file,
              originalSubscribe,
              `${type.name}.${fieldName}Subscribe`,
              `${type.name}.fields[${fieldName}].subscribe`,
            )
          : null;

        const args = field.args
          ? Object.entries(field.args)
              .map(([argName, arg]) => {
                return t.objectProperty(
                  identifierOrLiteral(argName),
                  convertToIdentifierViaAST(
                    file,
                    arg.extensions?.grafast,
                    `${type.name}.${fieldName}.${argName}`,
                    `${type.name}.fields[${fieldName}].args[${argName}].extensions.grafast`,
                  ),
                );
              })
              .filter(isNotNullish)
          : null;
        const argsAST = args && args.length ? t.objectExpression(args) : null;

        if (!planAST && !subscribePlanAST && !resolveAST && !subscribeAST) {
          if (argsAST) {
            throw new Error(
              `Invalid schema! ${type.name}.${fieldName} has no plan, but it's arguments do!`,
            );
          }
          // No definition
          continue;
        }
        const shorthand =
          planAST &&
          !subscribePlanAST &&
          !originalResolver &&
          !originalSubscribe &&
          !argsAST;
        const fieldSpec = shorthand
          ? planAST
          : t.objectExpression(
              objectToObjectProperties({
                plan: planAST,
                subscribePlan: subscribePlanAST,
                resolve: resolveAST,
                subscribe: subscribeAST,
                args: argsAST,
              }),
            );
        typeProperties.push(
          t.objectProperty(identifierOrLiteral(fieldName), fieldSpec),
        );
      }

      plansProperties.push(
        t.objectProperty(
          identifierOrLiteral(type.name),
          t.objectExpression(typeProperties),
        ),
      );
    } else if (type instanceof GraphQLInputObjectType) {
      const typeProperties: t.ObjectProperty[] = [];

      if (type.extensions?.grafast?.inputPlan) {
        typeProperties.push(
          t.objectProperty(
            identifierOrLiteral("__inputPlan"),
            convertToIdentifierViaAST(
              file,
              type.extensions?.grafast.inputPlan,
              `${type.name}.inputPlan`,
              `${type.name}.extensions.grafast.inputPlan`,
            ),
          ),
        );
      }

      for (const [fieldName, field] of Object.entries(type.toConfig().fields)) {
        typeProperties.push(
          t.objectProperty(
            identifierOrLiteral(fieldName),
            convertToIdentifierViaAST(
              file,
              field.extensions?.grafast,
              `${type.name}.${fieldName}`,
              `${type.name}.fields[${fieldName}].extensions.grafast`,
            ),
          ),
        );
      }

      plansProperties.push(
        t.objectProperty(
          identifierOrLiteral(type.name),
          t.objectExpression(typeProperties),
        ),
      );
    } else if (
      type instanceof GraphQLInterfaceType ||
      type instanceof GraphQLUnionType
    ) {
      const config = type.toConfig();
      if (config.resolveType) {
        plansProperties.push(
          t.objectProperty(
            identifierOrLiteral(type.name),
            t.objectExpression(
              objectToObjectProperties({
                __resolveType: convertToIdentifierViaAST(
                  file,
                  type.resolveType,
                  `${type.name}ResolveType`,
                  `${type.name}.resolveType`,
                ),
              }),
            ),
          ),
        );
      }
    } else if (type instanceof GraphQLScalarType) {
      const config = type.toConfig();
      const planAST = config.extensions.grafast?.plan
        ? convertToIdentifierViaAST(
            file,
            config.extensions?.grafast?.plan,
            `${type.name}Plan`,
            `${type.name}.extensions.grafast.plan`,
          )
        : null;
      if (
        planAST ||
        type.serialize !== GraphQLScalarType.prototype.serialize ||
        type.parseValue !== GraphQLScalarType.prototype.parseValue ||
        type.parseLiteral !== GraphQLScalarType.prototype.parseLiteral
      ) {
        plansProperties.push(
          t.objectProperty(
            identifierOrLiteral(type.name),
            t.objectExpression(
              objectToObjectProperties({
                serialize:
                  type.serialize !== GraphQLScalarType.prototype.serialize
                    ? convertToIdentifierViaAST(
                        file,
                        type.serialize,
                        `${type.name}Serialize`,
                        `${type.name}.serialize`,
                      )
                    : null,
                parseValue:
                  type.parseValue !== GraphQLScalarType.prototype.parseValue
                    ? convertToIdentifierViaAST(
                        file,
                        type.parseValue,
                        `${type.name}ParseValue`,
                        `${type.name}.parseValue`,
                      )
                    : null,
                parseLiteral:
                  type.parseLiteral !== GraphQLScalarType.prototype.parseLiteral
                    ? convertToIdentifierViaAST(
                        file,
                        type.parseLiteral,
                        `${type.name}ParseLiteral`,
                        `${type.name}.parseLiteral`,
                      )
                    : null,
                plan: planAST,
              }),
            ),
          ),
        );
      }
    } else if (type instanceof GraphQLEnumType) {
      const config = type.toConfig();
      const enumValues: t.ObjectProperty[] = [];
      for (const [enumValueName, enumValueConfig] of Object.entries(
        config.values,
      )) {
        const valueAST =
          enumValueConfig.value !== undefined &&
          enumValueConfig.value !== enumValueName
            ? convertToIdentifierViaAST(
                file,
                enumValueConfig.value,
                `${type.name}_${enumValueName}`,
                `${type.name}.values[${enumValueName}].value`,
              )
            : null;
        const applyPlanAST = enumValueConfig.extensions?.grafast?.applyPlan
          ? convertToIdentifierViaAST(
              file,
              enumValueConfig.extensions.grafast.applyPlan,
              `${type.name}_${enumValueName}ApplyPlan`,
              `${type.name}.values[${enumValueName}].extensions.grafast.applyPlan`,
            )
          : null;

        if (valueAST || applyPlanAST) {
          enumValues.push(
            t.objectProperty(
              identifierOrLiteral(enumValueName),
              t.objectExpression(
                objectToObjectProperties({
                  value: valueAST,
                  applyPlan: applyPlanAST,
                }),
              ),
            ),
          );
        }
      }

      if (enumValues.length > 0) {
        plansProperties.push(
          t.objectProperty(
            identifierOrLiteral(type.name),
            t.objectExpression(enumValues),
          ),
        );
      }
    } else {
      const never: never = type;
      console.warn(`Unhandled type ${never}`);
    }
  });

  const typeDefs = t.exportNamedDeclaration(
    t.variableDeclaration("const", [
      t.variableDeclarator(typeDefsExportName, graphqlAST),
    ]),
  );
  const plans = t.exportNamedDeclaration(
    t.variableDeclaration("const", [
      t.variableDeclarator(
        plansExportName,
        t.objectExpression(plansProperties),
      ),
    ]),
  );

  file.addStatements(typeDefs);
  file.addStatements(plans);
  const makeGrafastSchemaAST = file.import("grafast", "makeGrafastSchema");

  const schemaAST = t.callExpression(makeGrafastSchemaAST, [
    t.objectExpression(
      objectToObjectProperties({
        typeDefs: typeDefsExportName,
        plans: plansExportName,
      }),
    ),
  ]);
  file.addStatements(
    t.exportNamedDeclaration(
      t.variableDeclaration("const", [
        t.variableDeclarator(schemaExportName, schemaAST),
      ]),
    ),
  );
}

export async function exportSchemaAsString(
  schema: GraphQLSchema,
  options: ExportOptions,
): Promise<{ code: string }> {
  const config = schema.toConfig();

  const customTypes = config.types.filter((type) => !isBuiltinType(type));
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

  if (
    process.env.ENABLE_DEFER_STREAM === "1" ||
    config.directives.some((d) => d.name === "defer" || d.name === "skip")
  ) {
    // Ref: https://github.com/graphql/graphql-js/pull/3450
    // @ts-ignore
    config.enableDeferStream = true;
  }

  const file = new CodegenFile(options);

  const schemaExportDetails: SchemaExportDetails = {
    schema,
    config,
    options,
    customTypes,
    customDirectives,
    file,
  };

  if (options.mode === "typeDefs") {
    exportSchemaTypeDefs(schemaExportDetails);
  } else {
    exportSchemaGraphQLJS(schemaExportDetails);
  }

  return exportFile(file);
}

function exportFile(file: CodegenFile) {
  const ast = file.toAST();

  const optimizedAst = optimize(ast);

  const { code } = reallyGenerate(optimizedAst, {});
  return { code };
}

export async function exportValueAsString(
  name: string,
  value: any,
  options: ExportOptions,
): Promise<{ code: string }> {
  const file = new CodegenFile(options);

  const exportName = file.makeVariable(name);

  const valueAST = convertToIdentifierViaAST(file, value, name, name);

  file.addStatements(
    t.exportNamedDeclaration(
      t.variableDeclaration("const", [
        t.variableDeclarator(exportName, valueAST),
      ]),
    ),
  );

  return exportFile(file);
}

async function loadESLint() {
  try {
    return await import("eslint");
  } catch (e) {
    return null;
  }
}

async function lint(code: string, rawFilePath: string | URL) {
  const eslintModule = await loadESLint();
  if (eslintModule == null) {
    console.warn(
      `graphile-export could not find 'eslint' so disabling additional checks`,
    );
    return;
  }
  const filePath =
    typeof rawFilePath === "string" ? rawFilePath : rawFilePath.pathname;
  const { ESLint } = eslintModule;
  const eslint = new ESLint({
    useEslintrc: false, // Don't use external config
    reportUnusedDisableDirectives: "off",
    allowInlineConfig: false, // Ignore `/* eslint-disable ... */` comments
    overrideConfig: {
      reportUnusedDisableDirectives: false,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      rules: {
        "no-use-before-define": [
          "error",
          {
            functions: false,
            classes: false,
            // We often have cyclic dependencies between types, this is handled via callbacks, so we don't care about that.
            variables: false,
            allowNamedExports: false,
          },
        ],
      },
    },
  });

  const results = await eslint.lintText(code, {
    warnIgnored: true,
    // DO NOT PASS THE `filePath`; it can result in the file being ignored!
  });

  if (results.length !== 1) {
    console.dir({ filePath, results });
    throw new Error(`Expected ESLint results to have exactly one entry`);
  }
  const [result] = results;

  if (result.warningCount > 0 || result.errorCount > 0) {
    console.log(
      `ESLint found problems in the export; this likely indicates some issue with \`EXPORTABLE\` calls`,
    );
    const formatter = await eslint.loadFormatter("stylish");
    const output = formatter.format(results);
    console.log(output);
  }
}

async function format(
  toFormat: string,
  toPath: string | URL,
  options: ExportOptions,
) {
  if (options.prettier) {
    const prettier = await import("prettier");
    const config = await prettier.resolveConfig(toPath.toString());
    const formatted = await prettier.format(toFormat, {
      parser: "babel",
      ...(config ?? {}),
    });
    return formatted;
  } else {
    return toFormat;
  }
}

const HEADER = `/* eslint-disable graphile-export/export-instances, graphile-export/export-methods, graphile-export/exhaustive-deps */\n`;

export async function exportSchema(
  schema: GraphQLSchema,
  toPath: string | URL,
  options: ExportOptions = {},
): Promise<void> {
  const { code } = await exportSchemaAsString(schema, options);
  const toFormat = HEADER + code;
  const formatted = await format(toFormat, toPath, options);
  await writeFile(toPath, formatted);
  await lint(formatted, toPath);
}
