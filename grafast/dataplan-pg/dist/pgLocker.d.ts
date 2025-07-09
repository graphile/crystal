import type { PgStmtBaseStep } from "./steps/pgStmt";
export type PgLockableParameter = "orderBy" | "first" | "last" | "offset" | "groupBy";
export type PgLockCallback<TStep extends PgStmtBaseStep<any>> = (step: TStep) => void;
export declare class PgLocker<TStep extends PgStmtBaseStep<any>> {
    private parent;
    /**
     * Determines if the PgSelectStep is "locked" - i.e. its
     * FROM,JOINs,WHERE,ORDER BY,LIMIT,OFFSET cannot be changed. Note this does
     * not prevent adding more SELECTs
     */
    locked: boolean;
    constructor(parent: TStep);
    private _beforeLock;
    private _afterLock;
    private _lockedParameter;
    /**
     * Performs the given call back just before the given PgLockableParameter is
     * locked.
     *
     * @remarks To make sure we do things in the right order (e.g. ensure all the
     * `order by` values are established before attempting to interpret a
     * `cursor` for `before`/`after`) we need a locking system. This locking
     * system allows for final actions to take place _just before_ the element is
     * locked, for example _just before_ the order is locked we might want to
     * check that the ordering is unique, and if it is not then we may want to
     * add the primary key to the ordering.
     */
    beforeLock(type: PgLockableParameter, callback: PgLockCallback<TStep>): void;
    /**
     * Performs the given call back just after the given PgLockableParameter is
     * locked.
     */
    afterLock(type: PgLockableParameter, callback: PgLockCallback<TStep>): void;
    private lockCallbacks;
    /**
     * Calls all the beforeLock actions for the given parameter and then locks
     * it.
     */
    lockParameter(type: PgLockableParameter): void;
    /**
     * Throw a helpful error if you're trying to modify something that's already
     * locked.
     */
    assertParameterUnlocked(type: PgLockableParameter): void;
    lockAllParameters(): void;
    lock(): void;
}
//# sourceMappingURL=pgLocker.d.ts.map