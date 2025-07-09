"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionStep = void 0;
exports.condition = condition;
const step_js_1 = require("../step.js");
const unaryOperators = ["null", "not null", "exists", "not exists"];
const binaryOperators = ["===", "!=="];
class ConditionStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ConditionStep",
    }; }
    constructor(op, step1, step2) {
        super();
        this.op = op;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        if (!step2) {
            // unary
            if (!unaryOperators.includes(op)) {
                throw new Error(`Unary operator '${op}' is not known; supported operators: ${unaryOperators.join(", ")}`);
            }
            this.addDependency(step1);
        }
        else {
            // binary
            if (!binaryOperators.includes(op)) {
                throw new Error(`Unary operator '${op}' is not known; supported operators: ${binaryOperators.join(", ")}`);
            }
            this.addDependency(step1);
            this.addDependency(step2);
        }
    }
    toStringMeta() {
        if (unaryOperators.includes(this.op)) {
            return `${this.op}`;
        }
        else {
            const $dep1 = this.getDepOptions(0).step;
            const $dep2 = this.getDepOptions(1).step;
            return `${$dep1.id} ${this.op} ${$dep2.id}`;
        }
    }
    finalize() {
        this.unbatchedExecute = this.makeUnbatchedExecute();
        super.finalize();
    }
    makeUnbatchedExecute() {
        switch (this.op) {
            case "null":
                return isNull;
            case "not null":
                return isNotNull;
            case "exists":
                return isNotNullish;
            case "not exists":
                return isNullish;
            case "===":
                return isEqual;
            case "!==":
                return isNotEqual;
            default: {
                const never = this.op;
                throw new Error(`Operator ${never} is not supported`);
            }
        }
    }
    unbatchedExecute(_extra, _value1, _value2) {
        throw new Error(`${this} was not finalized?`);
    }
}
exports.ConditionStep = ConditionStep;
function isNull(_extra, value1) {
    return value1 === null;
}
function isNotNull(_extra, value1) {
    return value1 !== null;
}
function isNullish(_extra, value1) {
    return value1 == null;
}
function isNotNullish(_extra, value1) {
    return value1 != null;
}
function isEqual(_extra, value1, value2) {
    return value1 === value2;
}
function isNotEqual(_extra, value1, value2) {
    return value1 !== value2;
}
function condition(op, step1, step2) {
    return new ConditionStep(op, step1, step2);
}
//# sourceMappingURL=condition.js.map