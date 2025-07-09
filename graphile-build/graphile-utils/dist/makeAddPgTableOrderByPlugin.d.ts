import type { PgOrderSpec, PgSelectQueryBuilder } from "@dataplan/pg";
import type { GraphQLEnumValueConfig } from "graphql";
type OrderBySpecIdentity = string | Omit<PgOrderSpec, "direction"> | ((queryBuilder: PgSelectQueryBuilder) => Omit<PgOrderSpec, "direction">);
export interface MakeAddPgTableOrderByPluginOrders {
    [orderByEnumValue: string]: GraphQLEnumValueConfig;
}
export declare function makeAddPgTableOrderByPlugin(match: {
    serviceName?: string;
    schemaName: string;
    tableName: string;
}, ordersGenerator: (build: GraphileBuild.Build) => MakeAddPgTableOrderByPluginOrders, hint?: string): GraphileConfig.Plugin;
export type NullsSortMethod = "first" | "last" | "first-iff-ascending" | "last-iff-ascending" | undefined;
export interface OrderByAscDescOptions {
    unique?: boolean;
    nulls?: NullsSortMethod;
    /**
     * If this expression/column is nullable, you must set this true otherwise
     * cursor pagination over null values will break. If `nulls` is specified,
     * we'll default this to true.
     */
    nullable?: boolean;
}
export declare function orderByAscDesc(baseName: string, attributeOrSqlFragment: OrderBySpecIdentity, uniqueOrOptions?: boolean | OrderByAscDescOptions): MakeAddPgTableOrderByPluginOrders;
export {};
//# sourceMappingURL=makeAddPgTableOrderByPlugin.d.ts.map