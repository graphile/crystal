import "./global.js";

import chalk from "chalk";
import type { ExecutablePlan } from "dataplanner";
import type { GraphQLNamedType } from "graphql";
import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLString,
  GraphQLUnionType,
  isInputType,
  isOutputType,
} from "graphql";
import * as graphql from "graphql";
import * as semver from "semver";

import extend, { indent } from "./extend.js";
import type SchemaBuilder from "./SchemaBuilder.js";
import { stringTypeSpec, wrapDescription } from "./utils.js";

// TODO: the versioning!
const version = "TODO";
/*
import { readFileSync } from "fs";
import { URL } from "url";
const version: string = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
).version;
*/

/**
 * Makes a new 'Build' object suitable to be passed through the 'build' hook.
 */
export default function makeNewBuild(
  builder: SchemaBuilder<any>,
  input: GraphileBuild.BuildInput,
  inflection: GraphileBuild.Inflection,
): GraphileBuild.BuildBase {
  const allTypes = {
    Int: GraphQLInt,
    Float: GraphQLFloat,
    String: GraphQLString,
    Boolean: GraphQLBoolean,
    ID: GraphQLID,
  };

  const allTypesSources = {
    Int: "GraphQL Built-in",
    Float: "GraphQL Built-in",
    String: "GraphQL Built-in",
    Boolean: "GraphQL Built-in",
    ID: "GraphQL Built-in",
  };

  /**
   * Where the type factories are; so we don't construct types until they're needed.
   */
  const typeRegistry: {
    [key: string]: {
      // The constructor - GraphQLScalarType, GraphQLObjectType, etc
      klass: { new (spec: any): GraphQLNamedType };
      scope: GraphileBuild.SomeScope;
      specGenerator: any;
      origin: string | null | undefined;
      Plan?: { new (...args: any[]): ExecutablePlan<any> } | null;
    };
  } = {};

  const scopeByType = new Map<GraphQLNamedType, GraphileBuild.SomeScope>();

  // TODO: allow registering a previously constructed type.
  function register(
    klass: { new (spec: any): GraphQLNamedType },
    typeName: string,
    scope: GraphileBuild.SomeScope,
    Plan: { new (...args: any[]): ExecutablePlan<any> } | null,
    specGenerator: () => any,
    origin: string | null | undefined,
  ) {
    if (!typeName) {
      throw new Error(
        `Attempted to register a ${klass.name} with empty (or falsy) type name`,
      );
    }
    const newTypeSource =
      origin || `'addType' call during hook '${build.status.currentHookName}'`;
    if (allTypesSources[typeName]) {
      const oldTypeSource = allTypesSources[typeName];
      const firstEntityDetails = !oldTypeSource
        ? "The first type was registered from an unknown origin."
        : `The first entity was:\n\n${indent(chalk.magenta(oldTypeSource))}`;
      const secondEntityDetails = !newTypeSource
        ? "The second type was registered from an unknown origin."
        : `The second entity was:\n\n${indent(chalk.yellow(newTypeSource))}`;
      throw new Error(
        `A type naming conflict has occurred - two entities have tried to define the same type '${chalk.bold(
          typeName,
        )}'.\n\n${indent(firstEntityDetails)}\n\n${indent(
          secondEntityDetails,
        )}`,
      );
    }
    allTypesSources[typeName] = newTypeSource;
    typeRegistry[typeName] = {
      klass,
      scope,
      specGenerator,
      origin,
      Plan,
    };
  }

  const build: GraphileBuild.BuildBase = {
    options: builder.options,
    versions: {
      graphql: graphql.version,
      "graphile-build": version,
    },
    input,

    hasVersion(
      packageName: string,
      range: string,
      options: { includePrerelease?: boolean } = { includePrerelease: true },
    ): boolean {
      const packageVersion = this.versions[packageName];
      if (!packageVersion) return false;
      return semver.satisfies(packageVersion, range, options);
    },
    graphql,

    extend(base, extra, hint, behaviorOnConflict = "throw") {
      try {
        return extend(base, extra, hint);
      } catch (e) {
        if (behaviorOnConflict === "recoverable") {
          this.handleRecoverableError(e);
          return base as any;
        } else {
          throw e;
        }
      }
    },
    scopeByType,
    inflection,
    handleRecoverableError(e) {
      e["recoverable"] = true;
      throw e;
    },
    recoverable(value, callback) {
      try {
        return callback();
      } catch (e) {
        this.handleRecoverableError(e);
        return value;
      }
    },
    status: {
      currentHookName: null,
      currentHookEvent: null,
    },
    wrapDescription,
    stringTypeSpec,

    registerObjectType(typeName, scope, Plan, specGenerator, origin) {
      register(GraphQLObjectType, typeName, scope, Plan, specGenerator, origin);
    },
    registerUnionType(typeName, scope, specGenerator, origin) {
      register(GraphQLUnionType, typeName, scope, null, specGenerator, origin);
    },
    registerInterfaceType(typeName, scope, specGenerator, origin) {
      register(
        GraphQLInterfaceType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerInputObjectType(typeName, scope, specGenerator, origin) {
      register(
        GraphQLInputObjectType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerScalarType(typeName, scope, specGenerator, origin) {
      register(GraphQLScalarType, typeName, scope, null, specGenerator, origin);
    },
    registerEnumType(typeName, scope, specGenerator, origin) {
      register(GraphQLEnumType, typeName, scope, null, specGenerator, origin);
    },

    assertTypeName(typeName) {
      if (typeName in allTypesSources) {
        return true;
      } else {
        throw new Error(
          `Type name '${typeName}' is not registered - be sure to register the type before you attempt to reference it.`,
        );
      }
    },

    getTypeMetaByName(typeName) {
      // Meta for builtins
      switch (typeName) {
        case "String":
        case "ID":
        case "Boolean":
        case "Int":
        case "Float":
          return Object.assign(Object.create(null), {
            Constructor: GraphQLScalarType,
            scope: Object.freeze({}),
            origin: "GraphQL builtin",
          });
      }

      const details = typeRegistry[typeName];
      if (details != null) {
        const { klass: Constructor, scope, origin, Plan } = details;
        return Object.assign(Object.create(null), {
          Constructor,
          scope,
          origin,
          Plan,
        });
      }
      return null;
    },

    getTypeByName(typeName) {
      if (typeName in allTypes) {
        return allTypes[typeName];
      } else {
        const details = typeRegistry[typeName];
        if (details != null) {
          const { klass, scope, specGenerator, Plan } = details;

          const spec = specGenerator();
          // No need to have the user specify name, and they're forbidden from
          // changing name (use inflection instead!) so we just set it
          // ourselves:
          spec.name = typeName;

          const finishedBuild = build as ReturnType<
            typeof builder["createBuild"]
          >;
          const type = builder.newWithHooks<any>(
            finishedBuild,
            klass,
            spec,
            scope,
            Plan,
          );

          allTypes[typeName] = type;

          if (klass === GraphQLObjectType || klass === GraphQLInputObjectType) {
            // Perform fields check. It's critical that `allTypes[typeName]` is
            // set above this to prevent infinite loops in case one of our
            // fields is dependent on another type, which is in turn dependent
            // on this type - in this case we know there's at least one field
            // otherwise the conflict would not occur?
            if (Object.keys(type.getFields()).length === 0) {
              allTypes[typeName] = null;
              return null;
            }
          }

          return type;
        } else {
          allTypes[typeName] = undefined;
          return undefined;
        }
      }
    },
    getInputTypeByName(typeName) {
      const type = this.getTypeByName(typeName);
      if (!type || !isInputType(type)) {
        throw new Error(
          `Expected an input type named '${typeName}', instead found ${String(
            type,
          )}`,
        );
      }
      return type;
    },
    getOutputTypeByName(typeName) {
      const type = this.getTypeByName(typeName);
      if (!type || !isOutputType(type)) {
        throw new Error(
          `Expected an output type named '${typeName}', instead found ${String(
            type,
          )}`,
        );
      }
      return type;
    },
  };
  return build;
}
