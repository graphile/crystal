import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgConditionLike } from "../interfaces.js";
export declare class PgOrFilter extends Modifier<PgConditionLike> implements SQLable {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    private conditions;
    private havingConditions;
    alias: SQL;
    constructor($classFilterPlan: PgConditionLike);
    where(condition: SQL): void;
    having(condition: SQL): void;
    apply(): void;
    [$$toSQL](): SQL;
}
//# sourceMappingURL=pgOrFilter.d.ts.map