"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertInputStep = assertInputStep;
exports.graphqlGetTypeForNode = graphqlGetTypeForNode;
exports.inputStep = inputStep;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const inspect_js_1 = require("./inspect.js");
const __inputDefault_js_1 = require("./steps/__inputDefault.js");
const __inputDynamicScalar_js_1 = require("./steps/__inputDynamicScalar.js");
const __inputObject_js_1 = require("./steps/__inputObject.js");
const index_js_1 = require("./steps/index.js");
const utils_js_1 = require("./utils.js");
const { assertScalarType, GraphQLError, GraphQLList, GraphQLNonNull, isInputType, isLeafType, isInputObjectType, Kind, } = graphql;
function assertInputStep(itemPlan) {
    if (itemPlan instanceof index_js_1.__TrackedValueStep)
        return;
    if (itemPlan instanceof index_js_1.__InputListStep)
        return;
    if (itemPlan instanceof index_js_1.__InputStaticLeafStep)
        return;
    if (itemPlan instanceof __inputObject_js_1.__InputObjectStep)
        return;
    throw new Error(`Expected an InputStep, but found ${itemPlan}`);
}
function graphqlGetTypeForNode(operationPlan, node) {
    switch (node.kind) {
        case Kind.NAMED_TYPE: {
            const type = operationPlan.schema.getType(node.name.value);
            if (!type) {
                // Should not happen since the GraphQL operation has already been
                // validated against the schema.
                throw new Error(`Could not find type with name '${node.name.value}' in the schema`);
            }
            return type;
        }
        case Kind.LIST_TYPE:
            return new GraphQLList(graphqlGetTypeForNode(operationPlan, node.type));
        case Kind.NON_NULL_TYPE:
            return new GraphQLNonNull(graphqlGetTypeForNode(operationPlan, node.type));
        default: {
            const never = node;
            throw new Error(`Unknown node kind; node: ${(0, inspect_js_1.inspect)(never)}`);
        }
    }
}
/**
 * Returns a plan for the given `rawInputValue` AST node which could be a
 * variable or a literal, and could be nested so that a variable (or more than
 * one) appears somewhere. More than one plan may be created.
 *
 * @internal
 */
function inputStep(operationPlan, inputType, inputValue, defaultValue = undefined) {
    const { valueNodeToStaticValueCache } = operationPlan;
    if (inputValue === undefined) {
        // Definitely can't be or contain a variable!
        if (defaultValue === undefined) {
            return (0, index_js_1.constant)(undefined);
        }
        else {
            return valueNodeToCachedStaticValueConstantStep(valueNodeToStaticValueCache, defaultValue, inputType);
        }
    }
    const isObj = isInputObjectType(inputType);
    if (inputValue.kind === "Variable") {
        // Note: this is the only other place where `defaultValue` might be used
        // we know `inputValue` is not a variable.
        const variableName = inputValue.name.value;
        const variableDefinition = operationPlan.operation.variableDefinitions?.find((def) => def.variable.name.value === variableName);
        if (!variableDefinition) {
            // Should not happen since the GraphQL operation has already been
            // validated.
            throw new Error(`No definition for variable '${variableName}' found`);
        }
        const variableType = graphqlGetTypeForNode(operationPlan, variableDefinition.type);
        if (!isInputType(variableType)) {
            throw new Error(`Expected varible type to be an input type`);
        }
        const variableWillDefinitelyBeSet = variableType instanceof GraphQLNonNull ||
            variableDefinition.defaultValue != null;
        return inputVariablePlan(operationPlan, variableName, variableType, inputType, defaultValue, variableWillDefinitelyBeSet);
    }
    else if (inputType instanceof GraphQLNonNull) {
        const innerType = inputType.ofType;
        if (inputValue.kind === Kind.NULL) {
            throw new Error(`Null found in non-null position; this should have been prevented by validation.`);
        }
        const valuePlan = inputStep(operationPlan, innerType, inputValue, undefined);
        return inputNonNullPlan(operationPlan, valuePlan);
    }
    else if (inputValue.kind === Kind.NULL) {
        return (0, index_js_1.constant)(null);
    }
    else if (inputType instanceof GraphQLList) {
        const variableNames = new Set();
        (0, utils_js_1.findVariableNamesUsedInValueNode)(inputValue, variableNames);
        if (variableNames.size === 0) {
            return valueNodeToCachedStaticValueConstantStep(valueNodeToStaticValueCache, inputValue, inputType);
        }
        return new index_js_1.__InputListStep(inputType, inputValue);
    }
    else if (isLeafType(inputType)) {
        if (inputValue?.kind === Kind.OBJECT || inputValue?.kind === Kind.LIST) {
            const scalarType = assertScalarType(inputType);
            return new __inputDynamicScalar_js_1.__InputDynamicScalarStep(scalarType, inputValue);
        }
        else {
            // Variable is already ruled out, so it must be one of: Kind.INT | Kind.FLOAT | Kind.STRING | Kind.BOOLEAN | Kind.NULL | Kind.ENUM
            // none of which can contain a variable:
            return new index_js_1.__InputStaticLeafStep(inputType, inputValue);
        }
    }
    else if (isObj) {
        return new __inputObject_js_1.__InputObjectStep(inputType, inputValue);
    }
    else {
        const never = inputType;
        throw new Error(`Unsupported type in inputPlan: '${(0, inspect_js_1.inspect)(never)}'`);
    }
}
function doTypesMatch(variableType, expectedType) {
    if (variableType instanceof GraphQLNonNull &&
        expectedType instanceof GraphQLNonNull) {
        return doTypesMatch(variableType.ofType, expectedType.ofType);
    }
    else if (variableType instanceof GraphQLNonNull) {
        // Variable is stricter than input type, that's fine
        return doTypesMatch(variableType.ofType, expectedType);
    }
    else if (variableType instanceof GraphQLList &&
        expectedType instanceof GraphQLList) {
        return doTypesMatch(variableType.ofType, expectedType.ofType);
    }
    else {
        return variableType === expectedType;
    }
}
/**
 * Returns a step representing a variable's value.
 *
 * @param operationPlan -
 * @param variableName -
 * @param variableType -
 * @param inputType -
 * @param defaultValue -
 * @param variableWillDefinitelyBeSet - If `true` the variable is either
 * non-null _or_ it has a default value (including null). In this case, the
 * variable will never be `undefined` and thus an input position's defaultValue
 * will never be invoked where it is used.
 */
function inputVariablePlan(operationPlan, variableName, variableType, inputType, defaultValue, variableWillDefinitelyBeSet) {
    if (variableType instanceof GraphQLNonNull &&
        !(inputType instanceof GraphQLNonNull)) {
        const unwrappedVariableType = variableType.ofType;
        return inputVariablePlan(operationPlan, variableName, unwrappedVariableType, inputType, defaultValue, variableWillDefinitelyBeSet);
    }
    const typesMatch = doTypesMatch(variableType, inputType);
    if (!typesMatch) {
        // REF: https://spec.graphql.org/draft/#IsVariableUsageAllowed()
        if (inputType instanceof GraphQLNonNull &&
            !(variableType instanceof GraphQLNonNull)) {
            const variablePlan = inputVariablePlan(operationPlan, variableName, variableType, inputType.ofType, defaultValue, variableWillDefinitelyBeSet);
            // TODO: find a way to do this without doing eval. For example: track list of variables that may not be nullish.
            if (variablePlan.evalIs(null) ||
                (!variableWillDefinitelyBeSet && variablePlan.evalIs(undefined))) {
                throw new GraphQLError(`Expected non-null value of type ${inputType.ofType.toString()}`);
            }
            return variablePlan;
        }
        throw new Error("Expected variable and input types to match");
    }
    const $variableValue = operationPlan.trackedVariableValuesStep.get(variableName);
    if (defaultValue === undefined) {
        // There's no default value and thus the default will not be used; use the variable.
        return $variableValue;
    }
    else if (variableWillDefinitelyBeSet) {
        // The variable will DEFINITELY be set (even if it is set to null, possibly
        // by a default), so the input position's default value will never apply.
        return $variableValue;
    }
    else {
        // Here:
        // - the variable is nullable, optional, and has no default value
        // - the input position has a default value
        // We thus need a step that results in `variableValue === undefined ? defaultValue : variableValue`
        const runtimeDefaultValue = (0, utils_js_1.valueNodeToStaticValue)(defaultValue, inputType);
        return new __inputDefault_js_1.__InputDefaultStep($variableValue, runtimeDefaultValue);
    }
}
/**
 * Implements `InputNonNullStep`.
 */
function inputNonNullPlan(_operationPlan, innerPlan) {
    return innerPlan;
}
function valueNodeToCachedStaticValueConstantStep(cache, valueNode, inputType) {
    let step = cache.get(valueNode);
    if (!step) {
        step = (0, index_js_1.constant)((0, utils_js_1.valueNodeToStaticValue)(valueNode, inputType), false);
        cache.set(valueNode, step);
    }
    return step;
}
//# sourceMappingURL=input.js.map