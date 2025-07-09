"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__FlagStep = exports.TRAP_ERROR_OR_INHIBITED = exports.TRAP_INHIBITED = exports.TRAP_ERROR = void 0;
exports.inhibitOnNull = inhibitOnNull;
exports.assertNotNull = assertNotNull;
exports.trap = trap;
const error_js_1 = require("../error.js");
const inspect_js_1 = require("../inspect.js");
const interfaces_js_1 = require("../interfaces.js");
const step_js_1 = require("../step.js");
// PUBLIC FLAGS
exports.TRAP_ERROR = interfaces_js_1.FLAG_ERROR;
exports.TRAP_INHIBITED = interfaces_js_1.FLAG_INHIBITED;
exports.TRAP_ERROR_OR_INHIBITED = (interfaces_js_1.FLAG_ERROR |
    interfaces_js_1.FLAG_INHIBITED);
function digestAcceptFlags(acceptFlags) {
    const parts = [];
    if ((acceptFlags & interfaces_js_1.FLAG_NULL) === 0) {
        parts.push("rejectNull");
    }
    if ((acceptFlags & interfaces_js_1.FLAG_ERROR) !== 0) {
        parts.push("trapError");
    }
    if ((acceptFlags & interfaces_js_1.FLAG_INHIBITED) !== 0) {
        parts.push("trapInhibited");
    }
    return parts.join("&");
}
const TRAP_VALUES = [
    "NULL",
    "EMPTY_LIST",
    "PASS_THROUGH",
    // "UNDEFINED", // waiting for a need
];
const EMPTY_LIST = Object.freeze([]);
function trim(string, length = 15) {
    if (string.length > length) {
        return string.substring(0, length - 2) + "…";
    }
    else {
        return string;
    }
}
function resolveTrapValue(tv) {
    switch (tv) {
        case "NULL":
            return null;
        case "EMPTY_LIST":
            return EMPTY_LIST;
        case "PASS_THROUGH":
            return false;
        default: {
            const never = tv;
            throw new Error(`TrapValue '${never}' not understood; please use one of: ${TRAP_VALUES.join(", ")}`);
        }
    }
}
class __FlagStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__FlagStep",
    }; }
    constructor(step, options) {
        super();
        this.isSyncAndSafe = false;
        this.ifDep = null;
        const { acceptFlags = interfaces_js_1.DEFAULT_ACCEPT_FLAGS, onReject, if: $cond, valueForInhibited = "PASS_THROUGH", valueForError = "PASS_THROUGH", } = options;
        this.forbiddenFlags = interfaces_js_1.ALL_FLAGS & ~acceptFlags;
        this.onRejectReturnValue =
            onReject == null ? error_js_1.$$inhibit : (0, error_js_1.flagError)(onReject, step.id);
        this.valueForInhibited = resolveTrapValue(valueForInhibited);
        this.valueForError = resolveTrapValue(valueForError);
        this.canBeInlined =
            !$cond &&
                valueForInhibited === "PASS_THROUGH" &&
                valueForError === "PASS_THROUGH" &&
                // Can't PASS_THROUGH errors since they need to be converted into TRAPPED
                // error.
                // TODO: should we be handling this in Grafast core?
                (acceptFlags & interfaces_js_1.FLAG_ERROR) === 0;
        if (!this.canBeInlined) {
            this.addDependency({ step, acceptFlags: interfaces_js_1.TRAPPABLE_FLAGS });
            if ($cond) {
                this.ifDep = this.addDependency($cond);
            }
        }
        else {
            this.addDependency({ step, acceptFlags, onReject });
        }
        if ((0, step_js_1.isListCapableStep)(step)) {
            this.listItem = this._listItem;
        }
    }
    toStringMeta() {
        const acceptFlags = interfaces_js_1.ALL_FLAGS & ~this.forbiddenFlags;
        const rej = this.onRejectReturnValue
            ? trim(String(this.onRejectReturnValue))
            : (0, inspect_js_1.inspect)(this.onRejectReturnValue);
        const $if = this.ifDep !== null ? this.getDepOptions(this.ifDep).step : null;
        return `${this.dependencies[0].id}, ${$if ? `if(${$if.id}), ` : ``}${digestAcceptFlags(acceptFlags)}, onReject: ${rej}`;
    }
    [interfaces_js_1.$$deepDepSkip]() {
        return this.getDepOptions(0).step;
    }
    // Copied over listItem if the dependent step is a list capable step
    _listItem($item) {
        const $dep = this.dependencies[0];
        return (0, step_js_1.isListCapableStep)($dep) ? $dep.listItem($item) : $item;
    }
    /** Return inlining instructions if we can be inlined. @internal */
    inline(options) {
        if (!this.canBeInlined) {
            return null;
        }
        const step = this.dependencies[0];
        const forbiddenFlags = this.dependencyForbiddenFlags[0];
        const onReject = this.dependencyOnReject[0];
        const acceptFlags = interfaces_js_1.ALL_FLAGS & ~forbiddenFlags;
        if (
        // TODO: this logic could be improved so that more flag checks were
        // inlined, e.g. `trap(inhibitOnNull($foo), TRAP_INHIBIT)` should just
        // become `$foo`.
        //
        // However, we must be careful that we don't optimize away flags, e.g.
        // `trap(inhibitOnNull($foo), TRAP_INHIBIT, { if: $cond })` needs to see
        // the inhibit flag to know what to do, so in this case we shouldn't be
        // inlined. This may only apply to __FlagStep and might be something we
        // want to optimize later.
        options.onReject === undefined ||
            options.onReject === onReject) {
            if (options.acceptFlags === undefined ||
                options.acceptFlags === interfaces_js_1.DEFAULT_ACCEPT_FLAGS ||
                options.acceptFlags === acceptFlags ||
                false) {
                return { step, acceptFlags, onReject };
            }
        }
        return null;
    }
    deduplicate(_peers) {
        return _peers.filter((p) => {
            // ifDep has already been tested by Grafast (it's a dependency)
            if (p.forbiddenFlags !== this.forbiddenFlags)
                return false;
            if (p.onRejectReturnValue !== this.onRejectReturnValue)
                return false;
            if (p.valueForInhibited !== this.valueForInhibited)
                return false;
            if (p.valueForError !== this.valueForError)
                return false;
            if (p.canBeInlined !== this.canBeInlined)
                return false;
            return true;
        });
    }
    execute(_details) {
        throw new Error(`${this} not finalized?`);
    }
    finalize() {
        if (this.canBeInlined) {
            this.execute = this.passThroughExecute;
        }
        else {
            this.execute = this.fancyExecute;
        }
        super.finalize();
    }
    fancyExecute(details) {
        const dataEv = details.values[0];
        const condEv = this.ifDep === null ? null : details.values[this.ifDep];
        const { forbiddenFlags: thisForbiddenFlags, onRejectReturnValue, valueForError, valueForInhibited, } = this;
        return details.indexMap((i) => {
            const cond = condEv ? condEv.at(i) : true;
            const forbiddenFlags = cond
                ? thisForbiddenFlags
                : interfaces_js_1.DEFAULT_FORBIDDEN_FLAGS;
            // Search for "f2b3b1b3" for similar block
            const flags = dataEv._flagsAt(i);
            const disallowedFlags = flags & forbiddenFlags;
            if (disallowedFlags) {
                if (disallowedFlags & interfaces_js_1.FLAG_INHIBITED) {
                    // We were already rejected, maintain this
                    return error_js_1.$$inhibit;
                }
                else if (disallowedFlags & interfaces_js_1.FLAG_ERROR) {
                    // We were already rejected, maintain this
                    return (0, error_js_1.flagError)(dataEv.at(i));
                }
                else {
                    // We weren't already inhibited
                    return onRejectReturnValue;
                }
            }
            else {
                if (flags & interfaces_js_1.FLAG_ERROR && this.valueForError !== false) {
                    return valueForError;
                }
                if (flags & interfaces_js_1.FLAG_INHIBITED && this.valueForInhibited !== false) {
                    return valueForInhibited;
                }
                // Assume pass-through
                return dataEv.at(i);
            }
        });
    }
    // Checks already performed via addDependency, just pass everything through. Should have been inlined!
    passThroughExecute(details) {
        const ev = details.values[0];
        if (ev.isBatch) {
            return ev.entries;
        }
        else {
            const val = ev.value;
            return details.indexMap(() => val);
        }
    }
}
exports.__FlagStep = __FlagStep;
/**
 * Example use case: get user by id, but id is null: no need to fetch the user
 * since we know they won't exist.
 */
function inhibitOnNull($step, options) {
    return new __FlagStep($step, {
        ...options,
        acceptFlags: interfaces_js_1.DEFAULT_ACCEPT_FLAGS & ~interfaces_js_1.FLAG_NULL,
    });
}
/**
 * Example use case: expecting a node ID that represents a User, but get one
 * that represents a Post instead: throw error to tell user they've sent invalid
 * data.
 */
function assertNotNull($step, message, options) {
    return new __FlagStep($step, {
        ...options,
        acceptFlags: interfaces_js_1.DEFAULT_ACCEPT_FLAGS & ~interfaces_js_1.FLAG_NULL,
        onReject: new error_js_1.SafeError(message),
    });
}
function trap($step, acceptFlags, options) {
    return new __FlagStep($step, {
        ...options,
        acceptFlags: (acceptFlags & interfaces_js_1.TRAPPABLE_FLAGS) | interfaces_js_1.FLAG_NULL,
    });
}
// Have to overwrite the getDep method due to circular dependency
step_js_1.Step.prototype.getDep = function (depId, throwOnFlagged = false) {
    const { step, acceptFlags, onReject } = this.getDepOptions(depId);
    if (acceptFlags === interfaces_js_1.DEFAULT_ACCEPT_FLAGS && onReject == null) {
        return step;
    }
    else {
        if (throwOnFlagged) {
            throw new Error(`When retrieving dependency ${step} of ${this}, the dependency is flagged as ${digestAcceptFlags(acceptFlags)}/onReject=${String(onReject)}. Please use \`this.getDepOptions(depId)\` instead, and handle the flags`);
        }
        // Return a __FlagStep around options.step so that all the options are preserved.
        return new __FlagStep(step, { acceptFlags, onReject });
    }
};
//# sourceMappingURL=__flag.js.map