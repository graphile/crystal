import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgConditionLike } from "../interfaces.js";
export declare class PgBooleanFilter extends Modifier<PgConditionLike> implements SQLable {
    readonly expression: SQL;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    private conditions;
    private havingConditions;
    alias: SQL;
    constructor(classFilter: PgConditionLike, expression: SQL);
    where(condition: SQL): void;
    having(condition: SQL): void;
    apply(): void;
    [$$toSQL](): SQL;
}
//# sourceMappingURL=pgBooleanFilter.d.ts.map