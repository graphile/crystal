"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStep = void 0;
exports.error = error;
const error_js_1 = require("../error.js");
const inspect_js_1 = require("../inspect.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
class ErrorStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ErrorStep",
    }; }
    constructor(error) {
        super();
        this.isSyncAndSafe = false;
        if (!(error instanceof Error)) {
            throw new Error(`${this} called with non-Error ${(0, inspect_js_1.inspect)(error)}`);
        }
        this.error = error;
    }
    execute({ count }) {
        return (0, utils_js_1.arrayOfLength)(count, (0, error_js_1.flagError)(this.error));
    }
    unbatchedExecute() {
        return (0, error_js_1.flagError)(this.error);
    }
}
exports.ErrorStep = ErrorStep;
function error(error) {
    return new ErrorStep(error);
}
//# sourceMappingURL=error.js.map