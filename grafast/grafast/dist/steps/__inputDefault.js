"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__InputDefaultStep = void 0;
const step_js_1 = require("../step.js");
class __InputDefaultStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__InputDefaultStep",
    }; }
    constructor($variableValue, defaultValue) {
        super();
        this.defaultValue = defaultValue;
        this.isSyncAndSafe = true;
        this.addUnaryDependency($variableValue);
    }
    unbatchedExecute(_extra, variableValue) {
        return variableValue === undefined ? this.defaultValue : variableValue;
    }
    /** @internal */
    eval() {
        const $variable = this.getDep(0);
        const variableValue = $variable.eval();
        return variableValue === undefined ? this.defaultValue : variableValue;
    }
    /** @internal */
    evalIs(value) {
        if (value === undefined) {
            return false;
        }
        else {
            const $variable = this.getDep(0);
            return $variable.evalIs(undefined)
                ? this.defaultValue === value
                : $variable.evalIs(value);
        }
    }
    /** @internal */
    evalLength() {
        const $variable = this.getDep(0);
        return $variable.evalIs(undefined)
            ? Array.isArray(this.defaultValue)
                ? this.defaultValue.length
                : null
            : $variable.evalLength();
    }
}
exports.__InputDefaultStep = __InputDefaultStep;
//# sourceMappingURL=__inputDefault.js.map