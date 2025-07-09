"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__InputObjectStep = void 0;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
const input_js_1 = require("../input.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const constant_js_1 = require("./constant.js");
const { Kind } = graphql;
/**
 * Implements `InputObjectStep`
 */
class __InputObjectStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__InputObjectStep",
    }; }
    constructor(inputObjectType, inputValues) {
        super();
        this.inputObjectType = inputObjectType;
        this.inputValues = inputValues;
        this.isSyncAndSafe = true;
        this.inputFields = Object.create(null);
        const inputFieldDefinitions = inputObjectType.getFields();
        const inputFields = inputValues?.kind === "ObjectValue" ? inputValues.fields : undefined;
        for (const inputFieldName in inputFieldDefinitions) {
            const inputFieldDefinition = inputFieldDefinitions[inputFieldName];
            const inputFieldType = inputFieldDefinition.type;
            const defaultValue = inputFieldDefinition.defaultValue !== undefined
                ? (0, utils_js_1.defaultValueToValueNode)(inputFieldType, inputFieldDefinition.defaultValue)
                : undefined;
            const inputFieldValue = inputFields?.find((val) => val.name.value === inputFieldName);
            const step = (0, input_js_1.inputStep)(this.operationPlan, inputFieldType, inputFieldValue?.value, defaultValue);
            this.inputFields[inputFieldName] = {
                step,
                dependencyIndex: this.addDependency(step),
            };
            Object.defineProperty(this, `$${inputFieldName}`, {
                value: step,
            });
        }
    }
    optimize() {
        if (this.inputValues?.kind === "NullValue") {
            return (0, constant_js_1.constant)(null);
        }
        return this;
    }
    finalize() {
        tamedevil_1.default.runInBatch((0, tamedevil_1.default) `(function (extra, ${tamedevil_1.default.join(this.dependencies.map((_, dependencyIndex) => tamedevil_1.default.identifier(`val${dependencyIndex}`)), ", ")}) {
  const resultValues = Object.create(null);
  ${tamedevil_1.default.join(Object.entries(this.inputFields).map(([inputFieldName, { dependencyIndex }]) => {
            if (dependencyIndex == null) {
                throw new Error("inputFieldPlan has gone missing.");
            }
            const teVal = tamedevil_1.default.identifier(`val${dependencyIndex}`);
            return (0, tamedevil_1.default) `\
  if (${teVal} !== undefined) {
    resultValues${tamedevil_1.default.set(inputFieldName, true)} = ${teVal};
  }`;
        }), "\n")}
  return resultValues;
})`, (fn) => {
            this.unbatchedExecute = fn;
        });
        super.finalize();
    }
    unbatchedExecute(_extra, ...values) {
        const resultValues = Object.create(null);
        for (const inputFieldName in this.inputFields) {
            const dependencyIndex = this.inputFields[inputFieldName].dependencyIndex;
            if (dependencyIndex == null) {
                throw new Error("inputFieldPlan has gone missing.");
            }
            const value = values[dependencyIndex];
            if (value !== undefined) {
                resultValues[inputFieldName] = value;
            }
        }
        return resultValues;
    }
    get(attrName) {
        const step = this.inputFields[attrName]?.step;
        if (step === undefined) {
            throw new Error(`Tried to '.get("${attrName}")', but no such attribute exists on ${this.inputObjectType.name}`);
        }
        return step;
    }
    /** @internal */
    eval() {
        if (this.inputValues?.kind === "NullValue") {
            return null;
        }
        const resultValues = Object.create(null);
        for (const inputFieldName in this.inputFields) {
            const inputFieldPlan = this.inputFields[inputFieldName].step;
            resultValues[inputFieldName] = inputFieldPlan.eval();
        }
        return resultValues;
    }
    /** @internal */
    evalIs(value) {
        if (value === undefined) {
            return this.inputValues === value;
        }
        else if (value === null) {
            return this.inputValues?.kind === "NullValue";
        }
        else if (value === 0) {
            return (this.inputValues?.kind === "IntValue" && this.inputValues.value === "0");
        }
        else {
            throw new Error("__InputObjectStep cannot evalIs values other than null and undefined currently");
        }
    }
    /** @internal */
    evalIsEmpty() {
        return (this.inputValues?.kind === "ObjectValue" &&
            this.inputValues.fields.length === 0);
    }
    // Written without consulting spec.
    /** @internal */
    evalHas(attrName) {
        if (!this.inputValues) {
            return false;
        }
        if (this.inputValues.kind === "NullValue") {
            return false;
        }
        if (!(attrName in this.inputFields)) {
            return false;
        }
        return !this.inputFields[attrName].step.evalIs(undefined);
    }
    /** @internal */
    evalKeys() {
        if (this.inputValues === undefined) {
            return null;
        }
        else if (this.inputValues.kind === Kind.NULL) {
            return null;
        }
        else if (this.inputValues.kind !== Kind.OBJECT) {
            throw new Error("evalKeys must only be called for object types");
        }
        const keys = [];
        const inputFieldKeys = Object.keys(this.inputFields);
        for (let i = 0; i < inputFieldKeys.length; i++) {
            const key = inputFieldKeys[i];
            const inputFieldPlan = this.inputFields[key].step;
            // This evalIs() is required. With __inputObject we know that it's an
            // explicit input object (not variable) in the GraphQL document, but the
            // values of each key may still be undefined if they're a variable that
            // isn't supplied and has no default. In these cases we do not wish to
            // return these keys (since the input object is not seen as having those
            // keys set), but that will differ on an operation-to-operation basis,
            // and thus we must evaluate whether or not they are undefined. Note that
            // this implicitly adds constraints for these values; we do not need to
            // explicitly add any constraint for the object itself because the
            // document itself guarantees it will always be present.
            //
            // PERF: We should not need to .evalIs(undefined) for any input field
            // that is declared as non-nullable, I think?
            if (!inputFieldPlan.evalIs(undefined)) {
                keys.push(key);
            }
        }
        return keys;
    }
}
exports.__InputObjectStep = __InputObjectStep;
//# sourceMappingURL=__inputObject.js.map