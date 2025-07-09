import "graphile-config";
declare global {
    namespace GraphileConfig {
        interface Plugins {
            SubscriptionPlugin: true;
        }
        interface Provides {
            Subscription: true;
        }
    }
}
/**
 * This plugin registers the operation type for the 'subscription' operation, and
 * if that type adds at least one field then it will be added to the GraphQL
 * schema.
 *
 * By default we call this type `Subscription`, but you can rename it using the
 * `builtin` inflector.
 *
 * Removing this plugin will mean that your GraphQL schema will not allow
 * subscription operations.
 */
export declare const SubscriptionPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=SubscriptionPlugin.d.ts.map