"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORTABLE = EXPORTABLE;
function EXPORTABLE(factory, args, nameHint) {
    const fn = factory(...args);
    if ((typeof fn === "function" || (typeof fn === "object" && fn !== null)) &&
        !("$exporter$factory" in fn)) {
        Object.defineProperties(fn, {
            $exporter$args: { value: args },
            $exporter$factory: { value: factory },
            $exporter$name: { writable: true, value: nameHint },
        });
    }
    return fn;
}
//# sourceMappingURL=exportable.js.map