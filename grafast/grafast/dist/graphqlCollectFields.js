"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalDirectiveArg = evalDirectiveArg;
exports.evalDirectiveArgDirect = evalDirectiveArgDirect;
exports.newSelectionSetDigest = newSelectionSetDigest;
exports.graphqlCollectFields = graphqlCollectFields;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const error_js_1 = require("./error.js");
const { GraphQLError, GraphQLInterfaceType, GraphQLObjectType, GraphQLUnionType, } = graphql;
/**
 * Given a selection, finds the first directive named `directiveName`.
 *
 * @internal
 *
 * PERF: inline.
 */
function getDirective(selection, directiveName) {
    return selection.directives?.find((d) => d.name.value === directiveName);
}
/**
 * Given a selection, finds the first directive named `directiveName` and, if
 * found, extracts and returns the value from the argument named
 * `argumentName`, tracking variable access if necessary.
 *
 * @remarks Currently only supports booleans.
 *
 * @internal
 *
 * PERF: inline.
 */
function evalDirectiveArg(selection, directiveName, argumentName, variableValuesStep, defaultValue) {
    const directive = getDirective(selection, directiveName);
    if (!directive)
        return undefined;
    return evalDirectiveArgDirect(directive, argumentName, variableValuesStep, defaultValue);
}
function evalDirectiveArgDirect(directive, argumentName, variableValuesStep, defaultValue) {
    if (!directive.arguments)
        return defaultValue;
    const argument = directive.arguments.find((a) => a.name.value === argumentName);
    if (argument !== undefined) {
        const value = argument.value;
        switch (value.kind) {
            case "Variable": {
                return variableValuesStep.get(value.name.value).eval();
            }
            case "BooleanValue": {
                return value.value;
            }
            case "IntValue": {
                return parseInt(value.value, 10);
            }
            case "FloatValue": {
                return parseFloat(value.value);
            }
            case "StringValue": {
                return value.value;
            }
            case "NullValue": {
                return null;
            }
            default: {
                throw new error_js_1.SafeError(`Unsupported @${directive.name}(${argumentName}:) argument; expected Variable, Boolean or null; but received '${value.kind}'`);
            }
        }
    }
    else {
        return defaultValue;
    }
}
/**
 * Implements the `DoesFragmentTypeApply` algorithm from the GraphQL
 * specification.
 *
 * @see https://spec.graphql.org/draft/#DoesFragmentTypeApply()
 *
 * @internal
 */
function graphqlDoesFragmentTypeApply(objectType, fragmentType) {
    if (fragmentType instanceof GraphQLObjectType) {
        return objectType === fragmentType;
    }
    else if (fragmentType instanceof GraphQLInterfaceType) {
        const interfaces = objectType.getInterfaces();
        return interfaces.includes(fragmentType);
    }
    else if (fragmentType instanceof GraphQLUnionType) {
        const types = fragmentType.getTypes();
        return types.includes(objectType);
    }
    else {
        throw new Error("Invalid call to graphqlDoesFragmentTypeApply");
    }
}
const processFragment = (operationPlan, parentStepId, objectType, isMutation, selectionSetDigest, selection, fragmentSelectionSet, visitedFragments) => {
    const trackedVariableValuesStep = operationPlan.trackedVariableValuesStep;
    const defer = selection.directives?.find((d) => d.name.value === "defer");
    const deferIf = defer
        ? (evalDirectiveArgDirect(defer, "if", trackedVariableValuesStep, true) ?? true)
        : undefined;
    const label = defer
        ? (evalDirectiveArgDirect(defer, "label", trackedVariableValuesStep, null) ?? undefined)
        : undefined;
    const deferredDigest = deferIf === true
        ? {
            label,
            fields: new Map(),
            deferred: undefined,
            resolverEmulation: selectionSetDigest.resolverEmulation,
        }
        : null;
    if (deferredDigest !== null) {
        if (selectionSetDigest.deferred === undefined) {
            selectionSetDigest.deferred = [deferredDigest];
        }
        else {
            selectionSetDigest.deferred.push(deferredDigest);
        }
    }
    graphqlCollectFields(operationPlan, parentStepId, objectType, fragmentSelectionSet.selections, deferredDigest ?? selectionSetDigest, isMutation, visitedFragments);
};
function newSelectionSetDigest(resolverEmulation) {
    return {
        label: undefined,
        fields: new Map(),
        deferred: undefined,
        resolverEmulation,
    };
}
/**
 * Implements the `GraphQLCollectFields` algorithm - like `CollectFields` the
 * GraphQL spec, but modified such that access to variables is tracked.
 *
 * @see https://spec.graphql.org/draft/#CollectFields()
 *
 * @internal
 */
function graphqlCollectFields(operationPlan, parentStepId, objectType, selections, selectionSetDigest, isMutation = false, 
// This is significantly faster than an array or a Set
visitedFragments = Object.create(null)) {
    // const objectTypeFields = objectType.getFields();
    const trackedVariableValuesStep = operationPlan.trackedVariableValuesStep;
    for (let i = 0, l = selections.length; i < l; i++) {
        const selection = selections[i];
        if (selection.directives !== undefined) {
            if (evalDirectiveArg(selection, "skip", "if", trackedVariableValuesStep, true) === true) {
                continue;
            }
            if (evalDirectiveArg(selection, "include", "if", trackedVariableValuesStep, true) === false) {
                continue;
            }
        }
        switch (selection.kind) {
            case "Field": {
                const field = selection;
                const responseKey = field.alias ? field.alias.value : field.name.value;
                let groupForResponseKey = selectionSetDigest.fields.get(responseKey);
                if (groupForResponseKey === undefined) {
                    groupForResponseKey = [field];
                    selectionSetDigest.fields.set(responseKey, groupForResponseKey);
                }
                else {
                    groupForResponseKey.push(field);
                }
                break;
            }
            case "FragmentSpread": {
                const fragmentSpreadName = selection.name.value;
                if (visitedFragments[fragmentSpreadName]) {
                    continue;
                }
                const fragment = operationPlan.fragments[fragmentSpreadName];
                // This is forbidden by validation
                if (fragment == null)
                    continue;
                const fragmentTypeName = fragment.typeCondition.name.value;
                if (fragmentTypeName === objectType.name) {
                    // No further checks needed
                }
                else {
                    const fragmentType = operationPlan.schema.getType(fragmentTypeName);
                    // This is forbidden by validation
                    if (!fragmentType)
                        continue;
                    if (fragmentType.constructor === GraphQLObjectType ||
                        /* According to validation, this must be the case */
                        // !(isInterfaceType(fragmentType) || isUnionType(fragmentType)) ||
                        !graphqlDoesFragmentTypeApply(objectType, fragmentType)) {
                        continue;
                    }
                }
                const fragmentSelectionSet = fragment.selectionSet;
                const newVisitedFragments = Object.assign(Object.create(null), visitedFragments);
                newVisitedFragments[fragmentSpreadName] = true;
                processFragment(operationPlan, parentStepId, objectType, isMutation, selectionSetDigest, selection, fragmentSelectionSet, newVisitedFragments);
                break;
            }
            case "InlineFragment": {
                const fragmentTypeAst = selection.typeCondition;
                if (fragmentTypeAst != null) {
                    const fragmentTypeName = fragmentTypeAst.name.value;
                    if (fragmentTypeName === objectType.name) {
                        // No further checks required
                    }
                    else {
                        const fragmentType = operationPlan.schema.getType(fragmentTypeName);
                        // This is forbidden by validation
                        if (fragmentType == null) {
                            throw new GraphQLError(`We don't have a type named '${fragmentTypeName}'`);
                        }
                        if (fragmentType.constructor === GraphQLObjectType ||
                            /* According to validation, this must be the case */
                            // !(isInterfaceType(fragmentType) || isUnionType(fragmentType)) ||
                            !graphqlDoesFragmentTypeApply(objectType, fragmentType)) {
                            continue;
                        }
                    }
                }
                const fragmentSelectionSet = selection.selectionSet;
                processFragment(operationPlan, parentStepId, objectType, isMutation, selectionSetDigest, selection, fragmentSelectionSet, visitedFragments);
                break;
            }
        }
    }
    return selectionSetDigest;
}
//# sourceMappingURL=graphqlCollectFields.js.map