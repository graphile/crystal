declare global {
    namespace GraphileConfig {
        interface Plugins {
            ClientMutationIdDescriptionPlugin: true;
        }
        interface Provides {
            ClientMutationIdDescription: true;
        }
    }
}
/**
 * Adds generic descriptions (where not already present) to:
 *
 * - the 'clientMutationId' input object field on mutation inputs,
 * - the 'clientMutationId' output field on a mutation payload, and
 * - the 'input' argument to a GraphQL mutation field.
 *
 * Descriptions aren't required in these places, so you can safely disable this
 * plugin.
 */
export declare const ClientMutationIdDescriptionPlugin: GraphileConfig.Plugin;
//# sourceMappingURL=ClientMutationIdDescriptionPlugin.d.ts.map