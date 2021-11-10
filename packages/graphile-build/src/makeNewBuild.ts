import "./global";

import chalk from "chalk";
import type { ExecutablePlan } from "graphile-crystal";
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
} from "graphql";
import * as graphql from "graphql";
import * as semver from "semver";

// @ts-ignore
import { version } from "../package.json";
import extend, { indent } from "./extend";
import { makeInitialInflection } from "./inflection";
import type SchemaBuilder from "./SchemaBuilder";

export default function makeNewBuild(
  builder: SchemaBuilder<any>,
): GraphileEngine.BuildBase {
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
      klass: { new (spec: any): GraphQLNamedType };
      scope: GraphileEngine.SomeScope;
      specGenerator: any;
      origin: string | null | undefined;
      Plan?: { new (...args: any[]): ExecutablePlan<any> } | null;
    };
  } = {};

  const scopeByType = new Map<GraphQLNamedType, GraphileEngine.SomeScope>();

  // TODO: allow registering a previously constructed type.
  function register(
    klass: { new (spec: any): GraphQLNamedType },
    typeName: string,
    scope: GraphileEngine.SomeScope,
    Plan: { new (...args: any[]): ExecutablePlan<any> } | null,
    specGenerator: () => any,
    origin: string | null | undefined,
  ) {
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

  const build: GraphileEngine.BuildBase = {
    options: builder.options,
    versions: {
      graphql: require("graphql/package.json").version,
      "graphile-build": version,
    },

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

    extend,
    scopeByType,
    inflection: makeInitialInflection(),
    handleRecoverableError(e) {
      e["recoverable"] = true;
      throw e;
    },
    status: {
      currentHookName: null,
      currentHookEvent: null,
    },

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
          return type;
        } else {
          allTypes[typeName] = undefined;
          return undefined;
        }
      }
    },
  };
  return build;
}
