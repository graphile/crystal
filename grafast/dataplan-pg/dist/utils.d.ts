import { ExecutableStep } from "grafast";
import type { SQL } from "pg-sql2";
import type { PgResource } from "./datasource.js";
import type { PgClassSingleStep, PgSQLCallbackOrDirect } from "./interfaces.js";
export declare function assertPgClassSingleStep<TResource extends PgResource<any, any, any, any, any>>(step: ExecutableStep | PgClassSingleStep<TResource>): asserts step is PgClassSingleStep<TResource>;
export declare function makeScopedSQL<TThis extends {
    placeholder(value: any): SQL;
}>(that: TThis): <T>(cb: PgSQLCallbackOrDirect<T>) => T;
//# sourceMappingURL=utils.d.ts.map