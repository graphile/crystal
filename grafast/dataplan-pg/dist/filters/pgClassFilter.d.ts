import { Modifier } from "grafast";
import type { SQL, SQLable } from "pg-sql2";
import { $$toSQL } from "pg-sql2";
import type { PgConditionLike } from "../index.js";
import type { PgCondition, PgConditionCapableParent } from "../steps/pgCondition.js";
export declare class PgClassFilter<TParent extends PgConditionCapableParent = PgConditionCapableParent> extends Modifier<PgCondition<TParent>> implements SQLable, PgConditionLike {
    readonly alias: SQL;
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    private conditions;
    private havingConditions;
    constructor(parent: PgCondition<TParent>, alias: SQL);
    where(condition: SQL): void;
    having(condition: SQL): void;
    apply(): void;
    [$$toSQL](): SQL;
}
//# sourceMappingURL=pgClassFilter.d.ts.map