import "./global.js";

import chalk from "chalk";
import type { ExecutableStep } from "grafast";
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
import { inspect } from "util";

import type { Behavior, BehaviorDynamicMethods } from "./behavior.js";
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
  behavior: Behavior & BehaviorDynamicMethods,
): GraphileBuild.BuildBase {
  const building = new Set<string>();
  const allTypes = {
    Int: GraphQLInt,
    Float: GraphQLFloat,
    String: GraphQLString,
    Boolean: GraphQLBoolean,
    ID: GraphQLID,
  } as Record<string, GraphQLNamedType | null | undefined>;

  const allTypesSources = {
    Int: "GraphQL Built-in",
    Float: "GraphQL Built-in",
    String: "GraphQL Built-in",
    Boolean: "GraphQL Built-in",
    ID: "GraphQL Built-in",
  } as Record<string, string>;

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
      Step?:
        | ((step: ExecutableStep) => asserts step is ExecutableStep)
        | { new (...args: any[]): ExecutableStep }
        | null;
    };
  } = Object.create(null);

  const scopeByType = new Map<GraphQLNamedType, GraphileBuild.SomeScope>();

  // TODO: allow registering a previously constructed type.
  function register(
    this: GraphileBuild.BuildBase,
    klass: { new (spec: any): GraphQLNamedType },
    typeName: string,
    scope: GraphileBuild.SomeScope,
    Step:
      | ((step: ExecutableStep) => asserts step is ExecutableStep)
      | { new (...args: any[]): ExecutableStep }
      | null,
    specGenerator: () => any,
    origin: string | null | undefined,
  ) {
    if (!this.status.isBuildPhaseComplete || this.status.isInitPhaseComplete) {
      throw new Error("Types may only be registered in the 'init' phase");
    }
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
      Step,
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
    getAllTypes() {
      return allTypes;
    },
    scopeByType,
    inflection,
    handleRecoverableError(e) {
      (e as any)["recoverable"] = true;
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
      isBuildPhaseComplete: false,
      isInitPhaseComplete: false,
      currentHookName: null,
      currentHookEvent: null,
    },
    wrapDescription,
    stringTypeSpec,

    behavior,

    registerObjectType(typeName, scope, Step, specGenerator, origin) {
      register.call(
        this,
        GraphQLObjectType,
        typeName,
        scope,
        Step,
        specGenerator,
        origin,
      );
    },
    registerUnionType(typeName, scope, specGenerator, origin) {
      register.call(
        this,
        GraphQLUnionType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerInterfaceType(typeName, scope, specGenerator, origin) {
      register.call(
        this,
        GraphQLInterfaceType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerInputObjectType(typeName, scope, specGenerator, origin) {
      register.call(
        this,
        GraphQLInputObjectType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerScalarType(typeName, scope, specGenerator, origin) {
      register.call(
        this,
        GraphQLScalarType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },
    registerEnumType(typeName, scope, specGenerator, origin) {
      register.call(
        this,
        GraphQLEnumType,
        typeName,
        scope,
        null,
        specGenerator,
        origin,
      );
    },

    assertTypeName(typeName) {
      if (!this.status.isBuildPhaseComplete) {
        throw new Error(
          "Must not call build.assertTypeName before 'build' phase is complete",
        );
      }
      if (typeName in allTypesSources) {
        return true;
      } else {
        throw new Error(
          `Type name '${typeName}' is not registered - be sure to register the type before you attempt to reference it.`,
        );
      }
    },

    getTypeMetaByName(typeName) {
      if (!this.status.isBuildPhaseComplete) {
        throw new Error(
          "Must not call build.getTypeMetaByName before 'build' phase is complete",
        );
      }
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
        const { klass: Constructor, scope, origin, Step } = details;
        return Object.assign(Object.create(null), {
          Constructor,
          scope,
          origin,
          Step,
        });
      }
      return null;
    },

    getTypeByName(typeName) {
      if (!this.status.isInitPhaseComplete) {
        throw new Error(
          "Must not call build.getTypeByName before 'init' phase is complete",
        );
      }
      if (typeName in allTypes) {
        return allTypes[typeName];
      } else if (building.has(typeName)) {
        throw new Error(
          `Construction cycle detected: ${typeName} is already being built. Most likely this means that you forgot to use a callback for 'fields', 'interfaces', 'types', etc. when defining a type.`,
        );
      } else {
        building.add(typeName);
        try {
          const details = typeRegistry[typeName];
          if (details != null) {
            const { klass, scope, specGenerator, Step } = details;

            const spec = specGenerator();
            // No need to have the user specify name, and they're forbidden from
            // changing name (use inflection instead!) so we just set it
            // ourselves:
            spec.name = typeName;

            const finishedBuild = build as ReturnType<
              (typeof builder)["createBuild"]
            >;
            const type = builder.newWithHooks<any>(
              finishedBuild,
              klass,
              spec,
              scope,
              Step,
            );

            allTypes[typeName] = type;

            if (
              klass === GraphQLObjectType ||
              klass === GraphQLInputObjectType
            ) {
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
        } catch (e) {
          // Error occurred, store null
          allTypes[typeName] = null;
          // Rethrow error
          throw e;
        } finally {
          building.delete(typeName);
        }
      }
    },
    getInputTypeByName(typeName) {
      if (!this.status.isInitPhaseComplete) {
        throw new Error(
          "Must not call build.getInputTypeByName before 'init' phase is complete",
        );
      }
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
      if (!this.status.isInitPhaseComplete) {
        throw new Error(
          "Must not call build.getOutputTypeByName before 'init' phase is complete",
        );
      }
      const type = this.getTypeByName(typeName);
      if (!type || !isOutputType(type)) {
        throw new Error(
          `Expected an output type named '${typeName}', instead found ${inspect(
            type,
          )}`,
        );
      }
      return type;
    },
    nullableIf<T extends graphql.GraphQLType>(
      condition: boolean,
      type: T,
    ): T | graphql.GraphQLNonNull<T> {
      if (condition) {
        return type;
      } else {
        return new graphql.GraphQLNonNull(type);
      }
    },

    _pluginMeta: Object.create(null),
  };
  return build;
}
