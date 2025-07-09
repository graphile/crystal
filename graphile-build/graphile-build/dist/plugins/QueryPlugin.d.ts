import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            QueryPlugin: true;
        }
        interface Provides {
            Query: true;
        }
    }
}
/**
 * This plugin registers the operation type for the 'query' operation; the
 * GraphQL spec current requires GraphQL schemas to have an object type for the
 * 'query' operation that defines at least one non-introspection field.
 *
 * By default we call this type `Query`, but you can rename it using the
 * `builtin` inflector.
 *
 * Trivia: this requirement in the GraphQL spec may be lifted in future to
 * allow for Mutation- or Subscription-only schemas.
 *
 * Removing this plugin will result in an invalid GraphQL schema.
 */
export declare const QueryPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=QueryPlugin.d.ts.map