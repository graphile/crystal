import pluralize from "pluralize";

import { camelCase, constantCase, upperCamelCase } from "./utils.ts";

/**
 * Builds the base inflection object that will be passed into the inflection
 * phase to build the final inflectors.
 */
export const makeInitialInflection = () => ({
  pluralize: pluralize as (
    this: GraphileBuild.Inflection,
    text: string,
  ) => string,
  singularize: pluralize.singular as (
    this: GraphileBuild.Inflection,
    text: string,
  ) => string,
  upperCamelCase: upperCamelCase as (
    this: GraphileBuild.Inflection,
    text: string,
  ) => string,
  camelCase: camelCase as (
    this: GraphileBuild.Inflection,
    text: string,
  ) => string,
  constantCase: constantCase as (
    this: GraphileBuild.Inflection,
    text: string,
  ) => string,

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
   * - ...
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
   * - ...
   *
   * Other plugins may add their own builtins too; try and avoid conflicts!
   */
  builtin(this: GraphileBuild.Inflection, name: string): string {
    return name;
  },

  /** Take a type name and return the edge type name */
  edgeType(this: GraphileBuild.Inflection, typeName: string): string {
    return typeName + `Edge`;
  },

  /** Take a type name and return the connection type name */
  connectionType(this: GraphileBuild.Inflection, typeName: string): string {
    return typeName + `Connection`;
  },

  /** The name of a field that returns a connection */
  connectionField(this: GraphileBuild.Inflection, baseName: string): string {
    return baseName;
  },

  /** The name of a field that returns a list */
  listField(this: GraphileBuild.Inflection, baseName: string): string {
    return baseName + "List";
  },

  /**
   * Try and make something a valid GraphQL 'Name'.
   *
   * Name is defined in GraphQL to match this regexp:
   *
   *     /^[_A-Za-z][_0-9A-Za-z]*$/
   *
   * See: https://graphql.github.io/graphql-spec/June2018/#sec-Appendix-Grammar-Summary.Lexical-Tokens
   */
  coerceToGraphQLName(this: GraphileBuild.Inflection, name: string) {
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

  /**
   * Given the name of a GraphQL output type, what name should we use for the
   * equivalent input type?
   */
  inputType(this: GraphileBuild.Inflection, typeName: string) {
    return typeName + `Input`;
  },
});

/**
 * The base inflection object that will be passed into the inflection phase to
 * build the final inflectors.
 */
export type InflectionBase = ReturnType<typeof makeInitialInflection>;
