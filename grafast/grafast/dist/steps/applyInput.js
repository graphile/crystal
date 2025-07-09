"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Modifier = exports.ApplyInputStep = void 0;
exports.inputArgsApply = inputArgsApply;
exports.applyInput = applyInput;
exports.isModifier = isModifier;
exports.assertModifier = assertModifier;
exports.isApplyableStep = isApplyableStep;
const graphql_1 = require("graphql");
const step_js_1 = require("../step.js");
const index_js_1 = require("./index.js");
let currentModifiers = [];
let applyingModifiers = false;
let inputArgsApplyDepth = 0;
class ApplyInputStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "ApplyInputStep",
    }; }
    constructor(inputType, $value, getTargetFromParent) {
        super();
        this.inputType = inputType;
        this.getTargetFromParent = getTargetFromParent;
        this.isSyncAndSafe = true;
        this.allowMultipleOptimizations = true;
        this.valueDepId = this.addUnaryDependency($value);
        if (!this._isUnary) {
            throw new Error(`applyInput() must be unary`);
        }
        this._isUnaryLocked = true;
    }
    deduplicate(peers) {
        return peers.filter((p) => p.inputType === this.inputType &&
            p.getTargetFromParent === this.getTargetFromParent);
    }
    optimize() {
        const $value = this.getDep(this.valueDepId);
        if ($value instanceof index_js_1.ConstantStep) {
            // Replace myself with a constant!
            const { operationPlan: { schema }, inputType, getTargetFromParent, } = this;
            const { data } = $value;
            return (0, index_js_1.constant)(function applyInputConstant(parent) {
                inputArgsApply(schema, inputType, parent, data, getTargetFromParent);
            }, false);
        }
        return this;
    }
    unbatchedExecute(extra, value) {
        const { getTargetFromParent } = this;
        return (parentThing) => inputArgsApply(this.operationPlan.schema, this.inputType, parentThing, value, getTargetFromParent);
    }
}
exports.ApplyInputStep = ApplyInputStep;
function inputArgsApply(schema, inputType, parent, inputValue, getTargetFromParent) {
    try {
        inputArgsApplyDepth++;
        const target = getTargetFromParent
            ? getTargetFromParent(parent, inputValue)
            : parent;
        if (target != null) {
            _inputArgsApply(schema, inputType, target, inputValue);
        }
    }
    finally {
        inputArgsApplyDepth--;
    }
    let l;
    if (inputArgsApplyDepth === 0 && (l = currentModifiers.length) > 0) {
        applyingModifiers = true;
        try {
            for (let i = l - 1; i >= 0; i--) {
                currentModifiers[i].apply();
            }
        }
        finally {
            applyingModifiers = false;
            currentModifiers = [];
        }
    }
}
function applyInput(inputType, $value, getTargetFromParent) {
    const opPlan = (0, index_js_1.operationPlan)();
    const { schema } = opPlan;
    return opPlan.withRootLayerPlan(() => {
        if ($value instanceof index_js_1.ConstantStep) {
            // Replace us with a constant
            const { data } = $value;
            return (0, index_js_1.constant)(function applyInputConstant(parent) {
                inputArgsApply(schema, inputType, parent, data, getTargetFromParent);
            }, false);
        }
        else {
            return new ApplyInputStep(inputType, $value, getTargetFromParent);
        }
    });
}
/*
const defaultInputObjectTypeInputPlanResolver: InputObjectTypeInputPlanResolver =
  (input, info) => {
    const fields = info.type.getFields();
    const obj: { [key: string]: ExecutableStep } = Object.create(null);
    for (const fieldName in fields) {
      obj[fieldName] = input.get(fieldName);
    }
    return object(obj);
  };
*/
function _inputArgsApply(schema, inputType, target, inputValue) {
    // PERF: we should have the plan generate a digest of `inputType` so that we
    // can jump right to the relevant parts without too much traversal cost.
    if (inputValue === undefined) {
        return;
    }
    if ((0, graphql_1.isNonNullType)(inputType)) {
        if (inputValue === null) {
            throw new Error(`null value found in non-null position`);
        }
        _inputArgsApply(schema, inputType.ofType, target, inputValue);
    }
    else if ((0, graphql_1.isListType)(inputType)) {
        if (inputValue == null)
            return;
        if (!Array.isArray(inputValue)) {
            throw new Error(`Expected list in list position`);
        }
        for (const item of inputValue) {
            const itemTarget = typeof target === "function" ? target() : target;
            _inputArgsApply(schema, inputType.ofType, itemTarget, item);
        }
    }
    else if (typeof target === "function") {
        throw new Error("Functions may only be used as the target for list types (the function is called once per list item)");
    }
    else if ((0, graphql_1.isInputObjectType)(inputType)) {
        if (inputValue === null) {
            return;
        }
        const fields = inputType.getFields();
        for (const [fieldName, field] of Object.entries(fields)) {
            const val = inputValue[fieldName];
            if (val === undefined)
                continue;
            if (field.extensions.grafast?.apply) {
                const newTarget = field.extensions.grafast.apply(target, val, {
                    schema,
                    field,
                    fieldName,
                });
                if (newTarget != null) {
                    _inputArgsApply(schema, field.type, newTarget, val);
                }
            }
        }
    }
    else if ((0, graphql_1.isScalarType)(inputType)) {
        // if (inputType.extensions.grafast?.apply) {
        // }
    }
    else if ((0, graphql_1.isEnumType)(inputType)) {
        if (inputValue === null) {
            return;
        }
        const values = inputType.getValues();
        const value = values.find((v) => v.value === inputValue);
        if (value) {
            if (value.extensions.grafast?.apply) {
                value.extensions.grafast.apply(target);
            }
        }
        else {
            throw new Error(`Couldn't find value in ${inputType} for ${inputValue}`);
        }
    }
    else {
        const never = inputType;
        throw new Error(`Input type expected, but found ${never}`);
    }
}
/**
 * Modifiers modify their parent (which may be another modifier or anything
 * else). First they gather all the requirements from their children (if any)
 * being applied to them, then they apply themselves to their parent. This
 * application is done through the `apply()` method.
 */
class Modifier {
    constructor(parent) {
        this.parent = parent;
        if (applyingModifiers) {
            throw new Error(`Must not create new modifier whilst modifiers are being applied!`);
        }
        currentModifiers.push(this);
    }
}
exports.Modifier = Modifier;
function isModifier(plan) {
    return plan instanceof Modifier;
}
function assertModifier(plan, pathDescription) {
    if (!isModifier(plan)) {
        throw new Error(`The plan returned from '${pathDescription}' should be a modifier plan, but it does not implement the 'apply' method.`);
    }
}
function isApplyableStep(s) {
    return typeof s.apply === "function";
}
//# sourceMappingURL=applyInput.js.map