"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__InputDynamicScalarStep = void 0;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const error_js_1 = require("../error.js");
const step_js_1 = require("../step.js");
const { Kind } = graphql;
/**
 * Handles "leaves" (scalars)
 */
class __InputDynamicScalarStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__InputDynamicScalarStep",
    }; }
    constructor(inputType, value) {
        super();
        this.value = value;
        this.isSyncAndSafe = true;
        this.variableNames = [];
        this.unbatchedExecute = (_extra, ...variableValues) => {
            const converted = this.valueFromValues(variableValues);
            return converted;
        };
        // Walk value and add any variable references as dependencies
        const walk = (inputValue) => {
            switch (inputValue.kind) {
                case Kind.VARIABLE: {
                    const variableName = inputValue.name.value;
                    this.variableNames.push(variableName);
                    const variableValuePlan = this.operationPlan.trackedVariableValuesStep.get(variableName);
                    this.addDependency(variableValuePlan);
                    return;
                }
                case Kind.INT:
                case Kind.FLOAT:
                case Kind.STRING:
                case Kind.BOOLEAN:
                case Kind.NULL: {
                    // No need to take action
                    return;
                }
                case Kind.LIST: {
                    inputValue.values.map(walk);
                    return;
                }
                case Kind.OBJECT: {
                    for (const field of inputValue.fields) {
                        walk(field.value);
                    }
                    return;
                }
                case Kind.ENUM: {
                    throw new error_js_1.SafeError("Enum values cannot be included within scalars");
                }
                default: {
                    const never = inputValue;
                    throw new error_js_1.SafeError(`Unsupported kind '${never.kind}'`);
                }
            }
        };
        walk(value);
    }
    valueFromValues(variableValues) {
        const convert = (inputValue) => {
            switch (inputValue.kind) {
                case Kind.VARIABLE: {
                    const variableName = inputValue.name.value;
                    const variableIndex = this.variableNames.indexOf(variableName);
                    return variableValues[variableIndex];
                }
                case Kind.INT: {
                    return parseInt(inputValue.value, 10);
                }
                case Kind.FLOAT: {
                    return parseFloat(inputValue.value);
                }
                case Kind.STRING: {
                    return inputValue.value;
                }
                case Kind.BOOLEAN: {
                    return inputValue.value;
                }
                case Kind.NULL: {
                    return null;
                }
                case Kind.LIST: {
                    return inputValue.values.map(convert);
                }
                case Kind.OBJECT: {
                    const obj = Object.create(null);
                    for (const field of inputValue.fields) {
                        obj[field.name.value] = convert(field.value);
                    }
                    return obj;
                }
                case Kind.ENUM: {
                    throw new error_js_1.SafeError("Enum values cannot be included within scalars");
                }
                default: {
                    const never = inputValue;
                    throw new error_js_1.SafeError(`Unsupported kind '${never.kind}'`);
                }
            }
        };
        return convert(this.value);
    }
    /** @internal */
    eval() {
        const variableValues = this.variableNames.map((variableName, i) => this.getDep(i, true).eval());
        return this.valueFromValues(variableValues);
    }
    /** @internal */
    evalIs(expectedValue) {
        if (expectedValue === undefined ||
            expectedValue === null ||
            expectedValue === 0) {
            return false;
        }
        else {
            throw new Error("__InputDynamicScalarStep doesn't support evalIs on non-null, non-undefined, non-0 values");
        }
    }
}
exports.__InputDynamicScalarStep = __InputDynamicScalarStep;
//# sourceMappingURL=__inputDynamicScalar.js.map