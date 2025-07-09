"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgLocker = void 0;
const grafast_1 = require("grafast");
class PgLocker {
    constructor(parent) {
        this.parent = parent;
        /**
         * Determines if the PgSelectStep is "locked" - i.e. its
         * FROM,JOINs,WHERE,ORDER BY,LIMIT,OFFSET cannot be changed. Note this does
         * not prevent adding more SELECTs
         */
        this.locked = false;
        this._beforeLock = {
            orderBy: [],
            groupBy: [],
            first: [],
            last: [],
            offset: [],
        };
        this._afterLock = {
            orderBy: [],
            groupBy: [],
            first: [],
            last: [],
            offset: [],
        };
        this._lockedParameter = {
            orderBy: false,
            groupBy: false,
            first: false,
            last: false,
            offset: false,
        };
    }
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
    beforeLock(type, callback) {
        this.assertParameterUnlocked(type);
        this._beforeLock[type].push(callback);
    }
    /**
     * Performs the given call back just after the given PgLockableParameter is
     * locked.
     */
    afterLock(type, callback) {
        this.assertParameterUnlocked(type);
        this._afterLock[type].push(callback);
    }
    lockCallbacks(phase, type) {
        const list = phase === "beforeLock" ? this._beforeLock : this._afterLock;
        const callbacks = list[type];
        const l = callbacks.length;
        if (l > 0) {
            const toCall = callbacks.splice(0, l);
            for (let i = 0; i < l; i++) {
                toCall[i](this.parent);
            }
            if (callbacks.length > 0) {
                throw new Error(`beforeLock callback for '${type}' caused more beforeLock callbacks to be registered`);
            }
        }
    }
    /**
     * Calls all the beforeLock actions for the given parameter and then locks
     * it.
     */
    lockParameter(type) {
        if (this._lockedParameter[type] !== false) {
            return;
        }
        this.lockCallbacks("beforeLock", type);
        this._lockedParameter[type] = grafast_1.isDev
            ? new Error("Initially locked here").stack
            : true;
        this.lockCallbacks("afterLock", type);
    }
    /**
     * Throw a helpful error if you're trying to modify something that's already
     * locked.
     */
    assertParameterUnlocked(type) {
        const isLocked = this._lockedParameter[type];
        if (isLocked !== false) {
            if (typeof isLocked === "string") {
                throw new Error(`'${type}' has already been locked\n    ` +
                    isLocked.replace(/\n/g, "\n    ") +
                    "\n");
            }
            throw new Error(`'${type}' has already been locked`);
        }
    }
    lockAllParameters() {
        // // We must execute everything after `from` so we have the alias to reference
        // this.lockParameter("from");
        // this.lockParameter("join");
        this.lockParameter("groupBy");
        this.lockParameter("orderBy");
        // // We must execute where after orderBy because cursor queries require all orderBy attributes
        // this.lockParameter("cursorComparator");
        // this.lockParameter("whereBound");
        // this.lockParameter("where");
        // // 'where' -> 'whereBound' can affect 'offset'/'limit'
        // this.lockParameter("offset");
        // this.lockParameter("limit");
        // this.lockParameter("first");
        // this.lockParameter("last");
        // // We must execute select after orderBy otherwise we cannot generate a cursor
        // this.lockParameter("fixedSelectExpression");
        // this.lockParameter("selectCursor");
        // this.lockParameter("select");
    }
    lock() {
        this.lockAllParameters();
        this.locked = true;
    }
}
exports.PgLocker = PgLocker;
//# sourceMappingURL=pgLocker.js.map