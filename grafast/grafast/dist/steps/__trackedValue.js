"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__TrackedValueStep = void 0;
const graphql_1 = require("graphql");
const index_js_1 = require("../index.js");
const step_js_1 = require("../step.js");
/**
 * Implements the `__TrackedValueStep(operationPlan, object, constraints, path)`
 * algorithm used to allow runtime AND plan-time access to the three special
 * entities: `variableValues`, `rootValue` and `context`.
 *
 * ExecutableStep-time access can evaluate the `object` passed to the constructor, and
 * will add constraints to the relevant operationPlan.variableValuesConstraints,
 * operationPlan.rootValueConstraints or operationPlan.contextConstraints to
 * ensure that all future variableValues, rootValues and context will match the
 * assumptions made.
 *
 * Run-time access will see the runtime values of these properties, it will
 * **NOT** reference the `object` passed to the constructor.
 *
 * In core this will be used for evaluating `@skip`, `@include`, `@defer` and
 * `@stream` directives so that a different OpPlan will be used if these would
 * change the query plan, but it can also be used within plan resolvers to
 * branch the logic of a plan based on something in these entities.
 */
class __TrackedValueStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "__TrackedValueStep",
    }; }
    static withGraphQLType(value, valuePlan, constraints, path = [], graphqlType) {
        return (0, index_js_1.operationPlan)().withRootLayerPlan(() => new __TrackedValueStep(value, valuePlan, constraints, path, true, graphqlType));
    }
    /**
     * @internal
     */
    constructor(value, valuePlan, constraints, path = [], isImmutable, graphqlTypeOrVariableDefinitions) {
        super();
        this.isSyncAndSafe = true;
        this._isImmutable = isImmutable;
        this.addDependency(valuePlan);
        this.value = value;
        this.constraints = constraints;
        this.path = path;
        this.nullableGraphQLType =
            graphqlTypeOrVariableDefinitions &&
                !isArray(graphqlTypeOrVariableDefinitions)
                ? (0, graphql_1.getNullableType)(graphqlTypeOrVariableDefinitions)
                : undefined;
        this.variableDefinitions =
            graphqlTypeOrVariableDefinitions &&
                isArray(graphqlTypeOrVariableDefinitions)
                ? graphqlTypeOrVariableDefinitions
                : undefined;
        if ((0, graphql_1.isInputObjectType)(this.nullableGraphQLType)) {
            const fields = this.nullableGraphQLType.getFields();
            for (const fieldName of Object.keys(fields)) {
                let step;
                Object.defineProperty(this, `$${fieldName}`, {
                    get: () => {
                        if (!step) {
                            step = this.get(fieldName);
                        }
                        return step;
                    },
                });
            }
        }
        else if (this.variableDefinitions) {
            for (const def of this.variableDefinitions) {
                const varName = def.variable.name.value;
                let step;
                Object.defineProperty(this, `$${varName}`, {
                    get: () => {
                        if (!step) {
                            step = this.get(varName);
                        }
                        return step;
                    },
                });
            }
        }
    }
    execute({ count, values: [values0], }) {
        // We have only one dependency, return the value of that.
        return values0.isBatch
            ? values0.entries
            : (0, index_js_1.arrayOfLength)(count, values0.value);
    }
    unbatchedExecute(_extra, v) {
        return v;
    }
    getValuePlan() {
        return this.getDep(0, true);
    }
    /**
     * Get the named property of an object.
     */
    get(attrName) {
        const { value, path, constraints } = this;
        const newValue = value?.[attrName];
        const newValuePlan = this.getValuePlan().get(attrName);
        const newPath = [...path, attrName];
        if (this.nullableGraphQLType) {
            if ((0, graphql_1.isInputObjectType)(this.nullableGraphQLType)) {
                const fields = this.nullableGraphQLType.getFields();
                const field = fields[attrName];
                if (!field) {
                    throw new Error(`'${this.nullableGraphQLType}' has no attribute '${attrName}'`);
                }
                return __TrackedValueStep.withGraphQLType(newValue, newValuePlan, constraints, newPath, field.type);
            }
            else {
                throw new Error(`Cannot get field '${attrName}' on non-input-object type '${this.nullableGraphQLType}'`);
            }
        }
        else if (this.variableDefinitions) {
            const def = this.variableDefinitions.find((d) => d.variable.name.value === attrName);
            if (!def) {
                throw new Error(`No variable named '$${attrName}' exists in this operation`);
            }
            const getType = (t) => {
                if (t.kind === graphql_1.Kind.NON_NULL_TYPE) {
                    return new graphql_1.GraphQLNonNull(getType(t.type));
                }
                else if (t.kind === graphql_1.Kind.LIST_TYPE) {
                    return new graphql_1.GraphQLList(getType(t.type));
                }
                else {
                    const name = t.name.value;
                    return this.operationPlan.schema.getType(name);
                }
            };
            const type = getType(def.type);
            return __TrackedValueStep.withGraphQLType(newValue, newValuePlan, constraints, newPath, type);
        }
        else if (this._isImmutable) {
            return this.operationPlan.withRootLayerPlan(() => new __TrackedValueStep(newValue, newValuePlan, constraints, newPath, this._isImmutable));
        }
        else {
            return new __TrackedValueStep(newValue, newValuePlan, constraints, newPath, this._isImmutable);
        }
    }
    /**
     * Get the entry at the given index in an array.
     */
    at(index) {
        const { value, path, constraints } = this;
        const newValue = value?.[index];
        const newValuePlan = this.getValuePlan().at(index);
        const newPath = [...path, index];
        if (this.nullableGraphQLType) {
            if ((0, graphql_1.isListType)(this.nullableGraphQLType)) {
                return __TrackedValueStep.withGraphQLType(newValue, newValuePlan, constraints, newPath, this.nullableGraphQLType.ofType);
            }
            else {
                throw new Error(`'${this.nullableGraphQLType}' is not a list type, cannot access array index '${index}' on it`);
            }
        }
        else if (this._isImmutable) {
            return this.operationPlan.withRootLayerPlan(() => new __TrackedValueStep(newValue, newValuePlan, constraints, newPath, this._isImmutable));
        }
        else {
            return new __TrackedValueStep(newValue, newValuePlan, constraints, newPath, this._isImmutable);
        }
    }
    /**
     * Evaluates the current value, and adds a constraint to the OpPlan to ensure
     * that all future evaluations of this property will always return the same
     * value.
     *
     * **WARNING**: avoid using this where possible, it causes OpPlans to split.
     *
     * **WARNING**: this is the most expensive eval, if you need to eval, prefer evalIs, evalHas, etc instead.
     *
     * @internal
     */
    eval() {
        const { path, value } = this;
        this.constraints.push({
            type: "value",
            path,
            value,
        });
        return value;
    }
    /**
     * Evaluates if the current value is equal to this specific value, and adds a
     * constraint to the OpPlan to ensure that all future evaluations of this
     * check will always return the same (boolean) result.
     *
     * Should only be used on scalars.
     *
     * **WARNING**: avoid using this where possible, it causes OpPlans to split.
     *
     * @internal
     */
    evalIs(expectedValue) {
        const { value, path } = this;
        const pass = value === expectedValue;
        this.constraints.push({
            type: "equal",
            path,
            expectedValue,
            pass,
        });
        return pass;
    }
    /** @internal */
    evalIsEmpty() {
        const { value, path } = this;
        const isEmpty = typeof value === "object" &&
            value !== null &&
            Object.keys(value).length === 0;
        this.constraints.push({
            type: "isEmpty",
            path,
            isEmpty,
        });
        return isEmpty;
    }
    /**
     * Evaluates if the current value is an object with the given key, and adds a
     * constraint to the OpPlan to ensure that all future evaluations of this
     * check will always return the same (boolean) result.
     *
     * **WARNING**: avoid using this where possible, it causes OpPlans to split.
     *
     * @internal
     */
    evalHas(key) {
        const { value, path } = this;
        const newPath = [...path, key];
        // NOTE: `key in value` would be more performant here, but we cannot trust
        // users not to pass `{foo: undefined}` so we must do the more expensive
        // `value[key] !== undefined` check.
        const exists = (typeof value === "object" &&
            value &&
            value[key] !== undefined) ||
            false;
        this.constraints.push({
            type: "exists",
            path: newPath,
            exists,
        });
        return exists;
    }
    /**
     * Evaluates the keys of the current value, and adds a
     * constraint to the OpPlan to ensure that all future evaluations of this
     * check will always return the same result.
     *
     * **WARNING**: avoid using this where possible, it causes OpPlans to split.
     *
     * @internal
     */
    evalKeys() {
        const { value, path } = this;
        if (!(0, graphql_1.isInputObjectType)(this.nullableGraphQLType)) {
            throw new Error("evalKeys must only be called for object types");
        }
        if (value == null) {
            this.constraints.push({
                type: "keys",
                path,
                keys: null,
            });
            return null;
        }
        const keys = [];
        const keysOfType = Object.keys(this.nullableGraphQLType.getFields());
        // NOTE: it's important that we loop through the fields in their defined
        // order, this ensures the `keys` array always has consistent ordering.
        for (let i = 0; i < keysOfType.length; i++) {
            const key = keysOfType[i];
            // NOTE: `key in value` would be more performant here, but we cannot trust
            // users not to pass `{foo: undefined}` so we must do the more expensive
            // `value[key] !== undefined` check.
            if (value[key] !== undefined) {
                keys.push(key);
            }
        }
        this.constraints.push({
            type: "keys",
            path,
            keys,
        });
        return keys;
    }
    /**
     * Evaluates the length of the current value (assumed to be an array), and
     * adds a constraint to the OpPlan to ensure that all future values will have
     * the same length.
     *
     * **WARNING**: avoid using this where possible, it causes OpPlans to split.
     *
     * @internal
     */
    evalLength() {
        const { value, path } = this;
        const length = Array.isArray(value) ? value.length : null;
        this.constraints.push({
            type: "length",
            path,
            expectedLength: length,
        });
        return length;
    }
    // At runtime, __TrackedValueStep doesn't need to exist
    optimize() {
        return this.getDep(0);
    }
}
exports.__TrackedValueStep = __TrackedValueStep;
function isArray(t) {
    return Array.isArray(t);
}
//# sourceMappingURL=__trackedValue.js.map