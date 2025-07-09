"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLItemHandler = exports.GraphQLResolverStep = void 0;
exports.graphqlItemHandler = graphqlItemHandler;
exports.graphqlResolver = graphqlResolver;
const tslib_1 = require("tslib");
const graphql = tslib_1.__importStar(require("graphql"));
const iterall_1 = require("iterall");
const index_js_1 = require("../index.js");
const polymorphic_js_1 = require("../polymorphic.js");
const step_js_1 = require("../step.js");
const utils_js_1 = require("../utils.js");
const { defaultTypeResolver, getNamedType, getNullableType, isAbstractType, isListType, isNonNullType, } = graphql;
function dcr(data, // but not a promise
context, resolveInfo) {
    if (data == null) {
        return data;
    }
    else if (data instanceof Error) {
        return (0, index_js_1.flagError)(data);
    }
    else if ((0, utils_js_1.isPromiseLike)(data)) {
        return data.then((data) => dcr(data, context, resolveInfo));
    }
    if ((0, iterall_1.isIterable)(data)) {
        const list = Array.isArray(data) ? data : [...data];
        if (list.some(utils_js_1.isPromiseLike)) {
            const resolved = Promise.all(list.map((entry) => (0, utils_js_1.isPromiseLike)(entry) ? entry.then(null, index_js_1.flagError) : entry));
            // TODO: this does recursion which is inefficient and also incorrect. We
            // should only traverse as deep as the GraphQL type has lists.
            return dcr(resolved, context, resolveInfo);
        }
    }
    // TODO: support async iterables
    return { data, context, resolveInfo };
}
/**
 * Calls the given GraphQL resolver for each input - emulates GraphQL
 * resolution.
 *
 * @internal
 */
class GraphQLResolverStep extends step_js_1.UnbatchedStep {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "GraphQLResolverStep",
    }; }
    constructor(resolver, subscriber, $plan, $args, resolveInfoBase, returnContextAndResolveInfo = false) {
        super();
        this.resolver = resolver;
        this.subscriber = subscriber;
        this.resolveInfoBase = resolveInfoBase;
        this.returnContextAndResolveInfo = returnContextAndResolveInfo;
        this.isSyncAndSafe = false;
        this.allowMultipleOptimizations = false;
        this.planDep = this.addDependency($plan);
        this.argsDep = this.addDependency($args);
        this.contextDep = this.addDependency((0, index_js_1.context)());
        this.variableValuesDep = this.addDependency(this.operationPlan.variableValuesStep);
        this.rootValueDep = this.addDependency(this.operationPlan.rootValueStep);
        this.isNotRoot = ![
            this.operationPlan.queryType,
            this.operationPlan.mutationType,
            this.operationPlan.subscriptionType,
        ].includes(resolveInfoBase.parentType);
    }
    toStringMeta() {
        return (this.resolver?.displayName ||
            this.resolver?.name ||
            this.subscriber?.displayName ||
            this.subscriber?.name ||
            null);
    }
    unbatchedExecute(extra, source, args, context, variableValues, rootValue) {
        if (!extra.stream) {
            if (this.isNotRoot && source == null) {
                return source;
            }
            const resolveInfo = Object.assign(Object.create(this.resolveInfoBase), {
                variableValues,
                rootValue,
                path: {
                    typename: this.resolveInfoBase.parentType.name,
                    key: this.resolveInfoBase.fieldName,
                    // ENHANCE: add full support for path (requires runtime indexes)
                    prev: undefined,
                },
            });
            const data = this.resolver?.(source, args, context, resolveInfo);
            if (this.returnContextAndResolveInfo) {
                return dcr(data, context, resolveInfo);
            }
            else {
                return flagErrorIfErrorAsync(data);
            }
        }
        else {
            if (this.isNotRoot) {
                return Promise.reject(new Error(`Invalid non-root subscribe`));
            }
            if (this.subscriber == null) {
                return Promise.reject(new Error(`Cannot subscribe to field`));
            }
            if (this.returnContextAndResolveInfo) {
                return Promise.reject(new Error(`Subscription with returnContextAndResolveInfo is not supported`));
            }
            const resolveInfo = Object.assign(Object.create(this.resolveInfoBase), {
                // ENHANCE: add support for path
                variableValues,
                rootValue,
            });
            // TODO: we also need to call the resolver on each result?
            const data = this.subscriber(source, args, context, resolveInfo);
            // TODO: should apply flagErrorIfError to each value data yields
            return flagErrorIfErrorAsync(data);
        }
    }
}
exports.GraphQLResolverStep = GraphQLResolverStep;
/** @internal */
class GraphQLItemHandler extends step_js_1.Step {
    static { this.$$export = {
        moduleName: "grafast",
        exportName: "GraphQLItemHandler",
    }; }
    constructor($parent, nullableType) {
        super();
        this.nullableInnerType = null;
        this.isSyncAndSafe = false;
        this.addDependency($parent);
        if (isListType(nullableType)) {
            const innerType = nullableType.ofType;
            if (isNonNullType(innerType)) {
                this.nullableInnerType = innerType.ofType;
            }
            else {
                this.nullableInnerType = innerType;
            }
        }
        else {
            if (!isAbstractType(nullableType)) {
                throw new Error(`GrafastInternalError<0a293e88-0f38-43f6-9179-f3ef9a720872>: Expected nullableType to be a list or abstract type, instead found ${nullableType}`);
            }
            this.abstractType = nullableType;
        }
    }
    planForType() {
        return this;
    }
    listItem($item) {
        if (!this.nullableInnerType) {
            throw new Error(`GrafastInternalError<83f3533a-db8e-4eb9-9251-2a165ae6147b>: did not expect ${this}.listItem() to be called since it wasn't handling a list type`);
        }
        return graphqlItemHandler($item, this.nullableInnerType);
    }
    /**
     * Akin to graphql-js' completeAbstractValue... but just the typeName
     * resolution part.
     */
    figureOutTheTypeOf(data, context, resolveInfo) {
        const abstractType = this.abstractType;
        if (!abstractType) {
            throw new Error("GrafastInternalError<5ea0892a-e9f6-479c-9b0b-2b09e46eecb6>: No abstract type? How can this be?");
        }
        if (abstractType.resolveType != null) {
            return abstractType.resolveType(data, context, resolveInfo, abstractType);
        }
        else {
            return defaultTypeResolver(data, context, resolveInfo, abstractType);
        }
    }
    actuallyWrapData(typeName, data) {
        if (typeName !== undefined) {
            return (0, polymorphic_js_1.polymorphicWrap)(typeName, data);
        }
        else {
            return new Error("Could not determine type of data");
        }
    }
    polymorphicWrapData(data, // but not a promise
    context, resolveInfo) {
        if (data == null) {
            return null;
        }
        const typeName = this.figureOutTheTypeOf(data, context, resolveInfo);
        if ((0, utils_js_1.isPromiseLike)(typeName)) {
            return typeName.then((name) => this.actuallyWrapData(name, data));
        }
        else {
            return this.actuallyWrapData(typeName, data);
        }
    }
    wrapListData(data, context, resolveInfo) {
        if (data == null) {
            return null;
        }
        if (!Array.isArray(data)) {
            console.warn(`${this}: data wasn't an array, so we're returning null`);
            return null;
        }
        return data.map((data) => dcr(data, context, resolveInfo));
    }
    execute({ indexMap, values: [values0], }) {
        if (this.abstractType !== undefined) {
            return indexMap((i) => {
                const data = values0.at(i);
                if (data == null) {
                    return data;
                }
                else if ((0, utils_js_1.isPromiseLike)(data.data)) {
                    return data.data.then((resolvedData) => this.polymorphicWrapData(resolvedData, data.context, data.resolveInfo));
                }
                else {
                    return this.polymorphicWrapData(data.data, data.context, data.resolveInfo);
                }
            });
        }
        else if (this.nullableInnerType != null) {
            return indexMap((i) => {
                const d = values0.at(i);
                if (d == null) {
                    return null;
                }
                else {
                    const { data, context, resolveInfo } = d;
                    if ((0, utils_js_1.isPromiseLike)(data)) {
                        return data.then((data) => this.wrapListData(data, context, resolveInfo));
                    }
                    else {
                        return this.wrapListData(data, context, resolveInfo);
                    }
                }
            });
        }
        else {
            throw new Error(`GrafastInternalError<6a3ed701-6b53-41e6-9a64-fbea57c76ae7>: has to be abstract or list`);
        }
    }
}
exports.GraphQLItemHandler = GraphQLItemHandler;
function graphqlItemHandler($item, nullableType) {
    return new GraphQLItemHandler($item, nullableType);
}
/**
 * Emulates what GraphQL does when calling a resolver, including handling of
 * polymorphism.
 *
 * @internal
 */
function graphqlResolver(resolver, subscriber, $step, $args, resolveInfoBase) {
    const { returnType } = resolveInfoBase;
    const namedType = getNamedType(returnType);
    const isAbstract = isAbstractType(namedType);
    const $resolverResult = new GraphQLResolverStep(resolver, subscriber, $step, $args, resolveInfoBase, isAbstract);
    if (isAbstract) {
        if (subscriber != null) {
            throw new index_js_1.SafeError(`GraphQL subscribe function emulation currently doesn't support polymorphism`);
        }
        const nullableType = getNullableType(returnType);
        return graphqlItemHandler($resolverResult, nullableType);
    }
    else {
        return $resolverResult;
    }
}
function flagErrorIfError(data) {
    return data instanceof Error ? (0, index_js_1.flagError)(data) : data;
}
function flagErrorIfErrorAsync(data) {
    if ((0, utils_js_1.isPromiseLike)(data)) {
        return data.then(flagErrorIfError);
    }
    else {
        return flagErrorIfError(data);
    }
}
//# sourceMappingURL=graphqlResolver.js.map