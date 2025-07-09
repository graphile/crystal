"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__InputListStep = void 0;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const assert = tslib_1.__importStar(require("../assert.js"));
const input_js_1 = require("../input.js");
const step_js_1 = require("../step.js");
const constant_js_1 = require("./constant.js");
const list_js_1 = require("./list.js");
const { GraphQLList, Kind } = graphql;
/**
 * Implements `__InputListStep`.
 */
class __InputListStep extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__InputListStep",
    }; }
    constructor(inputType, inputValues) {
        super();
        this.inputValues = inputValues;
        this.isSyncAndSafe = true;
        this.itemCount = 0;
        this.unbatchedExecute = () => {
            throw new Error("__InputListStep should never execute; it should have been optimized away.");
        };
        assert.ok(inputType instanceof GraphQLList, "Expected inputType to be a List");
        const innerType = inputType.ofType;
        const values = inputValues === undefined
            ? undefined
            : inputValues.kind === Kind.LIST
                ? inputValues.values
                : inputValues.kind === Kind.NULL
                    ? undefined // Really it's `null` but we don't care here
                    : // Coerce to list
                        [inputValues];
        if (values !== undefined) {
            for (let inputValueIndex = 0, inputValuesLength = values.length; inputValueIndex < inputValuesLength; inputValueIndex++) {
                const inputValue = values[inputValueIndex];
                const innerPlan = (0, input_js_1.inputStep)(this.operationPlan, innerType, inputValue, undefined);
                this.addDependency(innerPlan);
                this.itemCount++;
            }
        }
    }
    optimize() {
        const { inputValues } = this;
        if (inputValues?.kind === "NullValue") {
            return (0, constant_js_1.constant)(null);
        }
        else {
            const arr = [];
            for (let idx = 0; idx < this.itemCount; idx++) {
                const itemPlan = this.getDep(idx);
                arr[idx] = itemPlan;
            }
            return (0, list_js_1.list)(arr);
        }
    }
    execute() {
        throw new Error("__InputListStep should never execute; it should have been optimized away.");
    }
    at(index) {
        const itemPlan = index < this.itemCount ? this.getDep(index) : (0, constant_js_1.constant)(undefined);
        (0, input_js_1.assertInputStep)(itemPlan);
        return itemPlan;
    }
    /** @internal */
    eval() {
        if (this.inputValues?.kind === "NullValue") {
            return null;
        }
        const list = [];
        for (let itemPlanIndex = 0; itemPlanIndex < this.itemCount; itemPlanIndex++) {
            const itemPlan = this.getDep(itemPlanIndex);
            (0, input_js_1.assertInputStep)(itemPlan);
            const value = itemPlan.eval();
            list[itemPlanIndex] = value;
        }
        return list;
    }
    /** @internal */
    evalIs(value) {
        if (value === undefined) {
            return this.inputValues === value;
        }
        else if (value === null) {
            return this.inputValues?.kind === "NullValue";
        }
        else {
            throw new Error("__InputListStep cannot evalIs values other than null and undefined currently");
        }
    }
    /** @internal */
    evalLength() {
        if (this.inputValues === undefined) {
            return null;
        }
        else if (this.inputValues.kind === Kind.NULL) {
            return null;
        }
        else if (this.inputValues.kind === Kind.LIST) {
            return this.inputValues.values.length;
        }
        else {
            // Coercion to list
            return 1;
        }
    }
}
exports.__InputListStep = __InputListStep;
//# sourceMappingURL=__inputList.js.map