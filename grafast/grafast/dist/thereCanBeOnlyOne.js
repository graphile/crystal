"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $$grafast = Symbol.for("grafast");
const globalAny = globalThis;
if (globalAny[$$grafast] === true) {
    // Already warned
}
else if (globalAny[$$grafast]) {
    console.trace(`WARNING: more than one version of the 'grafast' module has been instantiated - you must ensure there is exactly one grafast (e.g. using yarn "resolutions" or similar techniques). Try clearing your package lockfile and reinstalling.\n    ${String(globalAny[$$grafast].stack).replace(/\n/g, "\n    ")}`);
    globalAny[$$grafast] = true;
}
else {
    try {
        // Capture the stack trace
        throw new Error(`The first 'grafast' was installed here`);
    }
    catch (e) {
        globalAny[$$grafast] = e;
    }
}
//# sourceMappingURL=thereCanBeOnlyOne.js.map