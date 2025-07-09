import type { SQL } from "pg-sql2";
import type { PgResource } from "../datasource.js";
import type { PgClassFilter } from "../filters/pgClassFilter.js";
import type { PgConditionCapableParent } from "./pgCondition.js";
import { PgCondition } from "./pgCondition.js";
export declare class PgTempTable<TResource extends PgResource<any, any, any, any, any>> implements PgConditionCapableParent {
    readonly parent: PgClassFilter;
    readonly resource: TResource;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    readonly alias: SQL;
    readonly conditions: SQL[];
    constructor(parent: PgClassFilter, resource: TResource);
    where(condition: SQL): void;
    wherePlan(): PgCondition<this>;
    fromExpression(): SQL;
}
//# sourceMappingURL=pgTempTable.d.ts.map