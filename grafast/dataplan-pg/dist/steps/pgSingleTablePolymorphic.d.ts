import type { ExecutionDetails, GrafastResultsList, PolymorphicData, PolymorphicStep } from "grafast";
import { Step } from "grafast";
import type { GraphQLObjectType } from "grafast/graphql";
import type { PgResource } from "../datasource.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
/**
 * This polymorphic plan is to support polymorphism from a single PostgreSQL
 * table, typically these tables will have a "type" (or similar) attribute that
 * details the type of the data in the row. This class accepts a plan that
 * resolves to the GraphQLObjectType type name (a string), and a second plan
 * that represents a row from this table.
 */
export declare class PgSingleTablePolymorphicStep<TResource extends PgResource<any, any, any, any, any>> extends Step<unknown> implements PolymorphicStep {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    private typeStepId;
    private rowStepId;
    constructor($typeName: Step<string | null>, $row: PgSelectSingleStep<TResource>);
    private rowPlan;
    deduplicate(peers: PgSingleTablePolymorphicStep<any>[]): PgSingleTablePolymorphicStep<TResource>[];
    planForType(_type: GraphQLObjectType): Step;
    execute({ indexMap, values, }: ExecutionDetails): GrafastResultsList<PolymorphicData<string, ReadonlyArray<unknown[]>> | null>;
}
export declare function pgSingleTablePolymorphic<TResource extends PgResource<any, any, any, any, any>>($typeName: Step<string | null>, $row: PgSelectSingleStep<TResource>): PgSingleTablePolymorphicStep<TResource>;
//# sourceMappingURL=pgSingleTablePolymorphic.d.ts.map