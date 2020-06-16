import "./global";
import * as graphql from "graphql";
import {
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
  getAliasFromResolveInfo as rawGetAliasFromResolveInfo,
} from "graphql-parse-resolve-info";
import { ResolveTree } from "graphql-parse-resolve-info";
import pluralize from "pluralize";
import LRU from "@graphile/lru";
import * as semver from "semver";
import { upperCamelCase, camelCase, constantCase } from "./utils";
import swallowError from "./swallowError";
import resolveNode from "./resolveNode";
import { LiveCoordinator } from "./Live";

import SchemaBuilder from "./SchemaBuilder";

import extend, { indent } from "./extend";
import chalk from "chalk";
import { createHash } from "crypto";

// @ts-ignore
import { version } from "../package.json";
import { makeNewWithHooks } from "./newWithHooks";

const makeInitialInflection = () => ({
  pluralize,
  singularize: pluralize.singular,
  upperCamelCase,
  camelCase,
  constantCase,

  /**
   * Built-in names (allows you to override these in the output schema)
   *
   * e.g.:
   *
   * graphile-build:
   *
   * - Query
   * - Mutation
   * - Subscription
   * - Node
   * - PageInfo
   *
   * graphile-build-pg:
   *
   * - Interval
   * - BigInt
   * - BigFloat
   * - BitString
   * - Point
   * - Date
   * - Datetime
   * - Time
   * - JSON
   * - UUID
   * - InternetAddress
   *
   * Other plugins may add their own builtins too; try and avoid conflicts!
   */
  builtin: (name: string): string => name,

  /**
   *  When converting a query field to a subscription (live query) field, this allows you to rename it
   */
  live: (name: string) => name,

  /**
   * Try and make something a valid GraphQL 'Name'.
   *
   * Name is defined in GraphQL to match this regexp:
   *
   * /^[_A-Za-z][_0-9A-Za-z]*$/
   *
   * See: https://graphql.github.io/graphql-spec/June2018/#sec-Appendix-Grammar-Summary.Lexical-Tokens
   */
  coerceToGraphQLName: (name: string) => {
    let resultingName = name;

    /*
     * If our 'name' starts with a digit, we must prefix it with
     * something. We'll just use an underscore.
     */
    if (resultingName.match(/^[0-9]/)) {
      resultingName = "_" + resultingName;
    }

    /*
     * Fields beginning with two underscores are reserved by the GraphQL
     * introspection systems, trim to just one.
     */
    resultingName = resultingName.replace(/^__+/g, "_");

    return resultingName;
  },
});

export type InflectionBase = ReturnType<typeof makeInitialInflection>;

/*
 * This should be more than enough for normal usage. If you come under a
 * sophisticated attack then the attacker can empty this of useful values (with
 * a lot of work) but because we use SHA1 hashes under the covers the aliases
 * will still be consistent even after the LRU cache is exhausted. And SHA1 can
 * produce half a million hashes per second on my machine, the LRU only gives
 * us a 10x speedup!
 */
const hashCache = new LRU({ maxLength: 100000 });

/*
 * This function must never return a string longer than 56 characters.
 *
 * This function must only output alphanumeric and underscore characters.
 *
 * Collisions in SHA1 aren't problematic here (for us; they will be problematic
 * for the user deliberately causing them, but that's their own fault!), so
 * we'll happily take the performance boost over SHA256.
 */
function hashFieldAlias(str: string) {
  const precomputed = hashCache.get(str);
  if (precomputed) return precomputed;
  const hash = createHash("sha1").update(str).digest("hex");
  hashCache.set(str, hash);
  return hash;
}

/*
 * This function may be replaced at any time, but all versions of it will
 * always return a representation of `alias` (a valid GraphQL identifier)
 * that:
 *
 *   1. won't conflict with normal GraphQL field names
 *   2. won't be over 60 characters long (allows for systems with alias length limits, such as PG)
 *   3. will give the same value when called multiple times within the same GraphQL query
 *   4. matches the regex /^[@!-_A-Za-z0-9]+$/
 *   5. will not be prefixed with `__` (as that will conflict with other Graphile internals)
 *
 * It does not guarantee that this alias will be human readable!
 */
function getSafeAliasFromAlias(alias: string) {
  if (alias.length <= 60 && !alias.startsWith("@")) {
    // Use the `@` to prevent conflicting with normal GraphQL field names, but otherwise let it through verbatim.
    return `@${alias}`;
  } else if (alias.length > 1024) {
    throw new Error(
      `GraphQL alias '${alias}' is too long, use shorter aliases (max length 1024).`,
    );
  } else {
    return `@@${hashFieldAlias(alias)}`;
  }
}

/*
 * This provides a "safe" version of the alias from ResolveInfo, guaranteed to
 * never be longer than 60 characters. This makes it suitable as a PostgreSQL
 * identifier.
 */
function getSafeAliasFromResolveInfo(
  resolveInfo: import("graphql").GraphQLResolveInfo,
) {
  const alias = rawGetAliasFromResolveInfo(resolveInfo);
  return getSafeAliasFromAlias(alias);
}

type FieldSpec = graphql.GraphQLFieldConfig<any, any>;

export type GetDataFromParsedResolveInfoFragmentFunction = (
  parsedResolveInfoFragment: ResolveTree,
  Type: graphql.GraphQLOutputType,
) => GraphileEngine.ResolvedLookAhead;

declare global {
  namespace GraphileEngine {
    type FieldWithHooksFunction = (
      fieldName: string,
      spec:
        | FieldSpec
        | ((context: ContextGraphQLObjectTypeFieldsField) => FieldSpec),
      fieldScope: ScopeGraphQLObjectTypeFieldsField,
    ) => graphql.GraphQLFieldConfig<any, any>;

    type InputFieldWithHooksFunction = (
      fieldName: string,
      spec:
        | graphql.GraphQLInputFieldConfig
        | ((
            context: ContextGraphQLInputObjectTypeFieldsField,
          ) => graphql.GraphQLInputFieldConfig),
      fieldScope: ScopeGraphQLInputObjectTypeFieldsField,
    ) => graphql.GraphQLInputFieldConfig;
  }
}
export default function makeNewBuild(
  builder: SchemaBuilder,
): GraphileEngine.BuildBase {
  const allTypes = {
    Int: graphql.GraphQLInt,
    Float: graphql.GraphQLFloat,
    String: graphql.GraphQLString,
    Boolean: graphql.GraphQLBoolean,
    ID: graphql.GraphQLID,
  };

  const allTypesSources = {
    Int: "GraphQL Built-in",
    Float: "GraphQL Built-in",
    String: "GraphQL Built-in",
    Boolean: "GraphQL Built-in",
    ID: "GraphQL Built-in",
  };
  const {
    newWithHooks,
    fieldDataGeneratorsByFieldNameByType,
    fieldArgDataGeneratorsByFieldNameByType,
  } = makeNewWithHooks({ builder });
  return {
    options: builder.options,
    graphileBuildVersion: version,
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

    _pluginMeta: {},

    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
    getSafeAliasFromAlias,
    ...({ getAliasFromResolveInfo: getSafeAliasFromResolveInfo } as {}), // DEPRECATED: do not use this!
    getSafeAliasFromResolveInfo,
    resolveAlias(data, _args, _context, resolveInfo) {
      const alias = getSafeAliasFromResolveInfo(resolveInfo);
      return data[alias];
    },
    addType(
      type: graphql.GraphQLNamedType,
      origin?: string | null | undefined,
    ): void {
      if (!type.name) {
        throw new Error(
          `addType must only be called with named types, try using require('graphql').getNamedType`,
        );
      }
      const newTypeSource =
        origin ||
        // 'this' is typically only available after the build is finalized
        (this
          ? `'addType' call during hook '${this.status.currentHookName}'`
          : null);
      if (allTypes[type.name]) {
        if (allTypes[type.name] !== type) {
          const oldTypeSource = allTypesSources[type.name];
          const firstEntityDetails = !oldTypeSource
            ? "The first type was registered from an unknown origin."
            : `The first entity was:\n\n${indent(
                chalk.magenta(oldTypeSource),
              )}`;
          const secondEntityDetails = !newTypeSource
            ? "The second type was registered from an unknown origin."
            : `The second entity was:\n\n${indent(
                chalk.yellow(newTypeSource),
              )}`;
          throw new Error(
            `A type naming conflict has occurred - two entities have tried to define the same type '${chalk.bold(
              type.name,
            )}'.\n\n${indent(firstEntityDetails)}\n\n${indent(
              secondEntityDetails,
            )}`,
          );
        }
      } else {
        allTypes[type.name] = type;
        allTypesSources[type.name] = newTypeSource;
      }
    },
    getTypeByName(typeName) {
      return allTypes[typeName];
    },
    extend,

    newWithHooks,

    /**
     * @deprecated Use `fieldDataGeneratorsByFieldNameByType` instead.
     */
    fieldDataGeneratorsByType: fieldDataGeneratorsByFieldNameByType,

    fieldDataGeneratorsByFieldNameByType,
    fieldArgDataGeneratorsByFieldNameByType,
    scopeByType: new Map(),

    inflection: makeInitialInflection(),

    swallowError,
    // resolveNode: EXPERIMENTAL, API might change!
    resolveNode,
    status: {
      currentHookName: null,
      currentHookEvent: null,
    },

    liveCoordinator: new LiveCoordinator(),
  };
}
