"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fieldSelectionsForType = fieldSelectionsForType;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const inspect_js_1 = require("./inspect.js");
const { Kind } = graphql;
// PERF: this is incredibly inefficient
function typeMatchesCondition(operationPlan, type, condition) {
    const name = condition.name.value;
    if (type.name === name) {
        return true;
    }
    if (type.getInterfaces().some((i) => i.name === name)) {
        return true;
    }
    if (operationPlan.unionsContainingObjectType[type.name].some((u) => u.name === name)) {
        return true;
    }
    return false;
}
/**
 * Given a list of polymorphic selections, return a list of the nested field
 * selections that apply to the object type `type`.
 */
function fieldSelectionsForType(operationPlan, type, selections, result = []) {
    for (let i = 0, l = selections.length; i < l; i++) {
        const selection = selections[i];
        switch (selection.kind) {
            case Kind.FRAGMENT_SPREAD: {
                // Assumed to exist because query passed validation.
                const fragment = operationPlan.fragments[selection.name.value];
                const typeCondition = fragment.typeCondition;
                if (typeMatchesCondition(operationPlan, type, typeCondition)) {
                    fieldSelectionsForType(operationPlan, type, fragment.selectionSet.selections, result);
                }
                break;
            }
            case Kind.INLINE_FRAGMENT: {
                const typeCondition = selection.typeCondition;
                if (!typeCondition ||
                    typeMatchesCondition(operationPlan, type, typeCondition)) {
                    fieldSelectionsForType(operationPlan, type, selection.selectionSet.selections, result);
                }
                break;
            }
            case Kind.FIELD: {
                result.push(selection);
                break;
            }
            default: {
                const never = selection;
                throw new Error(`GrafastInternalError<10b01e35-cf2b-4f48-9c66-486cdef00323>: cannot process selection '${(0, inspect_js_1.inspect)(never)}'`);
            }
        }
    }
    return result;
}
//# sourceMappingURL=graphqlMergeSelectionSets.js.map