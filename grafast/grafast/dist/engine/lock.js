"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$$unlock = void 0;
exports.lock = lock;
exports.unlock = unlock;
/**
 * Used internally to prevent steps using other steps' optimize/finalize/etc
 * methods.
 *
 * @internal
 */
exports.$$unlock = Symbol("unlock");
function isLocked($step) {
    return $step[exports.$$unlock] !== undefined;
}
function lock($step) {
    if (!isLocked($step)) {
        const { optimize, finalize, deduplicate, deduplicatedWith } = $step;
        if (optimize) {
            $step.optimize = optimizeLocked;
        }
        if (typeof finalize === "function") {
            $step.finalize = finalizeLocked;
        }
        if (deduplicate) {
            $step.deduplicate = deduplicateLocked;
        }
        if (deduplicatedWith) {
            $step.deduplicatedWith = deduplicatedWithLocked;
        }
        $step[exports.$$unlock] = () => {
            $step[exports.$$unlock] = undefined;
            if (optimize && $step.optimize !== optimizeLocked) {
                console.warn(`Warning: ${$step}'s optimize method changed whilst locked`);
            }
            else {
                $step.optimize = optimize;
            }
            if (typeof finalize === "function" && $step.finalize !== finalizeLocked) {
                console.warn(`Warning: ${$step}'s finalize method changed whilst locked`);
            }
            else {
                $step.finalize = finalize;
            }
            if (deduplicate && $step.deduplicate !== deduplicateLocked) {
                console.warn(`Warning: ${$step}'s deduplicate method changed whilst locked`);
            }
            else {
                $step.deduplicate = deduplicate;
            }
            if (deduplicatedWith &&
                $step.deduplicatedWith !== deduplicatedWithLocked) {
                console.warn(`Warning: ${$step}'s deduplicatedWith method changed whilst locked`);
            }
            else {
                $step.deduplicatedWith = deduplicatedWith;
            }
        };
    }
}
function unlock($step) {
    if (isLocked($step)) {
        $step[exports.$$unlock]();
        return true;
    }
    else {
        return false;
    }
}
function optimizeLocked() {
    throw new Error(`Only Grafast may call a step's optimize method; rather than calling optimize on the steps your class depends on, consider opting in to multiple optimization passes via \`allowMultipleOptimizations\`.`);
}
function finalizeLocked() {
    throw new Error(`Only Grafast may call a step's finalize method; steps should not attempt to interact with other steps during finalize.`);
}
function deduplicateLocked() {
    throw new Error(`Only Grafast may call a step's deduplicate method.`);
}
function deduplicatedWithLocked() {
    throw new Error(`Only Grafast may call a step's deduplicatedWith method.`);
}
//# sourceMappingURL=lock.js.map