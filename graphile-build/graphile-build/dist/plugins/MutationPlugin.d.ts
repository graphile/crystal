import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            MutationPlugin: true;
        }
        interface Provides {
            Mutation: true;
        }
    }
}
/**
 * This plugin registers the operation type for the 'mutation' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Mutation`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * mutation operations.
 */
export declare const MutationPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=MutationPlugin.d.ts.map