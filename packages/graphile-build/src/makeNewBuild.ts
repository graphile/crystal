import "./global";

import chalk from "chalk";
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
    };
  } = {};

  const scopeByType = new Map<GraphQLNamedType, GraphileEngine.SomeScope>();

  // TODO: allow registering a previously constructed type.
  function register(
    klass: { new (spec: any): GraphQLNamedType },
    typeName: string,
    scope: GraphileEngine.SomeScope,
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

    registerObjectType(typeName, scope, specGenerator, origin) {
      register(GraphQLObjectType, typeName, scope, specGenerator, origin);
    },
    registerUnionType(typeName, scope, specGenerator, origin) {
      register(GraphQLUnionType, typeName, scope, specGenerator, origin);
    },
    registerInterfaceType(typeName, scope, specGenerator, origin) {
      register(GraphQLInterfaceType, typeName, scope, specGenerator, origin);
    },
    registerInputObjectType(typeName, scope, specGenerator, origin) {
      register(GraphQLInputObjectType, typeName, scope, specGenerator, origin);
    },
    registerScalarType(typeName, scope, specGenerator, origin) {
      register(GraphQLScalarType, typeName, scope, specGenerator, origin);
    },
    registerEnumType(typeName, scope, specGenerator, origin) {
      register(GraphQLEnumType, typeName, scope, specGenerator, origin);
    },

    getTypeByName(typeName) {
      if (typeName in allTypes) {
        return allTypes[typeName];
      } else if (typeName in typeRegistry) {
        const details = typeRegistry[typeName];
        const { klass, scope, specGenerator } = details;
        const spec = specGenerator();
        const finishedBuild = build as ReturnType<
          typeof builder["createBuild"]
        >;
        const type = builder.newWithHooks<any>(
          finishedBuild,
          klass,
          spec,
          scope,
        );
        allTypes[typeName] = type;
        return type;
      } else {
        allTypes[typeName] = undefined;
        return undefined;
      }
    },
  };
  return build;
}
