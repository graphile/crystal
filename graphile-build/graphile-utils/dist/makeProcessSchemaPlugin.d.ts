import type { GraphQLSchema } from "grafast/graphql";
type ProcessSchemaFunction = (schema: GraphQLSchema) => GraphQLSchema;
export declare function makeProcessSchemaPlugin(callback: ProcessSchemaFunction): GraphileConfig.Plugin;
export {};
//# sourceMappingURL=makeProcessSchemaPlugin.d.ts.map