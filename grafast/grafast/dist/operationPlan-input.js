"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withFieldArgsForArguments = withFieldArgsForArguments;
exports.getNullableInputTypeAtPath = getNullableInputTypeAtPath;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const index_js_1 = require("./index.js");
const inspect_js_1 = require("./inspect.js");
const utils_js_1 = require("./utils.js");
const { getNullableType, isInputObjectType, isListType } = graphql;
function assertNotRuntime(operationPlan, description) {
    if (operationPlan.phase === "ready") {
        throw new Error(`${description} may only be called at planning time; however you have code that has attempted to call it during execution time. Please revisit your plan resolvers to locate the issue.`);
    }
}
function withFieldArgsForArguments(operationPlan, $all, field, $parent, applyAfterMode, coordinate, callback) {
    if (operationPlan.loc !== null)
        operationPlan.loc.push(`withFieldArgsForArguments(${field.name})`);
    const args = Object.create(null);
    for (const arg of field.args) {
        args[arg.name] = arg;
    }
    const applied = new Map();
    let explicitlyApplied = false;
    const fieldArgs = {
        typeAt(path) {
            if (typeof path === "string") {
                return args[path].type;
            }
            else {
                if (path.length === 0) {
                    throw new Error(`typeAt can only be used with a non-empty path since arguments themselves don't belong to a type but a field.`);
                }
                const argName = path[0];
                let type = args[argName]?.type;
                if (!type) {
                    throw new Error(`Argument ${argName} does not exist`);
                }
                for (let i = 1, l = path.length; i < l; i++) {
                    const segment = path[i];
                    type = graphql.isNonNullType(type) ? type.ofType : type;
                    if (typeof segment === "number") {
                        if (!isListType(type)) {
                            throw new Error(`Invalid path ${path.slice(1)} within argument ${argName}; expected a list at path index ${i - 1}`);
                        }
                        type = type.ofType;
                    }
                    else {
                        if (!isInputObjectType(type)) {
                            throw new Error(`Invalid path ${path.slice(1)} within argument ${argName}; expected an object at path index ${i - 1}`);
                        }
                        const arg = type.getFields()[segment];
                        if (!arg) {
                            throw new Error(`Invalid path ${path.slice(1)} within argument ${argName}; ${type} does not have a field '${segment}'`);
                        }
                        type = arg.type;
                    }
                }
                return type;
            }
        },
        getRaw(path) {
            assertNotRuntime(operationPlan, `fieldArgs.getRaw()`);
            if (path === undefined) {
                return (0, index_js_1.object)(Object.fromEntries(Object.keys(args).map((argName) => [argName, $all.get(argName)])));
            }
            else if (typeof path === "string") {
                return $all.get(path);
            }
            else if (Array.isArray(path)) {
                const [first, ...rest] = path;
                if (!first) {
                    throw new Error(`getRaw() must be called with a non-empty path`);
                }
                let $entry = $all.get(first);
                for (const pathSegment of rest) {
                    if (typeof pathSegment === "number" && "at" in $entry) {
                        $entry = $entry.at(pathSegment);
                    }
                    else if ("get" in $entry) {
                        $entry = $entry.get(pathSegment);
                    }
                    else {
                        throw new Error(`'getRaw' path must only relate to input objects right now; path was: '${path}' (failed at '${pathSegment}')`);
                    }
                }
                return $entry;
            }
            else {
                throw new Error(`Invalid path passed to FieldArgs.getRaw(); please check your code. Path: ${(0, inspect_js_1.inspect)(path)}`);
            }
        },
        apply($target, inPathOrGetTargetFromParent, maybeGetTargetFromParent) {
            const inPath = typeof inPathOrGetTargetFromParent === "function"
                ? undefined
                : inPathOrGetTargetFromParent;
            const getTargetFromParent = typeof inPathOrGetTargetFromParent === "function"
                ? inPathOrGetTargetFromParent
                : maybeGetTargetFromParent;
            assertNotRuntime(operationPlan, `fieldArgs.apply()`);
            const path = Array.isArray(inPath) ? inPath : inPath ? [inPath] : [];
            const pathString = path.join(".");
            const $existing = applied.get(pathString);
            if ($existing) {
                throw new Error(`Attempted to apply 'applyPlan' at input path ${pathString} more than once - first time to ${$existing}, second time to ${$target}. Multiple applications are not currently supported.`);
            }
            if (path.length === 0) {
                explicitlyApplied = true;
                // Auto-apply all the arguments
                for (const argName of Object.keys(args)) {
                    fieldArgs.apply($target, [argName]);
                }
            }
            else {
                const [argName, ...rest] = path;
                if (typeof argName !== "string") {
                    throw new Error(`Invalid path; argument '${argName}' is an invalid argument name`);
                }
                const arg = args[argName];
                if (!arg) {
                    throw new Error(`Invalid path; argument '${argName}' does not exist`);
                }
                const typeAtPath = getNullableInputTypeAtPath(arg.type, rest);
                const $valueAtPath = fieldArgs.getRaw(inPath);
                if ($valueAtPath instanceof index_js_1.ConstantStep &&
                    $valueAtPath.data === undefined) {
                    // Skip applying!
                }
                else {
                    $target.apply((0, index_js_1.applyInput)(typeAtPath, $valueAtPath, getTargetFromParent));
                }
            }
        },
    };
    for (const argName of Object.keys(args)) {
        let val;
        Object.defineProperty(fieldArgs, `$${argName}`, {
            get() {
                return (val ??= fieldArgs.getRaw(argName));
            },
        });
    }
    const result = callback(fieldArgs);
    (0, utils_js_1.assertNotPromise)(result, callback, operationPlan.loc?.join(">") ?? "???");
    if (!explicitlyApplied && result != null) {
        processAfter($parent, fieldArgs, result, args, applyAfterMode, coordinate);
    }
    if (operationPlan.loc !== null)
        operationPlan.loc.pop();
    return (result ?? null);
}
function processAfter($parent, rootFieldArgs, $result, args, applyAfterMode, coordinate) {
    const schema = $parent.operationPlan.schema;
    for (const [argName, arg] of Object.entries(args)) {
        const autoApply = applyAfterMode === "plan"
            ? arg.extensions.grafast?.applyPlan
            : applyAfterMode === "subscribePlan"
                ? arg.extensions.grafast?.applySubscribePlan
                : null;
        if (autoApply) {
            if (arg.defaultValue === undefined) {
                const $argVal = rootFieldArgs.getRaw(argName);
                if ($argVal instanceof index_js_1.ConstantStep && $argVal.data === undefined) {
                    // no action necessary
                    continue;
                }
            }
            // TODO: should this have dollars on it for accessing subkeys?
            const input = {
                typeAt(path) {
                    return rootFieldArgs.typeAt(concatPath(argName, path));
                },
                getRaw(path) {
                    return rootFieldArgs.getRaw(concatPath(argName, path));
                },
                apply($target, pathOrTargetGetter, maybeTargetGetter) {
                    if (typeof pathOrTargetGetter === "function") {
                        return rootFieldArgs.apply($target, [argName], pathOrTargetGetter);
                    }
                    else {
                        return rootFieldArgs.apply($target, concatPath(argName, pathOrTargetGetter), maybeTargetGetter);
                    }
                },
            };
            const result = autoApply($parent, $result, input, {
                schema,
                arg,
                argName,
            });
            if (result !== undefined) {
                const fullCoordinate = `${coordinate}(${argName}:)`;
                throw new Error(`Argument ${fullCoordinate}'s applyPlan returned a value. This may indicate a bug in that method, please see https://err.red/gaap#coord=${encodeURIComponent(fullCoordinate)}`);
            }
        }
    }
}
function getNullableInputTypeAtPath(startType, path) {
    let type = getNullableType(startType);
    for (let i = 0, l = path.length; i < l; i++) {
        const segment = path[i];
        if (typeof segment === "number") {
            // Expect list
            if (!isListType(type)) {
                throw new Error(`Invalid path passed to fieldArgs.get(); expected list type, but found ${type}`);
            }
            type = getNullableType(type.ofType);
        }
        else {
            // Must be a string
            if (!isInputObjectType(type)) {
                throw new Error(`Invalid path passed to fieldArgs.get(); expected object type, but found ${type}`);
            }
            const field = type.getFields()[segment];
            if (!field) {
                throw new Error(`Invalid path passed to fieldArgs.get(); ${type} has no field named ${segment}`);
            }
            type = getNullableType(field.type);
        }
    }
    return type;
}
function concatPath(argName, subpath) {
    if (subpath == null)
        return [argName];
    const localPath = Array.isArray(subpath) ? subpath : [subpath];
    return [argName, ...localPath];
}
//# sourceMappingURL=operationPlan-input.js.map