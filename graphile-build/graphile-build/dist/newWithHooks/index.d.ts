import type { GraphQLNamedType } from "grafast/graphql";
import { GraphQLSchema } from "grafast/graphql";
import type { ScopeForType, SpecForType } from "../global.js";
import type SchemaBuilder from "../SchemaBuilder.js";
interface MakeNewWithHooksOptions {
    builder: SchemaBuilder<any>;
}
export type NewWithHooksFunction = <TType extends GraphQLNamedType | GraphQLSchema>(build: GraphileBuild.Build, klass: {
    new (spec: SpecForType<TType>): TType;
}, spec: SpecForType<TType>, scope: ScopeForType<TType>) => TType;
/**
 * Returns a 'newWithHooks' function suitable for creating GraphQL types with
 * the graphile-build plugin system applied.
 */
export declare function makeNewWithHooks({ builder }: MakeNewWithHooksOptions): {
    newWithHooks: NewWithHooksFunction;
};
export {};
//# sourceMappingURL=index.d.ts.map