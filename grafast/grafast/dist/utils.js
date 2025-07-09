"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalJSONStringify = exports.valueNodeToStaticValue = exports.sharedNull = exports.ROOT_VALUE_OBJECT = void 0;
exports.assertNullPrototype = assertNullPrototype;
exports.defaultValueToValueNode = defaultValueToValueNode;
exports.isPromise = isPromise;
exports.isPromiseLike = isPromiseLike;
exports.isDeferred = isDeferred;
exports.arraysMatch = arraysMatch;
exports.objectSpec = objectSpec;
exports.newObjectTypeBuilder = newObjectTypeBuilder;
exports.objectFieldSpec = objectFieldSpec;
exports.newGrafastFieldConfigBuilder = newGrafastFieldConfigBuilder;
exports.newInputObjectTypeBuilder = newInputObjectTypeBuilder;
exports.inputObjectFieldSpec = inputObjectFieldSpec;
exports.getEnumValueConfigs = getEnumValueConfigs;
exports.getEnumValueConfig = getEnumValueConfig;
exports.stack = stack;
exports.arrayOfLength = arrayOfLength;
exports.arrayOfLengthCb = arrayOfLengthCb;
exports.findVariableNamesUsedInValueNode = findVariableNamesUsedInValueNode;
exports.findVariableNamesUsed = findVariableNamesUsed;
exports.isTypePlanned = isTypePlanned;
exports.sudo = sudo;
exports.writeableArray = writeableArray;
exports.stepADependsOnStepB = stepADependsOnStepB;
exports.stepAMayDependOnStepB = stepAMayDependOnStepB;
exports.stepsAreInSamePhase = stepsAreInSamePhase;
exports.assertNotAsync = assertNotAsync;
exports.assertNotPromise = assertNotPromise;
exports.hasItemPlan = hasItemPlan;
exports.exportNameHint = exportNameHint;
exports.isTuple = isTuple;
exports.digestKeys = digestKeys;
exports.directiveArgument = directiveArgument;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const assert = tslib_1.__importStar(require("./assert.js"));
const dev_js_1 = require("./dev.js");
const error_js_1 = require("./error.js");
const inspect_js_1 = require("./inspect.js");
const constant_js_1 = require("./steps/constant.js");
const { GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLInterfaceType, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLString, GraphQLUnionType, Kind, } = graphql;
/**
 * The parent object is used as the key in `GetValueStepId()`; for root level
 * fields it's possible that the parent will be null/undefined (in all other
 * cases it will be an object), so we need a value that can be the key in a
 * WeakMap to represent the root.
 */
exports.ROOT_VALUE_OBJECT = Object.freeze(Object.create(null));
function assertNullPrototype(object, description) {
    if (dev_js_1.isDev) {
        assert.strictEqual(Object.getPrototypeOf(object), null, `Expected ${description} to have a null prototype`);
    }
}
/**
 * Converts a JSON value into the equivalent ValueNode _without_ checking that
 * it's compatible with the expected type. Typically only used with scalars
 * (since they can use any ValueNode) - other parts of the GraphQL schema
 * should use explicitly compatible ValueNodes.
 *
 * WARNING: It's possible for this to generate `LIST(INT, FLOAT, STRING)` which
 * is not possible in GraphQL since lists have a single defined type. This should
 * only be used with custom scalars.
 */
function dangerousRawValueToValueNode(value) {
    if (value == null) {
        return { kind: Kind.NULL };
    }
    if (typeof value === "boolean") {
        return { kind: Kind.BOOLEAN, value };
    }
    if (typeof value === "number") {
        if (value === Math.round(value)) {
            return { kind: Kind.INT, value: String(value) };
        }
        else {
            return { kind: Kind.FLOAT, value: String(value) };
        }
    }
    if (typeof value === "string") {
        return { kind: Kind.STRING, value };
    }
    if (Array.isArray(value)) {
        return {
            kind: Kind.LIST,
            values: value.map(dangerousRawValueToValueNode),
        };
    }
    if (typeof value === "object" && value !== null) {
        return {
            kind: Kind.OBJECT,
            fields: Object.keys(value).map((key) => ({
                kind: Kind.OBJECT_FIELD,
                name: { kind: Kind.NAME, value: key },
                value: dangerousRawValueToValueNode(value[key]),
            })),
        };
    }
    const never = value;
    console.error(`Unhandled type when converting custom scalar to ValueNode: ${(0, inspect_js_1.inspect)(never)}`);
    throw new Error(`Unhandled type when converting custom scalar to ValueNode`);
}
/**
 * Takes a value (typically a JSON-compatible value) and converts it into a
 * ValueNode that's compatible with the given GraphQL type.
 */
function rawValueToValueNode(type, value) {
    if (type instanceof GraphQLNonNull) {
        if (value == null) {
            throw new Error("defaultValue contained null/undefined at a position that is marked as non-null");
        }
        return rawValueToValueNode(type.ofType, value);
    }
    // Below here null/undefined are allowed.
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return { kind: Kind.NULL };
    }
    if (type === GraphQLBoolean) {
        if (typeof value !== "boolean") {
            throw new Error("defaultValue contained invalid value at a position expecting boolean");
        }
        return { kind: Kind.BOOLEAN, value };
    }
    if (type === GraphQLInt) {
        if (typeof value !== "number") {
            throw new Error("defaultValue contained invalid value at a position expecting int");
        }
        return { kind: Kind.INT, value: String(parseInt(String(value), 10)) };
    }
    if (type === GraphQLFloat) {
        if (typeof value !== "number") {
            throw new Error("defaultValue contained invalid value at a position expecting int");
        }
        return { kind: Kind.FLOAT, value: String(value) };
    }
    if (type === GraphQLString || type === GraphQLID) {
        if (typeof value !== "string") {
            throw new Error("defaultValue contained invalid value at a position expecting string");
        }
        return { kind: Kind.STRING, value };
    }
    if (type instanceof GraphQLEnumType) {
        const enumValues = type.getValues();
        const enumValue = enumValues.find((v) => v.value === value);
        if (!enumValue) {
            console.error(`Default contained invalid value for enum ${type.name}: ${(0, inspect_js_1.inspect)(value)}`);
            throw new Error(`Default contained invalid value for enum ${type.name}`);
        }
        return { kind: Kind.ENUM, value: enumValue.name };
    }
    if (type instanceof GraphQLScalarType) {
        return dangerousRawValueToValueNode(value);
    }
    if (type instanceof GraphQLList) {
        if (!Array.isArray(value)) {
            throw new Error("defaultValue contained invalid value at location expecting a list");
        }
        return {
            kind: Kind.LIST,
            values: value.map((entry) => {
                const entryValueNode = rawValueToValueNode(type.ofType, entry);
                if (entryValueNode === undefined) {
                    throw new Error("defaultValue contained invalid list (contained `undefined`)");
                }
                return entryValueNode;
            }),
        };
    }
    if (type instanceof GraphQLInputObjectType) {
        if (typeof value !== "object" || value === null) {
            throw new Error("defaultValue contained invalid value at location expecting an object");
        }
        const fieldDefs = type.getFields();
        const fields = [];
        for (const fieldName in fieldDefs) {
            const fieldDef = fieldDefs[fieldName];
            const fieldType = fieldDef.type;
            const rawValue = value[fieldName] !== undefined
                ? value[fieldName]
                : fieldDef.defaultValue;
            const fieldValueNode = rawValueToValueNode(fieldType, rawValue);
            if (fieldValueNode !== undefined) {
                fields.push({
                    kind: Kind.OBJECT_FIELD,
                    name: { kind: Kind.NAME, value: fieldName },
                    value: fieldValueNode,
                });
            }
        }
        return {
            kind: Kind.OBJECT,
            fields,
        };
    }
    const never = type;
    console.error(`Encountered unexpected type when processing defaultValue ${(0, inspect_js_1.inspect)(never)}`);
    throw new Error(`Encountered unexpected type when processing defaultValue`);
}
/**
 * Specifically allows for the `defaultValue` to be undefined, but otherwise
 * defers to {@link rawValueToValueNode}
 */
function defaultValueToValueNode(type, defaultValue) {
    // NOTE: even if `type` is non-null it's okay for `defaultValue` to be
    // undefined. However it is not okay for defaultValue to be null if type is
    // non-null.
    if (defaultValue === undefined) {
        return undefined;
    }
    return rawValueToValueNode(type, defaultValue);
}
function isPromise(t) {
    return (typeof t === "object" &&
        t !== null &&
        typeof t.then === "function" &&
        typeof t.catch === "function");
}
/**
 * Is "thenable".
 */
function isPromiseLike(t) {
    return t != null && typeof t.then === "function";
}
/**
 * Is a promise that can be externally resolved.
 */
function isDeferred(t) {
    return (isPromise(t) &&
        typeof t.resolve === "function" &&
        typeof t.reject === "function");
}
/**
 * Returns true if array1 and array2 have the same length, and every pair of
 * values within them pass the `comparator` check (which defaults to `===`).
 */
function arraysMatch(array1, array2, comparator) {
    if (array1 === array2)
        return true;
    const l = array1.length;
    if (l !== array2.length) {
        return false;
    }
    if (comparator !== undefined) {
        for (let i = 0; i < l; i++) {
            if (!comparator(array1[i], array2[i])) {
                return false;
            }
        }
    }
    else {
        for (let i = 0; i < l; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
function objectSpec(spec) {
    const { assertStep, ...rest } = spec;
    const modifiedSpec = {
        ...rest,
        ...(assertStep
            ? {
                extensions: {
                    ...spec.extensions,
                    grafast: {
                        assertStep,
                        ...spec.extensions?.grafast,
                    },
                },
            }
            : null),
        fields: () => {
            const fields = typeof spec.fields === "function" ? spec.fields() : spec.fields;
            const modifiedFields = Object.keys(fields).reduce((o, key) => {
                o[key] = objectFieldSpec(fields[key], `${spec.name}.${key}`);
                return o;
            }, {});
            return modifiedFields;
        },
    };
    return modifiedSpec;
}
/**
 * @remarks This is a mess because the first two generics need to be specified manually, but the latter one we want inferred.
 */
function newObjectTypeBuilder(assertStep) {
    return (spec) => new GraphQLObjectType(objectSpec({ assertStep, ...spec }));
}
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
function objectFieldSpec(grafastSpec, path) {
    const { plan, subscribePlan, args, ...spec } = grafastSpec;
    assertNotAsync(plan, `${path ?? "?"}.plan`);
    assertNotAsync(subscribePlan, `${path ?? "?"}.subscribePlan`);
    const argsWithExtensions = args
        ? Object.keys(args).reduce((memo, argName) => {
            const grafastArgSpec = args[argName];
            // TODO: remove this code
            if (grafastArgSpec.inputPlan ||
                grafastArgSpec.autoApplyAfterParentPlan ||
                grafastArgSpec.autoApplyAfterParentSubscribePlan) {
                throw new Error(`Argument at ${path} has inputPlan or autoApplyAfterParentPlan or autoApplyAfterParentSubscribePlan set; these properties no longer do anything and should be removed.`);
            }
            const { applyPlan, applySubscribePlan, ...argSpec } = grafastArgSpec;
            assertNotAsync(applyPlan, `${path ?? "?"}(${argName}:).applyPlan`);
            assertNotAsync(applySubscribePlan, `${path ?? "?"}(${argName}:).applySubscribePlan`);
            memo[argName] = {
                ...argSpec,
                ...(applyPlan || applySubscribePlan
                    ? {
                        extensions: {
                            ...argSpec.extensions,
                            grafast: {
                                ...argSpec.extensions?.grafast,
                                ...(applyPlan ? { applyPlan } : null),
                                ...(applySubscribePlan ? { applySubscribePlan } : null),
                            },
                        },
                    }
                    : null),
            };
            return memo;
        }, Object.create(null))
        : {};
    return {
        ...spec,
        args: argsWithExtensions,
        ...(plan || subscribePlan
            ? {
                extensions: {
                    ...spec.extensions,
                    grafast: {
                        ...spec.extensions?.grafast,
                        ...(plan ? { plan } : null),
                        ...(subscribePlan ? { subscribePlan } : null),
                    },
                },
            }
            : null),
    };
}
/**
 * "Constrainted identity function" for field configs.
 *
 * @see {@link https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript}
 */
function newGrafastFieldConfigBuilder() {
    return (config) => config;
}
function inputObjectSpec(spec) {
    const modifiedSpec = {
        ...spec,
        fields: () => {
            const fields = typeof spec.fields === "function" ? spec.fields() : spec.fields;
            const modifiedFields = Object.keys(fields).reduce((o, key) => {
                o[key] = inputObjectFieldSpec(fields[key], `${spec.name}.${key}`);
                return o;
            }, {});
            return modifiedFields;
        },
    };
    return modifiedSpec;
}
function newInputObjectTypeBuilder() {
    return (spec) => new GraphQLInputObjectType(inputObjectSpec(spec));
}
/**
 * Saves us having to write `extensions: {grafast: {...}}` everywhere.
 */
function inputObjectFieldSpec(grafastSpec, path) {
    // TODO: remove this code
    if (grafastSpec.applyPlan ||
        grafastSpec.inputPlan ||
        grafastSpec.autoApplyAfterParentApplyPlan ||
        grafastSpec.autoApplyAfterParentInputPlan) {
        throw new Error(`Input field at ${path} has applyPlan or inputPlan or autoApplyAfterParentApplyPlan or autoApplyAfterParentInputPlan set; these properties no longer do anything and should be removed.`);
    }
    const { apply, ...spec } = grafastSpec;
    assertNotAsync(apply, `${path ?? "?"}.apply`);
    return apply
        ? {
            ...spec,
            extensions: {
                ...spec.extensions,
                grafast: {
                    ...spec.extensions?.grafast,
                    apply,
                },
            },
        }
        : spec;
}
const $$valueConfigByValue = Symbol("valueConfigByValue");
function getEnumValueConfigs(enumType) {
    // We cache onto the enumType directly so that garbage collection can clear up after us easily.
    if (enumType[$$valueConfigByValue] === undefined) {
        const config = enumType.toConfig();
        enumType[$$valueConfigByValue] = Object.values(config.values).reduce((memo, value) => {
            memo[value.value] = value;
            return memo;
        }, Object.create(null));
    }
    return enumType[$$valueConfigByValue];
}
/**
 * This would be equivalent to `enumType._valueLookup.get(outputValue)` except
 * that's not a public API so we have to do a bit of heavy lifting here. Since
 * it is heavy lifting, we cache the result, but we don't know when enumType
 * will go away so we use a weakmap.
 */
function getEnumValueConfig(enumType, outputValue) {
    return getEnumValueConfigs(enumType)[outputValue];
}
/**
 * It's a peculiarity of V8 that `{}` is twice as fast as
 * `Object.create(null)`, but `Object.create(sharedNull)` is the same speed as
 * `{}`. Hat tip to `@purge` for bringing this to my attention.
 *
 * @internal
 */
exports.sharedNull = Object.freeze(Object.create(null));
/**
 * Prints out the stack trace to the current position with a message; useful
 * for debugging which code path has hit this line.
 *
 * @internal
 */
function stack(message, length = 4) {
    try {
        throw new Error(message);
    }
    catch (e) {
        const lines = e.stack.split("\n");
        const start = lines.findIndex((line) => line.startsWith("Error:"));
        if (start < 0) {
            console.dir(e.stack);
            return;
        }
        const filtered = [
            lines[start],
            ...lines.slice(start + 2, start + 2 + length),
        ];
        const mapped = filtered.map((line) => line.replace(/^(.*?)\(\/home[^)]*\/packages\/([^)]*)\)/, (_, start, rest) => `${start}${" ".repeat(Math.max(0, 45 - start.length))}(${rest})`));
        console.log(mapped.join("\n"));
    }
}
/**
 * Ridiculously, this is faster than `new Array(length).fill(fill)`
 */
function arrayOfLength(length, fill) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr[i] = fill;
    }
    return arr;
}
/**
 * Builds an array of length `length` calling `fill` for each entry in the
 * list and storing the result.
 *
 * @internal
 */
function arrayOfLengthCb(length, fill) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr[i] = fill();
    }
    return arr;
}
exports.valueNodeToStaticValue = graphql.valueFromAST;
function findVariableNamesUsedInValueNode(valueNode, variableNames) {
    switch (valueNode.kind) {
        case Kind.INT:
        case Kind.FLOAT:
        case Kind.STRING:
        case Kind.BOOLEAN:
        case Kind.NULL:
        case Kind.ENUM: {
            // Static -> no variables
            return;
        }
        case Kind.LIST: {
            for (const value of valueNode.values) {
                findVariableNamesUsedInValueNode(value, variableNames);
            }
            return;
        }
        case Kind.OBJECT: {
            for (const field of valueNode.fields) {
                findVariableNamesUsedInValueNode(field.value, variableNames);
            }
            return;
        }
        case Kind.VARIABLE: {
            variableNames.add(valueNode.name.value);
            return;
        }
        default: {
            const never = valueNode;
            throw new Error(`Unsupported valueNode: ${JSON.stringify(never)}`);
        }
    }
}
function findVariableNamesUsedInDirectives(directives, variableNames) {
    if (directives !== undefined) {
        for (const dir of directives) {
            if (dir.arguments !== undefined) {
                for (const arg of dir.arguments) {
                    findVariableNamesUsedInValueNode(arg.value, variableNames);
                }
            }
        }
    }
}
function findVariableNamesUsedInArguments(args, variableNames) {
    if (args !== undefined) {
        for (const arg of args) {
            findVariableNamesUsedInValueNode(arg.value, variableNames);
        }
    }
}
function findVariableNamesUsedInSelectionNode(operationPlan, selection, variableNames) {
    findVariableNamesUsedInDirectives(selection.directives, variableNames);
    switch (selection.kind) {
        case Kind.FIELD: {
            findVariableNamesUsedInFieldNode(operationPlan, selection, variableNames);
            return;
        }
        case Kind.INLINE_FRAGMENT: {
            findVariableNamesUsedInDirectives(selection.directives, variableNames);
            for (const innerSelection of selection.selectionSet.selections) {
                findVariableNamesUsedInSelectionNode(operationPlan, innerSelection, variableNames);
            }
            return;
        }
        case Kind.FRAGMENT_SPREAD: {
            findVariableNamesUsedInDirectives(selection.directives, variableNames);
            const fragmentName = selection.name.value;
            const fragment = operationPlan.fragments[fragmentName];
            findVariableNamesUsedInDirectives(fragment.directives, variableNames);
            if (fragment.variableDefinitions?.length) {
                throw new error_js_1.SafeError("Grafast doesn't support variable definitions on fragments yet.");
            }
            for (const innerSelection of fragment.selectionSet.selections) {
                findVariableNamesUsedInSelectionNode(operationPlan, innerSelection, variableNames);
            }
            return;
        }
        default: {
            const never = selection;
            throw new Error(`Unsupported selection ${never.kind}`);
        }
    }
}
function findVariableNamesUsedInFieldNode(operationPlan, field, variableNames) {
    findVariableNamesUsedInArguments(field.arguments, variableNames);
    findVariableNamesUsedInDirectives(field.directives, variableNames);
    if (field.selectionSet !== undefined) {
        for (const selection of field.selectionSet.selections) {
            findVariableNamesUsedInSelectionNode(operationPlan, selection, variableNames);
        }
    }
}
/**
 * Given a FieldNode, recursively walks and finds all the variable references,
 * returning a list of the (unique) variable names used.
 */
function findVariableNamesUsed(operationPlan, field) {
    const variableNames = new Set();
    findVariableNamesUsedInFieldNode(operationPlan, field, variableNames);
    return [...variableNames].sort();
}
function isTypePlanned(schema, namedType) {
    if (namedType instanceof GraphQLObjectType) {
        return !!namedType.extensions?.grafast?.assertStep;
    }
    else if (namedType instanceof GraphQLUnionType ||
        namedType instanceof GraphQLInterfaceType) {
        const types = namedType instanceof GraphQLUnionType
            ? namedType.getTypes()
            : schema.getImplementations(namedType).objects;
        let firstHadPlan = null;
        let i = 0;
        for (const type of types) {
            const hasPlan = !!type.extensions?.grafast?.assertStep;
            if (firstHadPlan === null) {
                firstHadPlan = hasPlan;
            }
            else if (hasPlan !== firstHadPlan) {
                // ENHANCE: validate this at schema build time
                throw new Error(`The '${namedType.name}' interface or union type's first type '${types[0]}' ${firstHadPlan ? "expected a plan" : "did not expect a plan"}, however the type '${type}' (index = ${i}) ${hasPlan ? "expected a plan" : "did not expect a plan"}. All types in an interface or union must be in agreement about whether a plan is expected or not.`);
            }
            i++;
        }
        return !!firstHadPlan;
    }
    else {
        return false;
    }
}
/**
 * Make protected/private methods accessible.
 *
 * @internal
 */
function sudo(obj) {
    return obj;
}
/**
 * We want everything else to treat things like `dependencies` as read only,
 * however we ourselves want to be able to write to them, so we can use
 * writeable for this.
 *
 * @internal
 */
function writeableArray(a) {
    return a;
}
/**
 * Returns `true` if the first argument depends on the second argument either
 * directly or indirectly (via a chain of dependencies).
 */
function stepADependsOnStepB(stepA, stepB) {
    if (stepA === stepB) {
        throw new Error("Invalid call to stepADependsOnStepB");
    }
    // PERF: bredth-first might be better.
    // PERF: we can stop looking once we pass a certain layerPlan boundary.
    // PERF: maybe some form of caching here would be sensible?
    // Depth-first search for match
    for (const dep of sudo(stepA).dependencies) {
        if (dep === stepB) {
            return true;
        }
        if (stepADependsOnStepB(dep, stepB)) {
            return true;
        }
    }
    return false;
}
/**
 * Returns true if stepA is allowed to depend on stepB, false otherwise. (This
 * mostly relates to heirarchy.)
 */
function stepAMayDependOnStepB($a, $b) {
    if ($a.isFinalized) {
        return false;
    }
    if ($a._isUnaryLocked && $a._isUnary && !$b._isUnary) {
        return false;
    }
    if (!$a.layerPlan.ancestry.includes($b.layerPlan)) {
        return false;
    }
    return !stepADependsOnStepB($b, $a);
}
/**
 * For a regular GraphQL query with no `@stream`/`@defer`, the entire result is
 * calculated and then the output is generated and sent to the client at once.
 * Thus you can think of this as every plan is in the same "phase".
 *
 * However, if you introduce a `@stream`/`@defer` selection, then the steps
 * inside that selection should run _later_ than the steps in the parent
 * selection - they should run in two different phases. Similar is true for
 * subscriptions.
 *
 * When optimizing your plans, if you are not careful you may end up pushing
 * what should be later work into the earlier phase, resulting in the initial
 * payload being delayed whilst things that should have been deferred are being
 * calculated. Thus, you should generally check that two plans are in the same phase
 * before you try and merge them.
 *
 * This is not a strict rule, though, because sometimes it makes more sense to
 * push work into the parent phase because it would be faster overall to do
 * that work there, and would not significantly delay the initial payload's
 * execution time - for example it's unlikely that it would make sense to defer
 * selecting an additional boolean column from a database table even if the
 * operation indicates that's what you should do.
 *
 * As a step class author, it's your responsiblity to figure out the right
 * approach. Once you have, you can use this function to help you, should you
 * need it.
 */
function stepsAreInSamePhase(ancestor, descendent) {
    let currentLayerPlan = descendent.layerPlan;
    do {
        if (currentLayerPlan === ancestor.layerPlan) {
            return true;
        }
        const t = currentLayerPlan.reason.type;
        switch (t) {
            case "subscription":
            case "defer": {
                // These indicate boundaries over which plans shouldn't be optimized
                // together (generally).
                return false;
            }
            case "polymorphic": {
                // OPTIMIZE: can optimize this so that if all polymorphicPaths match then it
                // passes
                return false;
            }
            case "listItem": {
                if (currentLayerPlan.reason.stream) {
                    // It's streamed, but we can still inline the step into its parent since its the parent that is being streamed (so it should not add to the initial execution overhead).
                    // OPTIMIZE: maybe we should only allow this if the parent actually has `stream` support, and disable it otherwise?
                    continue;
                }
                else {
                    continue;
                }
            }
            case "root":
            case "nullableBoundary":
            case "subroutine":
            case "mutationField": {
                continue;
            }
            default: {
                const never = t;
                throw new Error(`Unhandled layer plan type '${never}'`);
            }
        }
    } while ((currentLayerPlan = currentLayerPlan.parentLayerPlan));
    throw new Error(`${descendent} is not dependent on ${ancestor}, perhaps you passed the arguments in the wrong order?`);
}
// ENHANCE: implement this!
const canonicalJSONStringify = (o) => JSON.stringify(o);
exports.canonicalJSONStringify = canonicalJSONStringify;
// PERF: only do this if isDev; otherwise replace with NOOP?
function assertNotAsync(fn, name) {
    if (fn?.constructor?.name === "AsyncFunction") {
        throw new Error(`Plans must be synchronous, but this schema has an async function at '${name}': ${fn.toString()}`);
    }
}
// PERF: only do this if isDev; otherwise replace with NOOP?
function assertNotPromise(value, fn, name) {
    if (isPromiseLike(value)) {
        throw new Error(`Plans must be synchronous, but this schema has an function at '${name}' that returned a promise-like object: ${fn.toString()}`);
    }
    return value;
}
function hasItemPlan(step) {
    return "itemPlan" in step && typeof step.itemPlan === "function";
}
function exportNameHint(obj, nameHint) {
    if ((typeof obj === "object" && obj != null) || typeof obj === "function") {
        if (!("$exporter$name" in obj)) {
            Object.defineProperty(obj, "$exporter$name", {
                writable: true,
                value: nameHint,
            });
        }
        else if (!obj.$exporter$name) {
            obj.$exporter$name = nameHint;
        }
    }
}
function isTuple(t) {
    return Array.isArray(t);
}
/**
 * Turns an array of keys into a digest, avoiding conflicts.
 * Symbols are treated as equivalent. (Theoretically faster
 * than JSON.stringify().)
 */
function digestKeys(keys) {
    let str = "";
    for (let i = 0, l = keys.length; i < l; i++) {
        const item = keys[i];
        if (typeof item === "string") {
            // str += `|§${item.replace(/§/g, "§§")}§`;
            str += `§${item.length}:${item}`;
        }
        else if (typeof item === "number") {
            str += `N${item}`;
        }
        else {
            str += "!";
        }
    }
    return str;
}
/**
 * If the directive has the argument `argName`, return a step representing that
 * arguments value, whether that be a step representing the relevant variable
 * or a constant step representing the hardcoded value in the document.
 *
 * @remarks NOT SUITABLE FOR USAGE WITH LISTS OR OBJECTS! Does not evaluate
 * internal variable usages e.g. `[1, $b, 3]`
 */
function directiveArgument(operationPlan, directive, argName, expectedKind) {
    const arg = directive.arguments?.find((n) => n.name.value === argName);
    if (!arg)
        return undefined;
    const val = arg.value;
    return val.kind === graphql.Kind.VARIABLE
        ? operationPlan.variableValuesStep.get(val.name.value)
        : val.kind === expectedKind
            ? (0, constant_js_1.constant)(val.kind === Kind.INT
                ? parseInt(val.value, 10)
                : val.kind === Kind.FLOAT
                    ? parseFloat(val.value)
                    : // boolean, string
                        val.value)
            : undefined;
}
//# sourceMappingURL=utils.js.map