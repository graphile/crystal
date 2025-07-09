import type { ExecutableStep, UnbatchedExecutionExtra } from "grafast";
import { UnbatchedStep } from "grafast";
import type { PgCodec } from "../index.js";
import type { PgSelectSingleStep } from "./pgSelectSingle.js";
import type { PgUnionAllSingleStep } from "./pgUnionAll.js";
export interface PgCursorDetails {
    readonly digest: string;
    readonly indicies: ReadonlyArray<{
        index: number;
        codec: PgCodec;
    }>;
}
/**
 * Given a PgSelectSingleStep, this will build a cursor by looking at all the
 * orders applied and then fetching them and building a cursor string from
 * them.
 */
export declare class PgCursorStep<TStep extends PgSelectSingleStep<any> | PgUnionAllSingleStep> extends UnbatchedStep<any> {
    static $$export: {
        moduleName: string;
        exportName: string;
    };
    isSyncAndSafe: boolean;
    itemDepId: number;
    cursorDetailsDepId: number;
    constructor($item: TStep, $cursorDetails: ExecutableStep<PgCursorDetails | null>);
    unbatchedExecute(_extra: UnbatchedExecutionExtra, itemTuple: any[] | null, cursorDetails: PgCursorDetails | null): string | null;
}
//# sourceMappingURL=pgCursor.d.ts.map