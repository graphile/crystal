import pluralize from "pluralize";

import { camelCase, constantCase, upperCamelCase } from "./utils.js";

export const makeInitialInflection = () => ({
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
