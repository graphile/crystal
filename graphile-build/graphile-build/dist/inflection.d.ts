/**
 * Builds the base inflection object that will be passed into the inflection
 * phase to build the final inflectors.
 */
export declare const makeInitialInflection: () => {
    pluralize: (this: GraphileBuild.Inflection, text: string) => string;
    singularize: (this: GraphileBuild.Inflection, text: string) => string;
    upperCamelCase: (this: GraphileBuild.Inflection, text: string) => string;
    camelCase: (this: GraphileBuild.Inflection, text: string) => string;
    constantCase: (this: GraphileBuild.Inflection, text: string) => string;
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
    builtin(this: GraphileBuild.Inflection, name: string): string;
    /** Take a type name and return the edge type name */
    edgeType(this: GraphileBuild.Inflection, typeName: string): string;
    /** Take a type name and return the connection type name */
    connectionType(this: GraphileBuild.Inflection, typeName: string): string;
    /** The name of a field that returns a connection */
    connectionField(this: GraphileBuild.Inflection, baseName: string): string;
    /** The name of a field that returns a list */
    listField(this: GraphileBuild.Inflection, baseName: string): string;
    /**
     * Try and make something a valid GraphQL 'Name'.
     *
     * Name is defined in GraphQL to match this regexp:
     *
     *     /^[_A-Za-z][_0-9A-Za-z]*$/
     *
     * See: https://graphql.github.io/graphql-spec/June2018/#sec-Appendix-Grammar-Summary.Lexical-Tokens
     */
    coerceToGraphQLName(this: GraphileBuild.Inflection, name: string): string;
    /**
     * Given the name of a GraphQL output type, what name should we use for the
     * equivalent input type?
     */
    inputType(this: GraphileBuild.Inflection, typeName: string): string;
};
/**
 * The base inflection object that will be passed into the inflection phase to
 * build the final inflectors.
 */
export type InflectionBase = ReturnType<typeof makeInitialInflection>;
//# sourceMappingURL=inflection.d.ts.map