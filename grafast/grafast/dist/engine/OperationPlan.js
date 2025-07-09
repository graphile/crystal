"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationPlan = exports.POLYMORPHIC_ROOT_PATHS = exports.POLYMORPHIC_ROOT_PATH = void 0;
const tslib_1 = require("tslib");
const lru_1 = tslib_1.__importDefault(require("@graphile/lru"));
const graphql = tslib_1.__importStar(require("graphql"));
const tamedevil_1 = tslib_1.__importDefault(require("tamedevil"));
const assert = tslib_1.__importStar(require("../assert.js"));
const graphqlCollectFields_js_1 = require("../graphqlCollectFields.js");
const graphqlMergeSelectionSets_js_1 = require("../graphqlMergeSelectionSets.js");
const index_js_1 = require("../index.js");
const input_js_1 = require("../input.js");
const inspect_js_1 = require("../inspect.js");
const interfaces_js_1 = require("../interfaces.js");
const operationPlan_input_js_1 = require("../operationPlan-input.js");
const step_js_1 = require("../step.js");
const connection_js_1 = require("../steps/connection.js");
const constant_js_1 = require("../steps/constant.js");
const graphqlResolver_js_1 = require("../steps/graphqlResolver.js");
const timeSource_js_1 = require("../timeSource.js");
const utils_js_1 = require("../utils.js");
const LayerPlan_js_1 = require("./LayerPlan.js");
const defaultPlanResolver_js_1 = require("./lib/defaultPlanResolver.js");
const withGlobalLayerPlan_js_1 = require("./lib/withGlobalLayerPlan.js");
const lock_js_1 = require("./lock.js");
const OutputPlan_js_1 = require("./OutputPlan.js");
const StepTracker_js_1 = require("./StepTracker.js");
const atpe = typeof process !== "undefined" && process.env.ALWAYS_THROW_PLANNING_ERRORS;
const ALWAYS_THROW_PLANNING_ERRORS = atpe === "1";
const THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS = atpe === "2";
/**
 * Returns true for steps that the system populates automatically without executing.
 */
function isPrepopulatedStep(step) {
    return step instanceof index_js_1.__ItemStep || step instanceof index_js_1.__ValueStep;
}
if (atpe &&
    atpe !== "0" &&
    !(ALWAYS_THROW_PLANNING_ERRORS || THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS)) {
    throw new Error(`Invalid value for envvar 'ALWAYS_THROW_PLANNING_ERRORS' - expected '1' or '2', but received '${atpe}'`);
}
// Work around TypeScript CommonJS `graphql_1.isListType` unoptimal access.
const { assertObjectType, defaultFieldResolver, getNamedType, getNullableType, isEnumType, isInterfaceType, isListType, isNonNullType, isObjectType, isScalarType, isUnionType, } = graphql;
/**
 * This value allows the first few plans to take more time whilst the JIT warms
 * up - planning can easily go from 400ms down to 80ms after just a few
 * executions thanks to V8's JIT.
 */
let planningTimeoutWarmupMultiplier = 5;
const EMPTY_ARRAY = Object.freeze([]);
exports.POLYMORPHIC_ROOT_PATH = null;
exports.POLYMORPHIC_ROOT_PATHS = null;
Object.freeze(exports.POLYMORPHIC_ROOT_PATHS);
/** How many times will we try re-optimizing before giving up */
const MAX_OPTIMIZATION_LOOPS = 10;
const REASON_ROOT = Object.freeze({ type: "root" });
const OUTPUT_PLAN_TYPE_NULL = Object.freeze({ mode: "null" });
const OUTPUT_PLAN_TYPE_ARRAY = Object.freeze({ mode: "array" });
const newValueStepCallback = (isImmutable) => new index_js_1.__ValueStep(isImmutable);
const NO_ARGS = {
    get() {
        throw new Error(`This field doesn't have any arguments`);
    },
};
class OperationPlan {
    constructor(schema, operation, fragments, variableValuesConstraints, variableValues, contextConstraints, context, rootValueConstraints, rootValue, planningTimeout) {
        this.schema = schema;
        this.operation = operation;
        this.fragments = fragments;
        this.variableValues = variableValues;
        this.context = context;
        this.rootValue = rootValue;
        this.planningTimeout = planningTimeout;
        /**
         * What state is the OpPlan in?
         *
         * 1. init
         * 2. plan
         * 3. validate
         * 5. optimize
         * 6. finalize
         * 7. ready
         *
         * Once in 'ready' state we can execute the plan.
         */
        this.phase = "init";
        /**
         * Gets updated as we work our way through the plan, useful for making errors more helpful.
         */
        this.loc = index_js_1.isDev
            ? []
            : null /* forbid loc in production */;
        /** @internal */
        this.stepTracker = new StepTracker_js_1.StepTracker(this);
        /**
         * @internal
         */
        this.itemStepIdByListStepId = Object.create(null);
        /**
         * If true, then this operation doesn't use (custom) resolvers.
         */
        this.pure = true;
        this.startTime = timeSource_js_1.timeSource.now();
        this.previousLap = this.startTime;
        this.laps = [];
        this.optimizeMeta = new Map();
        /** @internal */
        this.valueNodeToStaticValueCache = new Map();
        /** @internal Use plan.getStep(id) instead. */
        this.getStep = index_js_1.isDev
            ? (id, requestingStep) => {
                if (!["plan", "validate", "optimize"].includes(this.phase)) {
                    throw new Error(`Getting a step during the '${this.phase}' phase is forbidden - please do so before or during the optimize phase.`);
                }
                // Check that requestingStep is allowed to get steps
                if (requestingStep.isOptimized &&
                    (this.phase !== "optimize" ||
                        !requestingStep.allowMultipleOptimizations)) {
                    throw new Error(`Optimized step ${requestingStep} is not permitted to request other steps (requested '${id}')`);
                }
                const step = this.stepTracker.getStepById(id);
                if (step == null) {
                    throw new Error(`Programming error: step with id '${id}' no longer exists (attempted access from ${requestingStep}). Most likely this means that ${requestingStep} has an illegal reference to this step, you should only maintain references to steps via dependencies.`);
                }
                return step[interfaces_js_1.$$proxy] ?? step;
            }
            : (id, _requestingStep) => {
                const step = this.stepTracker.getStepById(id);
                return step[interfaces_js_1.$$proxy] ?? step;
            };
        this.polymorphicLayerPlanByPathByLayerPlan = new Map();
        this._cacheStepStoreByLayerPlanAndActionKey = Object.create(null);
        this.variableValuesConstraints = variableValuesConstraints;
        this.contextConstraints = contextConstraints;
        this.rootValueConstraints = rootValueConstraints;
        this.scalarPlanInfo = { schema: this.schema };
        const queryType = schema.getQueryType();
        assert.ok(queryType, "Schema must have a query type");
        this.queryType = queryType;
        this.mutationType = schema.getMutationType() ?? null;
        this.subscriptionType = schema.getSubscriptionType() ?? null;
        const allTypes = Object.values(schema.getTypeMap());
        const allUnions = [];
        const allObjectTypes = [];
        this.unionsContainingObjectType = Object.create(null);
        for (const type of allTypes) {
            if (isUnionType(type)) {
                allUnions.push(type);
                const members = type.getTypes();
                for (const memberType of members) {
                    if (!this.unionsContainingObjectType[memberType.name]) {
                        this.unionsContainingObjectType[memberType.name] = [type];
                    }
                    else {
                        this.unionsContainingObjectType[memberType.name].push(type);
                    }
                }
            }
            else if (isObjectType(type)) {
                allObjectTypes.push(type);
                if (!this.unionsContainingObjectType[type.name]) {
                    this.unionsContainingObjectType[type.name] = [];
                }
            }
        }
        this.operationType = operation.operation;
        this.phase = "plan";
        this.rootLayerPlan = new LayerPlan_js_1.LayerPlan(this, null, REASON_ROOT);
        // Set up the shared steps for variables, context and rootValue
        [this.variableValuesStep, this.trackedVariableValuesStep] = this.track(variableValues, this.variableValuesConstraints, this.operation.variableDefinitions);
        [this.contextStep, this.trackedContextStep] = this.track(context, this.contextConstraints);
        [this.rootValueStep, this.trackedRootValueStep] = this.track(rootValue, this.rootValueConstraints);
        // this.rootLayerPlan.parentStep = this.trackedRootValueStep;
        this.deduplicateSteps();
        this.lap("init");
        // Plan the operation
        this.planOperation();
        this.checkTimeout();
        this.lap("planOperation");
        // Now perform hoisting (and repeat deduplication)
        this.hoistSteps();
        this.checkTimeout();
        this.lap("hoistSteps", "planOperation");
        if (index_js_1.isDev) {
            this.phase = "validate";
            this.resetCache();
            // Helpfully check steps don't do forbidden things.
            this.validateSteps();
            this.lap("validateSteps");
        }
        this.phase = "optimize";
        this.resetCache();
        // Get rid of temporary steps before `optimize` triggers side-effects.
        // (Critical due to steps that may have been discarded due to field errors
        // or similar.)
        this.stepTracker.treeShakeSteps();
        this.checkTimeout();
        this.lap("treeShakeSteps", "optimize");
        // Replace/inline/optimise steps
        tamedevil_1.default.batch(() => {
            this.optimizeSteps();
        });
        this.checkTimeout();
        this.lap("optimizeSteps");
        this.inlineSteps();
        this.checkTimeout();
        this.lap("inlineSteps");
        this.phase = "finalize";
        this.resetCache();
        this.stepTracker.finalizeSteps();
        // Get rid of steps that are no longer needed after optimising outputPlans
        // (we shouldn't see any new steps or dependencies after here)
        this.stepTracker.treeShakeSteps();
        this.checkTimeout();
        this.lap("treeShakeSteps", "finalize");
        // Now shove steps as deep down as they can go (opposite of hoist)
        this.pushDownSteps();
        this.checkTimeout();
        this.lap("pushDownSteps");
        // Plans are expected to execute later; they may take steps here to prepare
        // themselves (e.g. compiling SQL queries ahead of time).
        tamedevil_1.default.batch(() => {
            this.finalizeSteps();
        });
        this.lap("finalizeSteps");
        // Replace access plans with direct access, etc (must come after finalizeSteps)
        tamedevil_1.default.batch(() => {
            this.optimizeOutputPlans();
        });
        this.checkTimeout();
        this.lap("optimizeOutputPlans");
        // AccessSteps may have been removed
        this.stepTracker.treeShakeSteps();
        this.checkTimeout();
        this.lap("treeShakeSteps", "optimizeOutputPlans");
        this.stepTracker.finalizeOutputPlans();
        tamedevil_1.default.batch(() => {
            this.finalizeLayerPlans();
        });
        this.lap("finalizeLayerPlans");
        tamedevil_1.default.batch(() => {
            this.finalizeOutputPlans();
        });
        this.lap("finalizeOutputPlans");
        this.phase = "ready";
        this.resetCache();
        // this.walkFinalizedPlans();
        // this.preparePrefetches();
        const allMetaKeys = new Set();
        for (const step of this.stepTracker.activeSteps) {
            if (step.metaKey !== undefined) {
                allMetaKeys.add(step.metaKey);
            }
        }
        const allMetaKeysList = [...allMetaKeys];
        this.makeMetaByMetaKey = makeMetaByMetaKeysFactory(allMetaKeysList);
        this.lap("ready");
        const elapsed = timeSource_js_1.timeSource.now() - this.startTime;
        /*
        console.log(`Planning took ${elapsed.toFixed(1)}ms`);
        const entries: Array<{ process: string; duration: string }> = [];
        for (const lap of this.laps) {
          const elapsed = lap.elapsed;
          entries.push({
            process: `${lap.category}${
              lap.subcategory ? `[${lap.subcategory}]` : ``
            }`,
            duration: `${elapsed.toFixed(1)}ms`,
          });
        }
        console.table(entries);
        */
        // Allow this to be garbage collected
        this.optimizeMeta = null;
        context?.grafastMetricsEmitter?.emit("plan", {
            elapsed,
            laps: this.laps,
        });
        if (planningTimeoutWarmupMultiplier > 1) {
            planningTimeoutWarmupMultiplier = Math.max(1, planningTimeoutWarmupMultiplier - 0.5);
        }
    }
    lap(category, subcategory) {
        const now = timeSource_js_1.timeSource.now();
        const elapsed = now - this.previousLap;
        this.previousLap = now;
        this.laps.push({ category, subcategory, elapsed });
    }
    checkTimeout() {
        if (this.planningTimeout === null)
            return;
        const now = timeSource_js_1.timeSource.now();
        const elapsed = now - this.startTime;
        if (elapsed > this.planningTimeout * planningTimeoutWarmupMultiplier) {
            throw new index_js_1.SafeError("Operation took too long to plan and was aborted. Please simplify the request and try again.", {
                [interfaces_js_1.$$timeout]: this.planningTimeout,
                [interfaces_js_1.$$ts]: now,
            });
        }
    }
    /**
     * Called by the LayerPlan's constructor when it wants to get a new id to use.
     *
     * @internal
     */
    addLayerPlan(layerPlan) {
        return this.stepTracker.addLayerPlan(layerPlan);
    }
    /**
     * Adds a plan to the known steps and returns the number to use as the plan
     * id. ONLY to be used from Step, user code should never call this directly.
     *
     * @internal
     */
    _addStep(plan) {
        if (!["plan", "validate", "optimize"].includes(this.phase)) {
            throw new Error(`Creating a plan during the '${this.phase}' phase is forbidden.`);
        }
        return this.stepTracker.addStep(plan);
    }
    /**
     * Get a plan without specifying who requested it; this disables all the
     * caller checks. Only intended to be called from internal code.
     *
     * @internal
     */
    dangerouslyGetStep(id) {
        return this.stepTracker.getStepById(id);
    }
    planOperation() {
        try {
            switch (this.operationType) {
                case "query": {
                    this.planQuery();
                    break;
                }
                case "mutation": {
                    this.planMutation();
                    break;
                }
                case "subscription": {
                    this.planSubscription();
                    break;
                }
                default: {
                    const never = this.operationType;
                    throw new index_js_1.SafeError(`Unsupported operation type '${never}'.`);
                }
            }
        }
        catch (e) {
            // LOGGING: raise this somewhere critical
            if (this.loc != null) {
                console.error(`Error occurred during query planning (at ${this.loc.join(" > ")}): \n${e.stack || e}`);
            }
            else {
                console.error(`Error occurred during query planning: \n${e.stack || e}`);
            }
            throw new Error(`Query planning error: ${e.message}`, { cause: e });
        }
    }
    /**
     * Plans a GraphQL query operation.
     */
    planQuery() {
        if (this.loc !== null)
            this.loc.push("planQuery()");
        const rootType = this.queryType;
        if (!rootType) {
            throw new index_js_1.SafeError("No query type found in schema");
        }
        const locationDetails = {
            node: this.operation.selectionSet.selections,
            parentTypeName: null,
            // WHAT SHOULD fieldName be here?!
            fieldName: null,
        };
        const outputPlan = new OutputPlan_js_1.OutputPlan(this.rootLayerPlan, this.rootValueStep, {
            mode: "root",
            typeName: this.queryType.name,
        }, locationDetails);
        this.rootOutputPlan = outputPlan;
        this.planSelectionSet(outputPlan, [], exports.POLYMORPHIC_ROOT_PATH, exports.POLYMORPHIC_ROOT_PATHS, this.trackedRootValueStep, rootType, this.operation.selectionSet.selections, true);
        if (this.loc !== null)
            this.loc.pop();
    }
    /**
     * Implements the `PlanOpPlanMutation` algorithm.
     */
    planMutation() {
        if (this.loc !== null)
            this.loc.push("planMutation()");
        const rootType = this.mutationType;
        if (!rootType) {
            throw new index_js_1.SafeError("No mutation type found in schema");
        }
        this.deduplicateSteps();
        const locationDetails = {
            node: this.operation.selectionSet.selections,
            parentTypeName: null,
            // WHAT SHOULD fieldName be here?!
            fieldName: null,
        };
        const outputPlan = new OutputPlan_js_1.OutputPlan(this.rootLayerPlan, this.rootValueStep, {
            mode: "root",
            typeName: rootType.name,
        }, locationDetails);
        this.rootOutputPlan = outputPlan;
        this.planSelectionSet(outputPlan, [], exports.POLYMORPHIC_ROOT_PATH, exports.POLYMORPHIC_ROOT_PATHS, this.trackedRootValueStep, rootType, this.operation.selectionSet.selections, true, true);
        if (this.loc !== null)
            this.loc.pop();
    }
    /**
     * Implements the `PlanOpPlanSubscription` algorithm.
     */
    planSubscription() {
        if (this.loc !== null)
            this.loc.push("planSubscription");
        const rootType = this.subscriptionType;
        if (!rootType) {
            throw new index_js_1.SafeError("No subscription type found in schema");
        }
        const selectionSet = this.operation.selectionSet;
        const groupedFieldSet = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, graphqlCollectFields_js_1.graphqlCollectFields, null, this, this.trackedRootValueStep.id, rootType, selectionSet.selections, (0, graphqlCollectFields_js_1.newSelectionSetDigest)(false));
        if (groupedFieldSet.deferred !== undefined) {
            throw new index_js_1.SafeError("@defer forbidden on subscription root selection set");
        }
        let firstKey = undefined;
        for (const key of groupedFieldSet.fields.keys()) {
            if (firstKey !== undefined) {
                throw new index_js_1.SafeError("subscriptions may only have one top-level field");
            }
            firstKey = key;
        }
        assert.ok(firstKey != null, "selection set cannot be empty");
        const fields = groupedFieldSet.fields.get(firstKey);
        if (!fields) {
            throw new index_js_1.SafeError("Consistency error.");
        }
        // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
        const field = fields[0];
        const fieldName = field.name.value; // Unaffected by alias.
        const rootTypeFields = rootType.getFields();
        const fieldSpec = rootTypeFields[fieldName];
        const rawSubscriptionPlanResolver = fieldSpec.extensions?.grafast?.subscribePlan;
        const path = [field.alias?.value ?? fieldName];
        const locationDetails = {
            parentTypeName: rootType.name,
            fieldName,
            node: this.operation.selectionSet.selections,
        };
        const subscriptionPlanResolver = rawSubscriptionPlanResolver;
        const fieldArgsSpec = fieldSpec.args;
        const trackedArguments = fieldArgsSpec.length > 0
            ? (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, this.getTrackedArguments, this, fieldArgsSpec, field)
            : NO_ARGS;
        if (subscriptionPlanResolver !== undefined) {
            // PERF: optimize this
            const { haltTree, step: subscribeStep } = this.planField(rootType.name, fieldName, this.rootLayerPlan, path, exports.POLYMORPHIC_ROOT_PATHS, subscriptionPlanResolver, "subscribePlan", this.trackedRootValueStep, fieldSpec, trackedArguments, true);
            if (haltTree) {
                throw new index_js_1.SafeError("Failed to setup subscription");
            }
            this.rootLayerPlan.setRootStep(subscribeStep);
            const subscriptionEventLayerPlan = new LayerPlan_js_1.LayerPlan(this, this.rootLayerPlan, {
                type: "subscription",
            });
            const $__item = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(subscriptionEventLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, () => new index_js_1.__ItemStep(subscribeStep));
            subscriptionEventLayerPlan.setRootStep($__item);
            let streamItemPlan = (0, utils_js_1.hasItemPlan)(subscribeStep)
                ? (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(subscriptionEventLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, subscribeStep.itemPlan, subscribeStep, $__item)
                : $__item;
            // WE MUST RE-FETCH STEPS AFTER DEDUPLICATION!
            this.deduplicateSteps();
            streamItemPlan = this.stepTracker.getStepById(streamItemPlan.id);
            const outputPlan = new OutputPlan_js_1.OutputPlan(subscriptionEventLayerPlan, this.rootValueStep, { mode: "root", typeName: rootType.name }, locationDetails);
            this.rootOutputPlan = outputPlan;
            this.planSelectionSet(outputPlan, [], exports.POLYMORPHIC_ROOT_PATH, exports.POLYMORPHIC_ROOT_PATHS, streamItemPlan, rootType, selectionSet.selections, false);
        }
        else {
            const subscribeStep = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, () => {
                const $args = (0, index_js_1.object)(field.arguments?.reduce((memo, arg) => {
                    memo[arg.name.value] = trackedArguments.get(arg.name.value);
                    return memo;
                }, Object.create(null)) ?? Object.create(null));
                const rawResolver = fieldSpec.resolve;
                const rawSubscriber = fieldSpec.subscribe;
                return (0, graphqlResolver_js_1.graphqlResolver)(rawResolver, rawSubscriber, this.trackedRootValueStep, $args, {
                    fieldName,
                    fieldNodes: fields,
                    fragments: this.fragments,
                    operation: this.operation,
                    parentType: this.subscriptionType,
                    returnType: fieldSpec.type,
                    schema: this.schema,
                    // @ts-ignore
                    path: {
                        typename: this.subscriptionType.name,
                        key: fieldName,
                        prev: undefined,
                    },
                });
            });
            subscribeStep._stepOptions.stream = {};
            subscribeStep._stepOptions.walkIterable = true;
            this.rootLayerPlan.setRootStep(subscribeStep);
            const subscriptionEventLayerPlan = new LayerPlan_js_1.LayerPlan(this, this.rootLayerPlan, {
                type: "subscription",
            });
            const $__item = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(subscriptionEventLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, () => new index_js_1.__ItemStep(subscribeStep));
            subscriptionEventLayerPlan.setRootStep($__item);
            let streamItemPlan = (0, utils_js_1.hasItemPlan)(subscribeStep)
                ? (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(subscriptionEventLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, subscribeStep.itemPlan, subscribeStep, $__item)
                : $__item;
            // WE MUST RE-FETCH STEPS AFTER DEDUPLICATION!
            this.deduplicateSteps();
            streamItemPlan = this.stepTracker.getStepById(streamItemPlan.id);
            const outputPlan = new OutputPlan_js_1.OutputPlan(subscriptionEventLayerPlan, this.rootValueStep, { mode: "root", typeName: rootType.name }, locationDetails);
            this.rootOutputPlan = outputPlan;
            this.planSelectionSet(outputPlan, [], exports.POLYMORPHIC_ROOT_PATH, exports.POLYMORPHIC_ROOT_PATHS, streamItemPlan, rootType, selectionSet.selections, true);
        }
        if (this.loc !== null)
            this.loc.pop();
    }
    /**
     * Gets the item plan for a given parent list plan - this ensures we only
     * create one item plan per parent plan.
     */
    itemStepForListStep(parentLayerPlan, listStep, depth, stream) {
        const itemStepId = this.itemStepIdByListStepId[listStep.id];
        if (itemStepId !== undefined) {
            return this.stepTracker.getStepById(itemStepId);
        }
        // Create a new LayerPlan for this list item
        const layerPlan = new LayerPlan_js_1.LayerPlan(this, parentLayerPlan, {
            type: "listItem",
            parentStep: listStep,
            stream,
        });
        const itemPlan = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(layerPlan, listStep.polymorphicPaths, () => new index_js_1.__ItemStep(listStep, depth));
        layerPlan.setRootStep(itemPlan);
        this.itemStepIdByListStepId[listStep.id] = itemPlan.id;
        return itemPlan;
    }
    processGroupedFieldSet(
    // Deliberately shadows
    outputPlan, path, polymorphicPath, polymorphicPaths, parentStep, objectType, objectTypeFields, isMutation, groupedFieldSet) {
        // `__typename` shouldn't bump the mutation index since it has no side effects.
        let mutationIndex = -1;
        const $sideEffect = outputPlan.layerPlan.latestSideEffectStep;
        for (const [responseKey, fieldNodes] of groupedFieldSet.fields.entries()) {
            let resolverEmulation = groupedFieldSet.resolverEmulation;
            try {
                // All grouped fields are equivalent, as mandated by GraphQL validation rules. Thus we can take the first one.
                const field = fieldNodes[0];
                const fieldName = field.name.value;
                const locationDetails = {
                    parentTypeName: objectType.name,
                    fieldName,
                    node: fieldNodes,
                };
                // explicit matches are the fastest: https://jsben.ch/ajZNf
                if (fieldName === "__typename") {
                    outputPlan.addChild(objectType, responseKey, {
                        type: "__typename",
                        locationDetails,
                    });
                    continue;
                }
                else if (fieldName === "__schema" || fieldName === "__type") {
                    const variableNames = (0, utils_js_1.findVariableNamesUsed)(this, field);
                    outputPlan.addChild(objectType, responseKey, {
                        type: "outputPlan",
                        isNonNull: fieldName === "__schema",
                        outputPlan: new OutputPlan_js_1.OutputPlan(outputPlan.layerPlan, this.rootValueStep, {
                            mode: "introspection",
                            field,
                            variableNames,
                            // PERF: if variableNames.length === 0 we should be able to optimize this!
                            introspectionCacheByVariableValues: new lru_1.default({
                                maxLength: 3,
                            }),
                        }, locationDetails),
                        locationDetails,
                    });
                    continue;
                }
                const objectField = objectTypeFields[fieldName];
                if (!objectField) {
                    // Field does not exist; this should have been caught by validation
                    // but the spec says to just skip it.
                    continue;
                }
                const fieldType = objectField.type;
                const rawPlanResolver = objectField.extensions?.grafast?.plan;
                if (rawPlanResolver) {
                    resolverEmulation = false;
                    (0, utils_js_1.assertNotAsync)(rawPlanResolver, `${objectType.name}.${fieldName}.plan`);
                }
                const namedReturnType = getNamedType(fieldType);
                const resolvedResolver = objectField.resolve;
                const subscriber = objectField.subscribe;
                const usesDefaultResolver = resolvedResolver == null || resolvedResolver === defaultFieldResolver;
                const isPolymorphic = isUnionType(namedReturnType) || isInterfaceType(namedReturnType);
                // We should use a resolver if:
                // 1. they give us a non-default resolver
                // 2. we're emulating resolvers AND the field is polymorphic
                const resolver = resolvedResolver && !usesDefaultResolver
                    ? resolvedResolver
                    : resolverEmulation && isPolymorphic
                        ? defaultFieldResolver
                        : null;
                // Apply a default plan to fields that do not have a plan nor a resolver.
                const planResolver = rawPlanResolver ?? (resolver ? undefined : defaultPlanResolver_js_1.defaultPlanResolver);
                /*
                 *  When considering resolvers on fields, there's three booleans to
                 *  consider:
                 *
                 *  - typeIsPlanned: Does the type the field is defined on expect a plan?
                 *    - NOTE: the root types (Query, Mutation, Subscription) implicitly
                 *      expect the "root plan"
                 *  - fieldHasPlan: Does the field define a `plan()` method?
                 *  - resultIsPlanned: Does the named type that the field returns (the
                 *    "named field type") expect a plan?
                 *    - NOTE: only object types, unions and interfaces may expect plans;
                 *      but not all of them do.
                 *    - NOTE: a union/interface expects a plan iff ANY of its object
                 *      types expect plans
                 *    - NOTE: if ANY object type in an interface/union expects a plan
                 *      then ALL object types within the interface/union must expect
                 *      plans.
                 *    - NOTE: scalars and enums never expect a plan.
                 *
                 *  These booleans impact:
                 *
                 *  - Whether there must be a `plan()` declaration and what the "parent"
                 *    argument is to the same
                 *    - If typeIsPlanned:
                 *      - Assert: `fieldHasPlan` must be true
                 *      - Pass through the parent plan
                 *    - Else, if resultIsPlanned:
                 *      - Assert: `fieldHasPlan` must be true
                 *      - Pass through a `__ValueStep` representing the parent value.
                 *    - Else, if fieldHasPlan:
                 *      - Pass through a `__ValueStep` representing the parent value.
                 *    - Else
                 *      - No action necessary.
                 *  - If the field may define `resolve()` and what the "parent" argument
                 *    is to the same
                 *    - If resultIsPlanned
                 *      - Assert: there must not be a `resolve()`
                 *      - Grafast provides pure resolver.
                 *    - Else if fieldHasPlan (which may be implied by typeIsPlanned
                 *      above)
                 *      - If `resolve()` is not set:
                 *        - grafast will return the value from the plan directly
                 *      - Otherwise:
                 *        - Grafast will wrap this resolver and will call `resolve()` (or
                 *          default resolver) with the plan result.  IMPORTANT: you may
                 *          want to use an `ObjectStep` so that the parent object is of
                 *          the expected shape; e.g. your plan might return
                 *          `object({username: $username})` for a `User.username` field.
                 *    - Else
                 *      - Leave `resolve()` untouched - do not even wrap it.
                 *      - (Failing that, use a __ValueStep and return the result
                 *        directly.)
                 */
                if (resolver !== null) {
                    this.pure = false;
                    if (!rawPlanResolver) {
                        resolverEmulation = true;
                    }
                }
                const resultIsPlanned = (0, utils_js_1.isTypePlanned)(this.schema, namedReturnType);
                const fieldHasPlan = !!planResolver;
                if (resultIsPlanned &&
                    !fieldHasPlan &&
                    !objectType.extensions?.grafast?.assertStep) {
                    throw new Error(`Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; however this field has no plan() method to produce such a plan; please add 'extensions.grafast.plan' to this field.`);
                }
                if (resultIsPlanned && resolver) {
                    throw new Error(`Field ${objectType.name}.${fieldName} returns a ${namedReturnType.name} which expects a plan to be available; this means that ${objectType.name}.${fieldName} is forbidden from defining a GraphQL resolver.`);
                }
                let step;
                let haltTree = false;
                const fieldLayerPlan = isMutation
                    ? new LayerPlan_js_1.LayerPlan(this, outputPlan.layerPlan, {
                        type: "mutationField",
                        mutationIndex: ++mutationIndex,
                    })
                    : outputPlan.layerPlan;
                const objectFieldArgs = objectField.args;
                const trackedArguments = objectFieldArgs.length > 0
                    ? (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, this.getTrackedArguments, this, objectFieldArgs, field)
                    : NO_ARGS;
                const fieldPath = [...path, responseKey];
                let streamDetails = null;
                const isList = isListType(getNullableType(fieldType));
                if (isList) {
                    // read the @stream directive, if present
                    // TODO: Check SameStreamDirective still exists in @stream spec at release.
                    /*
                     * `SameStreamDirective`
                     * (https://github.com/graphql/graphql-spec/blob/26fd78c4a89a79552dcc0c7e0140a975ce654400/spec/Section%205%20--%20Validation.md#L450-L458)
                     * ensures that every field that has `@stream` must have the same
                     * `@stream` arguments; so we can just check the first node in the
                     * merged set to see our stream options. NOTE: if this changes before
                     * release then we may need to find the stream with the largest
                     * `initialCount` to figure what to do; something like:
                     *
                     *      const streamDirective = firstField.directives?.filter(
                     *        (d) => d.name.value === "stream",
                     *      ).sort(
                     *        (a, z) => getArg(z, 'initialCount', 0) - getArg(a, 'initialCount', 0)
                     *      )[0]
                     */
                    for (const n of fieldNodes) {
                        const streamDirective = n.directives?.find((d) => d.name.value === "stream");
                        if (streamDirective === undefined) {
                            // Undo any previous stream details; the non-@stream wins.
                            streamDetails = null;
                            break;
                        }
                        else if (streamDetails !== null) {
                            // Validation promises the values are the same
                            continue;
                        }
                        else {
                            // Create streamDetails
                            streamDetails = this.withRootLayerPlan(() => ({
                                initialCount: this.internalDependency((0, utils_js_1.directiveArgument)(this, streamDirective, "initialCount", graphql.Kind.INT) ?? (0, constant_js_1.constant)(0)),
                                if: this.internalDependency((0, utils_js_1.directiveArgument)(this, streamDirective, "if", graphql.Kind.BOOLEAN) ?? (0, constant_js_1.constant)(true)),
                                label: this.internalDependency((0, utils_js_1.directiveArgument)(this, streamDirective, "label", graphql.Kind.STRING) ?? (0, constant_js_1.constant)(undefined)),
                            }));
                        }
                    }
                }
                if (typeof planResolver === "function") {
                    ({ step, haltTree } = this.planField(objectType.name, fieldName, fieldLayerPlan, fieldPath, polymorphicPaths, planResolver, "plan", parentStep, objectField, trackedArguments, isList ? (streamDetails ?? false) : null));
                }
                else {
                    // No plan resolver (or plan resolver fallback) so there must be a
                    // `resolve` method, so we'll feed the full parent step into the
                    // resolver.
                    assert.ok(resolver !== null, "GraphileInternalError<81652257-617a-4d1a-8306-903d0e3d2ddf>: The field has no resolver, so planResolver should exist (either as the field.plan or as the default plan resolver).");
                    // ENHANCEMENT: should we do `step = parentStep.object()` (i.e.
                    // `$pgSelectSingle.record()`) or similar for "opaque" steps to become
                    // suitable for consumption by resolvers?
                    // Maybe `parentStep.forResolver()` or `parentStep.hydrate()` or `parentStep.toFullObject()`?
                    step = parentStep;
                }
                if (resolver !== null) {
                    step = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(fieldLayerPlan, polymorphicPaths, () => {
                        const $args = (0, index_js_1.object)(field.arguments?.reduce((memo, arg) => {
                            memo[arg.name.value] = trackedArguments.get(arg.name.value);
                            return memo;
                        }, Object.create(null)) ?? Object.create(null));
                        return (0, graphqlResolver_js_1.graphqlResolver)(resolver, subscriber, step, $args, {
                            fieldName,
                            fieldNodes,
                            fragments: this.fragments,
                            operation: this.operation,
                            parentType: objectType,
                            returnType: fieldType,
                            schema: this.schema,
                        });
                    });
                }
                // May have changed due to deduplicate
                step = this.stepTracker.getStepById(step.id);
                if (haltTree) {
                    const isNonNull = isNonNullType(fieldType);
                    outputPlan.addChild(objectType, responseKey, {
                        type: "outputPlan",
                        outputPlan: new OutputPlan_js_1.OutputPlan(fieldLayerPlan, step, OUTPUT_PLAN_TYPE_NULL, locationDetails),
                        isNonNull,
                        locationDetails,
                    });
                }
                else {
                    this.planIntoOutputPlan(outputPlan, fieldLayerPlan, fieldPath, polymorphicPath, polymorphicPaths, 
                    // If one field has a selection set, they all have a selection set (guaranteed by validation).
                    field.selectionSet != null
                        ? fieldNodes.flatMap((n) => n.selectionSet.selections)
                        : undefined, objectType, responseKey, fieldType, step, locationDetails, resolverEmulation, 0, streamDetails);
                }
            }
            finally {
                outputPlan.layerPlan.latestSideEffectStep = $sideEffect;
            }
        }
        if (groupedFieldSet.deferred !== undefined) {
            for (const deferred of groupedFieldSet.deferred) {
                const deferredLayerPlan = new LayerPlan_js_1.LayerPlan(this, outputPlan.layerPlan, {
                    type: "defer",
                    label: deferred.label,
                });
                const deferredOutputPlan = new OutputPlan_js_1.OutputPlan(deferredLayerPlan, outputPlan.rootStep, {
                    mode: "object",
                    deferLabel: deferred.label,
                    typeName: objectType.name,
                }, 
                // LOGGING: the location details should be tweaked to reference this
                // fragment
                outputPlan.locationDetails);
                const $sideEffect = deferredOutputPlan.layerPlan.latestSideEffectStep;
                try {
                    outputPlan.deferredOutputPlans.push(deferredOutputPlan);
                    this.processGroupedFieldSet(deferredOutputPlan, path, polymorphicPath, polymorphicPaths, parentStep, objectType, objectTypeFields, isMutation, deferred);
                }
                finally {
                    deferredOutputPlan.layerPlan.latestSideEffectStep = $sideEffect;
                }
            }
        }
    }
    /**
     *
     * @param outputPlan - The output plan that this selection set is being added to
     * @param path - The path within the outputPlan that we're adding stuff (only for root/object OutputPlans)
     * @param parentStep - The step that represents the selection set root
     * @param objectType - The object type that this selection set is being evaluated for (note polymorphic selection should already have been handled by this point)
     * @param selections - The GraphQL selections (fields, fragment spreads, inline fragments) to evaluate
     * @param isMutation - If true this selection set should be executed serially rather than in parallel (each field gets its own LayerPlan)
     */
    planSelectionSet(outputPlan, path, polymorphicPath, polymorphicPaths, parentStep, objectType, selections, resolverEmulation, isMutation = false) {
        if (this.loc !== null) {
            this.loc.push(`planSelectionSet(${objectType.name} @ ${outputPlan.layerPlan.id} @ ${path.join(".")} @ ${polymorphicPath ?? ""})`);
        }
        if (index_js_1.isDev) {
            assertObjectType(objectType);
        }
        const groupedFieldSet = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(outputPlan.layerPlan, polymorphicPaths, graphqlCollectFields_js_1.graphqlCollectFields, null, this, parentStep.id, objectType, selections, (0, graphqlCollectFields_js_1.newSelectionSetDigest)(resolverEmulation), isMutation);
        const objectTypeFields = objectType.getFields();
        this.processGroupedFieldSet(outputPlan, path, polymorphicPath, polymorphicPaths, parentStep, objectType, objectTypeFields, isMutation, groupedFieldSet);
        if (this.loc !== null)
            this.loc.pop();
    }
    internalDependency($step) {
        this.stepTracker.internalDependencies.add($step);
        return $step;
    }
    // Similar to the old 'planFieldReturnType'
    planIntoOutputPlan(parentOutputPlan, 
    // Typically this is parentOutputPlan.layerPlan; but in the case of mutationFields it isn't.
    parentLayerPlan, 
    // This is the LAYER-RELATIVE path, not the absolute path! It resets!
    path, polymorphicPath, polymorphicPaths, selections, parentObjectType, responseKey, fieldType, $step, locationDetails, resolverEmulation, listDepth, streamDetails) {
        const nullableFieldType = getNullableType(fieldType);
        const isNonNull = nullableFieldType !== fieldType;
        if (isListType(nullableFieldType)) {
            const $list = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(parentLayerPlan, polymorphicPaths, connection_js_1.itemsOrStep, null, $step);
            if ($list !== $step) {
                $list._stepOptions.stream = $step._stepOptions.stream;
            }
            $list._stepOptions.walkIterable = true;
            const listOutputPlan = new OutputPlan_js_1.OutputPlan(parentLayerPlan, $list, OUTPUT_PLAN_TYPE_ARRAY, locationDetails);
            parentOutputPlan.addChild(parentObjectType, responseKey, {
                type: "outputPlan",
                outputPlan: listOutputPlan,
                isNonNull,
                locationDetails,
            });
            const stream = streamDetails
                ? {
                    // These are already marked as internal dependencies
                    initialCountStepId: streamDetails.initialCount.id,
                    ifStepId: streamDetails.if.id,
                    labelStepId: streamDetails.label.id,
                }
                : undefined;
            let $__item = this.itemStepForListStep(parentLayerPlan, $list, listDepth, stream);
            const $sideEffect = $__item.layerPlan.latestSideEffectStep;
            try {
                let $item;
                if ((0, step_js_1.isListCapableStep)($list)) {
                    $item = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)($__item.layerPlan, $__item.polymorphicPaths, $list.listItem, $list, $__item);
                    this.deduplicateSteps();
                    // Refetch steps following deduplicate
                    $__item = this.stepTracker.getStepById($__item.id);
                    $item = this.stepTracker.getStepById($item.id);
                }
                else {
                    $item = $__item;
                }
                this.planIntoOutputPlan(listOutputPlan, $item.layerPlan, path, polymorphicPath, polymorphicPaths, selections, null, null, nullableFieldType.ofType, $item, locationDetails, resolverEmulation, listDepth + 1, null);
            }
            finally {
                $__item.layerPlan.latestSideEffectStep = $sideEffect;
            }
        }
        else if (isScalarType(nullableFieldType)) {
            const scalarPlanResolver = nullableFieldType.extensions?.grafast?.plan;
            const fnDescription = `${nullableFieldType.name}.plan`;
            (0, utils_js_1.assertNotAsync)(scalarPlanResolver, fnDescription);
            const $sideEffect = parentLayerPlan.latestSideEffectStep;
            try {
                const $leaf = typeof scalarPlanResolver === "function"
                    ? (0, utils_js_1.assertNotPromise)((0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(parentLayerPlan, polymorphicPaths, scalarPlanResolver, null, $step, this.scalarPlanInfo), scalarPlanResolver, fnDescription)
                    : $step;
                parentOutputPlan.addChild(parentObjectType, responseKey, {
                    type: "outputPlan",
                    isNonNull,
                    outputPlan: new OutputPlan_js_1.OutputPlan(parentLayerPlan, $leaf, {
                        mode: "leaf",
                        // stepId: $leaf.id,
                        graphqlType: nullableFieldType,
                    }, locationDetails),
                    locationDetails,
                });
            }
            finally {
                parentLayerPlan.latestSideEffectStep = $sideEffect;
            }
        }
        else if (isEnumType(nullableFieldType)) {
            const $sideEffect = parentLayerPlan.latestSideEffectStep;
            try {
                parentOutputPlan.addChild(parentObjectType, responseKey, {
                    type: "outputPlan",
                    isNonNull,
                    outputPlan: new OutputPlan_js_1.OutputPlan(parentLayerPlan, $step, {
                        mode: "leaf",
                        graphqlType: nullableFieldType,
                    }, locationDetails),
                    locationDetails,
                });
            }
            finally {
                parentLayerPlan.latestSideEffectStep = $sideEffect;
            }
        }
        else if (isObjectType(nullableFieldType)) {
            if (index_js_1.isDev) {
                // Check that the plan we're dealing with is the one the user declared
                /** Either an assertion function or a step class */
                const stepAssertion = nullableFieldType.extensions?.grafast?.assertStep;
                if (stepAssertion != null) {
                    try {
                        if (stepAssertion === index_js_1.Step ||
                            stepAssertion.prototype instanceof index_js_1.Step) {
                            if (!($step instanceof stepAssertion)) {
                                throw new Error(`Step mis-match: expected ${stepAssertion.name}, but instead found ${$step.constructor.name} (${$step})`);
                            }
                        }
                        else {
                            stepAssertion($step);
                        }
                    }
                    catch (e) {
                        throw new Error(`The step returned by '${path.join(".")}${"[]".repeat(listDepth)}' is not compatible with the GraphQL object type '${nullableFieldType.name}': ${e.message}`, { cause: e });
                    }
                }
                if (!selections) {
                    throw new Error(`GrafastInternalError<7fe4f7d1-01d2-4f1e-add6-5aa6936938c9>: no selections on a GraphQLObjectType?!`);
                }
            }
            let objectLayerPlan;
            if (isNonNull ||
                (parentLayerPlan.reason.type === "nullableBoundary" &&
                    parentLayerPlan.rootStep === $step)) {
                objectLayerPlan = parentLayerPlan;
            }
            else {
                // Find existing match
                const match = parentLayerPlan.children.find((clp) => clp.reason.type === "nullableBoundary" &&
                    clp.reason.parentStep === $step);
                if (match !== undefined) {
                    objectLayerPlan = match;
                }
                else {
                    objectLayerPlan = new LayerPlan_js_1.LayerPlan(this, parentLayerPlan, {
                        type: "nullableBoundary",
                        parentStep: $step,
                    });
                    objectLayerPlan.setRootStep($step);
                }
            }
            const $sideEffect = objectLayerPlan.latestSideEffectStep;
            try {
                const objectOutputPlan = new OutputPlan_js_1.OutputPlan(objectLayerPlan, $step, {
                    mode: "object",
                    deferLabel: undefined,
                    typeName: nullableFieldType.name,
                }, locationDetails);
                parentOutputPlan.addChild(parentObjectType, responseKey, {
                    type: "outputPlan",
                    outputPlan: objectOutputPlan,
                    isNonNull,
                    locationDetails,
                });
                this.planSelectionSet(objectOutputPlan, path, polymorphicPath, polymorphicPaths, $step, nullableFieldType, selections, resolverEmulation);
            }
            finally {
                objectLayerPlan.latestSideEffectStep = $sideEffect;
            }
        }
        else {
            // Polymorphic
            const isUnion = isUnionType(nullableFieldType);
            const isInterface = isInterfaceType(nullableFieldType);
            if (!(isUnion || isInterface)) {
                throw new Error(`GrafastInternalError<a54d6d63-d186-4ab9-9299-05f817894300>: Wasn't expecting ${nullableFieldType}`);
            }
            assert.ok(selections, "GrafastInternalError<d94e281c-1a10-463e-b7f5-2b0a3665d99b>: A polymorphic type with no selections is invalid");
            /*
             * Planning for polymorphic types is somewhat more complicated than for
             * other types.
             *
             * First, we figure out the list of `possibleTypes` based on the
             * union/interface and any other constraints that we know. NOTE: we can't
             * discount a type just because it doesn't have any fragments that apply
             * to it - instead we must still plan an empty selection set (or one just
             * using `{__typename}`), and we need to know it exists for that. See
             * https://github.com/graphql/graphql-spec/issues/951#issuecomment-1140957685
             */
            const allPossibleObjectTypes = isUnion
                ? nullableFieldType.getTypes()
                : this.schema.getImplementations(nullableFieldType).objects;
            if (allPossibleObjectTypes.length === 0) {
                /* If there are no implementations, simply stop via a null output plan */
                const nullOutputPlan = new OutputPlan_js_1.OutputPlan(parentLayerPlan, $step, OUTPUT_PLAN_TYPE_NULL, locationDetails);
                parentOutputPlan.addChild(parentObjectType, responseKey, {
                    type: "outputPlan",
                    outputPlan: nullOutputPlan,
                    isNonNull,
                    locationDetails,
                });
            }
            else {
                /*
                 * Next, we ensure we're dealing with a polymorphic step.
                 */
                if (!(0, step_js_1.isPolymorphicStep)($step)) {
                    throw new Error(`${$step} is not a polymorphic capable step, it must have a planForType method`);
                }
                /*
                 * An output plan for it (knows how to branch the different object
                 * output plans).
                 */
                const polymorphicOutputPlan = new OutputPlan_js_1.OutputPlan(parentLayerPlan, $step, {
                    mode: "polymorphic",
                    deferLabel: undefined,
                    typeNames: allPossibleObjectTypes.map((t) => t.name),
                }, locationDetails);
                parentOutputPlan.addChild(parentObjectType, responseKey, {
                    type: "outputPlan",
                    outputPlan: polymorphicOutputPlan,
                    isNonNull,
                    locationDetails,
                });
                /*
                 * Now a polymorphic layer plan for all the plans to live in
                 */
                const polymorphicLayerPlan = this.getPolymorphicLayerPlan(parentLayerPlan, path, $step, allPossibleObjectTypes);
                /*
                 * Now we need to loop through each type and plan it.
                 */
                const polyBase = polymorphicPath ?? "";
                const $oldStep = $step;
                for (const type of allPossibleObjectTypes) {
                    const $sideEffect = polymorphicLayerPlan.latestSideEffectStep;
                    try {
                        /* TODO: this $oldStep / $step dance turned out to be necessary
                         * because `$step` was being replaced in the following query against
                         * the graphilecrystaltest `polymorpic` schema; but I'm not sure this is the
                         * right behavior - shouldn't deduplication have been temporarily
                         * disabled during this?
                         *
                         * ```graphql
                         * {
                         *   allSingleTableItems {
                         *     nodes {
                         *       id
                         *       type
                         *       singleTableItemsByParentIdList {
                         *         id
                         *         position
                         *       }
                         *     }
                         *   }
                         * }
                         * ```
                         */
                        const $step = this.stepTracker.getStepById($oldStep.id);
                        // Bit of a hack, but saves passing it around through all the arguments
                        const newPolymorphicPath = `${polyBase}>${type.name}`;
                        polymorphicLayerPlan.reason.polymorphicPaths.add(newPolymorphicPath);
                        const newPolymorphicPaths = new Set();
                        newPolymorphicPaths.add(newPolymorphicPath);
                        const $root = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(polymorphicLayerPlan, newPolymorphicPaths, $step.planForType, $step, type);
                        const objectOutputPlan = new OutputPlan_js_1.OutputPlan(polymorphicLayerPlan, $root, {
                            mode: "object",
                            deferLabel: undefined,
                            typeName: type.name,
                        }, locationDetails);
                        // find all selections compatible with `type`
                        const fieldNodes = (0, graphqlMergeSelectionSets_js_1.fieldSelectionsForType)(this, type, selections);
                        this.planSelectionSet(objectOutputPlan, path, newPolymorphicPath, newPolymorphicPaths, $root, type, fieldNodes, false);
                        polymorphicOutputPlan.addChild(type, null, {
                            type: "outputPlan",
                            isNonNull,
                            outputPlan: objectOutputPlan,
                            locationDetails,
                        });
                    }
                    finally {
                        polymorphicLayerPlan.latestSideEffectStep = $sideEffect;
                    }
                }
            }
        }
    }
    getPolymorphicLayerPlan(parentLayerPlan, path, $step, allPossibleObjectTypes) {
        // OPTIMIZE: I added the $step.id to pathString to fix a planning issue; but maybe we can do this without branching?
        // https://github.com/benjie/crystal/issues/109
        const pathString = `${path.join("|")}!${$step.id}`;
        const polymorphicLayerPlanByPath = this.polymorphicLayerPlanByPathByLayerPlan.get(parentLayerPlan) ??
            new Map();
        if (polymorphicLayerPlanByPath.size === 0) {
            this.polymorphicLayerPlanByPathByLayerPlan.set(parentLayerPlan, polymorphicLayerPlanByPath);
        }
        const prev = polymorphicLayerPlanByPath.get(pathString);
        if (prev !== undefined) {
            // NOTE: this is typically hit when you have a polymorphic field inside
            // another polymorphic field - in these cases rather than having the
            // polymorphism multiply out, we can aim for fewer polymorphic buckets
            // keeping the plan simpler (and more efficient).
            const { stepId, layerPlan } = prev;
            const stepByStepId = this.stepTracker.getStepById(stepId);
            const stepBy$stepId = this.stepTracker.getStepById($step.id);
            if (stepByStepId !== stepBy$stepId) {
                throw new Error(`GrafastInternalError<e01bdc40-7c89-41c6-8d84-56efa22c872a>: unexpected inconsistency when determining the polymorphic LayerPlan to use (pathString = ${pathString}, ${stepByStepId} (${stepId}) != ${stepBy$stepId} (${$step.id}))`);
            }
            for (const t of allPossibleObjectTypes) {
                if (!layerPlan.reason.typeNames.includes(t.name)) {
                    // Since we're re-using an existing LayerPlan, we should be careful to
                    // ensure none of the previous assumptions have been broken.
                    layerPlan.reason.typeNames.push(t.name);
                }
            }
            return layerPlan;
        }
        else {
            const layerPlan = new LayerPlan_js_1.LayerPlan(this, parentLayerPlan, {
                type: "polymorphic",
                typeNames: allPossibleObjectTypes.map((t) => t.name),
                parentStep: $step,
                polymorphicPaths: new Set(),
            });
            polymorphicLayerPlanByPath.set(pathString, {
                stepId: $step.id,
                layerPlan,
            });
            return layerPlan;
        }
    }
    planField(typeName, fieldName, layerPlan, path, polymorphicPaths, planResolver, applyAfterMode, rawParentStep, field, trackedArguments, 
    // If 'true' this is a subscription rather than a stream
    // If 'false' this is a list but it will never stream
    // If 'null' this is neither subscribe field nor list field
    // Otherwise, it's a list field that has the `@stream` directive applied
    streamDetails, deduplicate = true) {
        const coordinate = `${typeName}.${fieldName}`;
        // The step may have been de-duped whilst sibling steps were planned
        // PERF: this should be handled in the parent?
        const parentStep = this.stepTracker.getStepById(rawParentStep.id);
        const previousStepCount = this.stepTracker.stepCount;
        const previousSideEffectStep = layerPlan.latestSideEffectStep;
        if (this.loc !== null)
            this.loc.push(`planField(${path.join(".")})`);
        try {
            let step = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(layerPlan, polymorphicPaths, operationPlan_input_js_1.withFieldArgsForArguments, null, this, trackedArguments, field, parentStep, applyAfterMode, coordinate, (fieldArgs) => planResolver(parentStep, fieldArgs, {
                fieldName,
                field,
                schema: this.schema,
            }));
            let haltTree = false;
            if (step === null || (step instanceof constant_js_1.ConstantStep && step.isNull())) {
                // Constantly null; do not step any further in this tree.
                step =
                    step ||
                        // `withGlobalLayerPlan(layerPlan, polymorphicPaths, () => constant(null))` but with reduced memory allocation
                        (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(layerPlan, polymorphicPaths, constant_js_1.constant, null, null);
                haltTree = true;
            }
            (0, step_js_1.assertExecutableStep)(step);
            if (streamDetails === true) {
                // subscription
                step._stepOptions.stream = {};
                step._stepOptions.walkIterable = true;
            }
            else if (streamDetails === false) {
                step._stepOptions.walkIterable = true;
            }
            else if (streamDetails != null) {
                step._stepOptions.stream = {
                    initialCountStepId: streamDetails.initialCount.id,
                    ifStepId: streamDetails.if.id,
                    labelStepId: streamDetails.label.id,
                };
                step._stepOptions.walkIterable = true;
            }
            if (deduplicate) {
                // Now that the field has been planned (including arguments, but NOT
                // including selection set) we can deduplicate it to see if any of its
                // peers are identical.
                this.deduplicateSteps();
                // After deduplication, this step may have been substituted; get the
                // updated reference.
                step = this.stepTracker.getStepById(step.id);
            }
            return { step, haltTree };
        }
        catch (e) {
            if (ALWAYS_THROW_PLANNING_ERRORS) {
                throw e;
            }
            if (THROW_PLANNING_ERRORS_ON_SIDE_EFFECTS) {
                for (let i = previousStepCount; i < this.stepTracker.stepCount; i++) {
                    const step = this.stepTracker.stepById[i];
                    if (step && step.hasSideEffects) {
                        throw e;
                    }
                }
            }
            try {
                this.stepTracker.purgeBackTo(previousStepCount);
                layerPlan.latestSideEffectStep = previousSideEffectStep;
            }
            catch (e2) {
                console.error(`Cleanup error occurred whilst trying to recover from field planning error: ${e2.stack}`);
                throw e;
            }
            const step = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(layerPlan, polymorphicPaths, index_js_1.error, null, e);
            const haltTree = true;
            // PERF: consider deleting all steps that were allocated during this. For
            // now we'll just rely on tree-shaking.
            return { step, haltTree };
        }
        finally {
            if (this.loc !== null)
                this.loc.pop();
        }
    }
    /**
     * A replacement for GraphQL's
     * `CoerceArgumentValues` that factors in tracked variables.
     *
     * @see https://spec.graphql.org/draft/#CoerceArgumentValues()
     */
    getTrackedArguments(argumentDefinitions, field) {
        const argumentValues = field.arguments;
        const trackedArgumentValues = Object.create(null);
        for (const argumentDefinition of argumentDefinitions) {
            const argumentName = argumentDefinition.name;
            if (index_js_1.isDev && trackedArgumentValues[argumentName]) {
                throw new index_js_1.SafeError(`Argument name '${argumentName}' seen twice; aborting.`);
            }
            const argumentType = argumentDefinition.type;
            const defaultValue = argumentDefinition.defaultValue
                ? (0, utils_js_1.defaultValueToValueNode)(argumentType, argumentDefinition.defaultValue)
                : undefined;
            const argumentValue = argumentValues?.find((v) => v.name.value === argumentName);
            const argumentPlan = (0, input_js_1.inputStep)(this, argumentType, argumentValue?.value, defaultValue);
            trackedArgumentValues[argumentName] = argumentPlan;
        }
        return {
            get(name) {
                return trackedArgumentValues[name];
            },
        };
    }
    /**
     * Sets up tracking for the given value (variableValues, context, rootValue).
     */
    track(value, constraints, variableDefinitions) {
        const valueStep = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, newValueStepCallback, null, variableDefinitions != null);
        const trackedObjectStep = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, () => new index_js_1.__TrackedValueStep(value, valueStep, constraints, [], variableDefinitions != null, variableDefinitions));
        return [valueStep, trackedObjectStep];
    }
    /**
     * Checks that no step has a property on it whose value is another step. It
     * should addDependency instead.
     */
    validateSteps(offset = 0) {
        const errors = [];
        for (const step of this.stepTracker.activeSteps) {
            if (step.id < offset)
                continue;
            for (const key in step) {
                const val = step[key];
                if (key !== "implicitSideEffectStep" &&
                    val instanceof index_js_1.Step) {
                    errors.push(new Error(`ERROR: ExecutableStep ${step} has illegal reference via property '${key}' to step ${val}. You must not reference steps directly, instead add the step as a dependency (\`depId = this.addDependency($step)\`) and use \`this.getDep(depId)\` to look the step up (or, if the step is not a dependency, store the step ID and use \`this.getStep(stepId)\` each time you need to reference it). Failure to comply could result in subtle breakage during optimisation.`));
                }
            }
        }
        if (errors.length > 0) {
            console.error(errors.map((e) => e.message).join("\n"));
            throw errors[0];
        }
    }
    replaceStep($original, $replacement) {
        this.stepTracker.replaceStep($original, $replacement);
    }
    processStep(actionDescription, order, isReadonly, callback, processed, step) {
        // MUST come before anything else, otherwise infinite loops may occur
        processed.add(step);
        if (!this.stepTracker.activeSteps.has(step)) {
            return step;
        }
        if (order === "dependents-first") {
            // used for: pushDown, optimize
            for (let i = 0; i < step.dependents.length; i++) {
                const entry = step.dependents[i];
                const { step: $processFirst } = entry;
                if (!processed.has($processFirst)) {
                    this.processStep(actionDescription, order, isReadonly, callback, processed, $processFirst);
                    if (step.dependents[i] !== entry) {
                        // The world has change; go back to the start
                        i = -1;
                    }
                }
            }
            const subroutineLayerPlan = step[interfaces_js_1.$$subroutine];
            if (subroutineLayerPlan !== null) {
                const $root = subroutineLayerPlan.rootStep;
                if ($root) {
                    this.processStep(actionDescription, order, isReadonly, callback, processed, $root);
                }
            }
        }
        else {
            // used for: hoist
            for (const $processFirst of (0, utils_js_1.sudo)(step).dependencies) {
                if (!processed.has($processFirst)) {
                    this.processStep(actionDescription, order, isReadonly, callback, processed, $processFirst);
                }
            }
        }
        // Check again, processing another step may have invalidated this one.
        if (!this.stepTracker.activeSteps.has(step)) {
            return step;
        }
        let replacementStep = step;
        try {
            replacementStep = (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(step.layerPlan, step.polymorphicPaths, callback, this, step);
        }
        catch (e) {
            console.error(`Error occurred during ${actionDescription}; whilst processing ${step} in ${order} mode an error occurred:`, e);
            throw e;
        }
        if (!replacementStep) {
            throw new Error(`The callback did not return a step during ${actionDescription}`);
        }
        if (isReadonly) {
            if (replacementStep !== step) {
                throw new Error(`Replacing step in readonly mode is not permitted!`);
            }
        }
        else {
            if (replacementStep !== step) {
                this.replaceStep(step, replacementStep);
            }
            this.deduplicateSteps();
        }
        return replacementStep;
    }
    // PERF: optimize
    /**
     * Process the given steps, either dependencies first (root to leaf) or
     * dependents first (leaves to root).
     *
     * @internal
     */
    processSteps(actionDescription, order, isReadonly, callback) {
        if (index_js_1.isDev)
            this.stepTracker.lockNewSteps();
        const previousStepCount = this.stepTracker.stepCount;
        const processed = new Set();
        for (let i = 0; i < this.stepTracker.stepCount; i++) {
            const step = this.stepTracker.getStepById(i, true);
            // Check it hasn't been tree-shaken away, or already processed
            if (!step || step.id !== i || processed.has(step))
                continue;
            const resultStep = this.processStep(actionDescription, order, isReadonly, callback, processed, step);
            if (index_js_1.isDev) {
                const plansAdded = this.stepTracker.stepCount - previousStepCount;
                // NOTE: whilst processing steps new steps may be added, thus we must loop
                // ascending and we must re-evaluate this.stepTracker.stepCount on each loop
                // iteration.
                if (plansAdded > 100000) {
                    throw new Error(`Whilst processing steps as part of ${actionDescription}Plans, ${plansAdded} new steps have been created... That seems like it's likely a bug in the relevant method of one of your steps. The last plan processed was ${resultStep}`);
                }
            }
            if ((isReadonly || index_js_1.isDev) &&
                this.stepTracker.stepCount > previousStepCount) {
                if (isReadonly) {
                    throwNoNewStepsError(this, actionDescription, step, previousStepCount, "Creating steps in isReadonly mode is forbidden");
                }
                if (index_js_1.isDev)
                    this.stepTracker.lockNewSteps();
            }
        }
        if (!isReadonly &&
            this.phase !== "plan" &&
            this.stepTracker.stepCount > previousStepCount) {
            // Any time new steps are added we should validate them. All plans are
            // validated once "plan" is finished, so no need to do it here for that
            // phase.
            this.validateSteps(previousStepCount);
        }
    }
    /**
     * Peers are steps of the same type (but not the same step!) that are in
     * compatible layers and have the same dependencies. Peers must not have side
     * effects. A step is not its own peer.
     */
    getPeers(step) {
        if (step.hasSideEffects) {
            // Plans with side effects have no peers.
            return EMPTY_ARRAY;
        }
        if (step._stepOptions.stream) {
            // Streams have no peers - we cannot reference the stream more
            // than once (and we aim to not cache the stream because we want its
            // entries to be garbage collected).
            //
            // HOWEVER! There may be lifecycle parts that need to be called... So
            // call the function with an empty array; ignore the result.
            return EMPTY_ARRAY;
        }
        // NOTE: Streams have no peers - we cannot reference the stream more than
        // once (and we aim to not cache the stream because we want its entries to
        // be garbage collected) - however if we're already fetching the list then
        // we shouldn't fetch it again via stream... We should deduplicate a stream
        // to return a non-stream.
        if (step._stepOptions.stream != null) {
            // TODO: remove this if block when we implement the new stream/defer -
            // deduplicating a stream should be fine. (Not subscriptions though - may
            // need a check for that!)
            return EMPTY_ARRAY;
        }
        if (this.stepTracker.internalDependencies.has(step)) {
            // PERF: we need to set up correct tracking, then internal deps can be deduped
            return EMPTY_ARRAY;
        }
        const sstep = (0, utils_js_1.sudo)(step);
        const { dependencies: deps, dependencyForbiddenFlags: flags, dependencyOnReject: onReject, layerPlan: layerPlan, constructor: stepConstructor, peerKey, } = sstep;
        // const streamInitialCount = sstep._stepOptions.stream?.initialCount;
        const dependencyCount = deps.length;
        if (dependencyCount === 0) {
            let allPeers = null;
            const stepsWithNoDependencies = this.stepTracker.stepsWithNoDependenciesByConstructor.get(step.constructor) ?? new Set();
            for (const possiblyPeer of stepsWithNoDependencies) {
                if (possiblyPeer !== step &&
                    !possiblyPeer.hasSideEffects &&
                    possiblyPeer.layerPlan === layerPlan &&
                    possiblyPeer._stepOptions.stream == null &&
                    possiblyPeer.peerKey === peerKey
                // && possiblyPeer._stepOptions.stream?.initialCount === streamInitialCount
                ) {
                    if (allPeers === null) {
                        allPeers = [possiblyPeer];
                    }
                    else {
                        allPeers.push(possiblyPeer);
                    }
                }
            }
            return allPeers === null ? EMPTY_ARRAY : allPeers;
        }
        else if (dependencyCount === 1) {
            // Optimized form for steps that have one dependency (extremely common!)
            const dependencyIndex = 0;
            const { ancestry, deferBoundaryDepth } = layerPlan;
            const dep = deps[dependencyIndex];
            const dl = dep.dependents.length;
            if (dl === 1) {
                // We're the only dependent; therefore we have no peers (since peers
                // share dependencies)
                return EMPTY_ARRAY;
            }
            const minDepth = Math.max(deferBoundaryDepth, dep.layerPlan.depth);
            let allPeers = null;
            for (const { dependencyIndex: peerDependencyIndex, step: rawPossiblyPeer, } of dep.dependents) {
                if (peerDependencyIndex !== dependencyIndex ||
                    rawPossiblyPeer === step ||
                    rawPossiblyPeer.hasSideEffects ||
                    rawPossiblyPeer._stepOptions.stream != null ||
                    rawPossiblyPeer.constructor !== stepConstructor ||
                    rawPossiblyPeer.peerKey !== peerKey
                // || rawPossiblyPeer._stepOptions.stream?.initialCount !== streamInitialCount
                ) {
                    continue;
                }
                const possiblyPeer = (0, utils_js_1.sudo)(rawPossiblyPeer);
                const { layerPlan: peerLayerPlan, dependencyForbiddenFlags: peerFlags, dependencyOnReject: peerOnReject, } = possiblyPeer;
                if (peerLayerPlan.depth >= minDepth &&
                    possiblyPeer.dependencies.length === dependencyCount &&
                    peerLayerPlan === ancestry[peerLayerPlan.depth] &&
                    peerFlags[dependencyIndex] === flags[dependencyIndex] &&
                    peerOnReject[dependencyIndex] === onReject[dependencyIndex]) {
                    if (allPeers === null) {
                        allPeers = [possiblyPeer];
                    }
                    else {
                        allPeers.push(possiblyPeer);
                    }
                }
            }
            return allPeers === null ? EMPTY_ARRAY : allPeers;
        }
        else {
            const { ancestry, deferBoundaryDepth } = layerPlan;
            /**
             * "compatible" layer plans are calculated by walking up the layer plan tree,
             * however:
             *
             * - do not pass the LayerPlan of one of the dependencies
             * - do not pass a "deferred" layer plan
             *
             * Compatible layer plans are no less deep than minDepth.
             */
            let minDepth = deferBoundaryDepth;
            const possiblePeers = [];
            // Loop backwards since last dependency is most likely to be most unique
            for (let dependencyIndex = dependencyCount - 1; dependencyIndex >= 0; dependencyIndex--) {
                const dep = deps[dependencyIndex];
                const dl = dep.dependents.length;
                if (dl === 1) {
                    // We're the only dependent; therefore we have no peers (since peers
                    // share dependencies)
                    return EMPTY_ARRAY;
                }
                if (dependencyIndex === dependencyCount - 1) {
                    // Check the final dependency - this is likely to have the fewest
                    // dependents (since it was added last it's more likely to be
                    // unique).
                    for (const { dependencyIndex: peerDependencyIndex, step: rawPossiblyPeer, } of dep.dependents) {
                        if (peerDependencyIndex !== dependencyIndex ||
                            rawPossiblyPeer === step ||
                            rawPossiblyPeer.hasSideEffects ||
                            rawPossiblyPeer._stepOptions.stream != null ||
                            rawPossiblyPeer.constructor !== stepConstructor ||
                            rawPossiblyPeer.peerKey !== peerKey
                        // || rawPossiblyPeer._stepOptions.stream?.initialCount !== streamInitialCount
                        ) {
                            continue;
                        }
                        const possiblyPeer = (0, utils_js_1.sudo)(rawPossiblyPeer);
                        const { layerPlan: peerLayerPlan, dependencyForbiddenFlags: peerFlags, dependencyOnReject: peerOnReject, dependencies: peerDependencies, } = possiblyPeer;
                        if (peerDependencies.length === dependencyCount &&
                            peerLayerPlan === ancestry[peerLayerPlan.depth] &&
                            peerFlags[dependencyIndex] === flags[dependencyIndex] &&
                            peerOnReject[dependencyIndex] === onReject[dependencyIndex]) {
                            possiblePeers.push(possiblyPeer);
                        }
                    }
                }
                const d = dep.layerPlan.depth;
                if (d > minDepth) {
                    minDepth = d;
                }
            }
            if (possiblePeers.length === 0) {
                return EMPTY_ARRAY;
            }
            let allPeers = null;
            outerloop: for (const possiblyPeer of possiblePeers) {
                if (possiblyPeer.layerPlan.depth < minDepth)
                    continue;
                // We know the final dependency matches and the dependency count
                // matches - check the other dependencies match.
                for (let i = 0; i < dependencyCount - 1; i++) {
                    if (deps[i] !== (0, utils_js_1.sudo)(possiblyPeer).dependencies[i]) {
                        continue outerloop;
                    }
                }
                if (allPeers === null) {
                    allPeers = [possiblyPeer];
                }
                else {
                    allPeers.push(possiblyPeer);
                }
            }
            return allPeers === null ? EMPTY_ARRAY : allPeers;
        }
    }
    isImmoveable(step) {
        if (step.hasSideEffects) {
            return true;
        }
        if (isPrepopulatedStep(step)) {
            return true;
        }
        if (step[interfaces_js_1.$$subroutine] !== null) {
            // Don't hoist steps that are the parent of a subroutine
            // PERF: we _should_ be able to hoist, but care must be taken. Currently it causes test failures.
            return true;
        }
        return false;
    }
    /**
     * Attempts to hoist the step into a higher layerPlan to maximize
     * deduplication.
     */
    hoistStep(step) {
        if (this.isImmoveable(step)) {
            return;
        }
        // PERF: would be nice to prevent ConstantStep from being hoisted - we
        // don't want to keep multiplying up and up its data as it traverses the buckets - would be better
        // to push the step down to the furthest level and then have it run there straight away.
        // PERF: actually... might be better to specifically replace all
        // ConstantStep dependencies with a bucket-local ConstantStep as one of the
        // final steps of optimize.
        /* // This is disabled because it breaks pgSelect's `mergePlaceholdersInto` logic.
        if (step instanceof __InputStaticLeafStep || step instanceof ConstantStep) {
          // More optimal to not hoist these - they convert to `constant()` which executes to produce a filled array incredibly efficiently.
          return true;
        }
        */
        if (step.layerPlan.parentLayerPlan?.reason.type === "mutationField") {
            // Never hoist into a mutation layer
            return;
        }
        switch (step.layerPlan.reason.type) {
            case "root": {
                // There is no higher layerPlan
                return;
            }
            case "subscription":
            case "defer": {
                // Should be deferred, don't evaluate early (unless it's cheap to do so)
                if (step.isSyncAndSafe) {
                    // It's cheap, try and hoist it
                    break;
                }
                else {
                    return;
                }
            }
            case "polymorphic": {
                // May only need to be evaluated for certain types, so avoid hoisting anything expensive.
                if (step.isSyncAndSafe &&
                    step.polymorphicPaths.size ===
                        step.layerPlan.reason.polymorphicPaths.size) {
                    // It's cheap and covers all types, try and hoist it.
                    // NOTE: I have concerns about whether this is safe or not, but I
                    // have not been able to come up with a counterexample that is
                    // unsafe. Should we do so, we should remove this.
                    break;
                }
                else if (step instanceof index_js_1.__FlagStep) {
                    break;
                }
                else {
                    return;
                }
            }
            case "subroutine": {
                // Should be safe to hoist.
                break;
            }
            case "nullableBoundary": {
                // Safe to hoist _unless_ it depends on the root step of the nullableBoundary.
                const $root = step.layerPlan.reason.parentStep;
                if ((0, utils_js_1.sudo)(step).dependencies.includes($root)) {
                    return;
                }
                else {
                    break;
                }
            }
            case "listItem": {
                // Should be safe to hoist so long as it doesn't depend on the
                // `__ItemStep` itself (which is just a regular dependency, so it'll be
                // checked later).
                // NOTE: this is true even if the listItem streams.
                break;
            }
            case "mutationField": {
                // NOTE: It's the user's responsibility to ensure that steps that have
                // side effects are marked as such via `step.hasSideEffects = true`.
                if (step.isSyncAndSafe && !step.hasSideEffects) {
                    if (step.layerPlan.reason.mutationIndex === 0) {
                        // Safe to hoist inside first mutation; but all later mutations may be impacted by previous actions.
                        break;
                    }
                    // OPTIMIZE: figure out under which circumstances it is safe to hoist here.
                    // break;
                    return;
                }
                else if (step instanceof index_js_1.__FlagStep) {
                    break;
                }
                else {
                    // Plans that rely on external state shouldn't be hoisted because
                    // their results may change after a mutation, so the mutation should
                    // run first.
                    return;
                }
            }
            default: {
                const never = step.layerPlan.reason;
                throw new Error(`GrafastInternalError<81e3a7d4-aaa0-416b-abbb-a887734007bc>: unhandled layer plan reason ${(0, inspect_js_1.inspect)(never)}`);
            }
        }
        // Finally, check that none of its dependencies are in the same bucket.
        const deps = (0, utils_js_1.sudo)(step).dependencies;
        if (deps.some((dep) => dep.layerPlan === step.layerPlan)) {
            return;
        }
        // All our checks passed, hoist it.
        assert.ok(step.layerPlan.parentLayerPlan !== null, "GrafastInternalError<55c8940f-e8ac-4985-8b34-96fc6f81d62d>: A non-root layer plan had no parent?!");
        // 1: adjust polymorphicPaths to fit new layerPlan
        if (step.layerPlan.reason.type === "polymorphic") {
            // PERF: this is cacheable
            /** The closest ancestor layer plan that is polymorphic */
            let ancestor = step.layerPlan;
            while ((ancestor = ancestor.parentLayerPlan)) {
                if (ancestor.reason.type === "polymorphic") {
                    break;
                }
            }
            const parentPolymorphicPaths = ancestor
                ? ancestor.reason
                    .polymorphicPaths
                : exports.POLYMORPHIC_ROOT_PATHS;
            const myPaths = [...step.polymorphicPaths];
            if (parentPolymorphicPaths?.has(myPaths[0])) {
                // All the others must be valid too
            }
            else if (parentPolymorphicPaths === null) {
                step.polymorphicPaths = null;
            }
            else {
                const layerPaths = [...step.layerPlan.reason.polymorphicPaths];
                const newPaths = new Set();
                for (const path of parentPolymorphicPaths) {
                    const prefix = path + ">";
                    const matches = myPaths.filter((p) => p.startsWith(prefix));
                    const layerMatches = layerPaths.filter((p) => p.startsWith(prefix));
                    if (matches.length !== layerMatches.length) {
                        // Can't hoist because it's not used for all polymorphicPaths of this type
                        return;
                    }
                    else if (matches.length > 0) {
                        newPaths.add(path);
                    }
                }
                step.polymorphicPaths = newPaths;
            }
        }
        const $subroutine = step.layerPlan.reason.type === "subroutine"
            ? step.layerPlan.reason.parentStep
            : null;
        // 2: move it up a layer
        this.stepTracker.moveStepToLayerPlan(step, step.layerPlan.parentLayerPlan);
        // 3: if it's was in a subroutine, the subroutine parent plan needs to list it as a dependency
        if ($subroutine) {
            // Naughty naughty
            $subroutine.addDependency(step);
        }
        // Now try and hoist it again!
        this.hoistStep(step);
    }
    /**
     * Attempts to push the step into the lowest layerPlan to minimize the need
     * for copying between layer plans.
     */
    pushDown(step) {
        if (this.isImmoveable(step)) {
            return step;
        }
        if (step._isUnary) {
            step._isUnaryLocked = true;
            // Don't push unary steps down
            return step;
        }
        switch (step.layerPlan.reason.type) {
            case "root":
            case "subscription":
            case "defer":
            case "polymorphic":
            case "subroutine":
            case "nullableBoundary":
            case "listItem": {
                // Fine to push lower
                break;
            }
            case "mutationField": {
                // NOTE: It's the user's responsibility to ensure that steps that have
                // side effects are marked as such via `step.hasSideEffects = true`.
                if (step.isSyncAndSafe && !step.hasSideEffects) {
                    break;
                }
                else {
                    // Side effects should take place inside the mutation field plan
                    // (that's the whole point), so we should not push these down.
                    return step;
                }
            }
            default: {
                const never = step.layerPlan.reason;
                throw new Error(`GrafastInternalError<81e3a7d4-aaa0-416b-abbb-a887734009bc>: unhandled layer plan reason ${(0, inspect_js_1.inspect)(never)}`);
            }
        }
        // Now find the lowest bucket that still satisfies all of it's dependents.
        const dependentLayerPlans = new Set();
        const outputPlans = this.stepTracker.outputPlansByRootStep.get(step);
        if (outputPlans !== undefined) {
            for (const outputPlan of outputPlans) {
                if (outputPlan.layerPlan === step.layerPlan) {
                    return step;
                }
                else {
                    dependentLayerPlans.add(outputPlan.layerPlan);
                }
            }
        }
        for (const { step: s } of step.dependents) {
            if (s.layerPlan === step.layerPlan) {
                return step;
            }
            else {
                dependentLayerPlans.add(s.layerPlan);
            }
        }
        const layerPlansByParent = this.stepTracker.layerPlansByParentStep.get(step);
        if (layerPlansByParent !== undefined) {
            for (const layerPlan of layerPlansByParent) {
                if (layerPlan.parentLayerPlan === step.layerPlan) {
                    return step;
                }
                else {
                    dependentLayerPlans.add(layerPlan.parentLayerPlan);
                }
            }
        }
        const layerPlansByRoot = this.stepTracker.layerPlansByRootStep.get(step);
        if (layerPlansByRoot !== undefined) {
            for (const layerPlan of layerPlansByRoot) {
                if (layerPlan === step.layerPlan) {
                    return step;
                }
                else {
                    dependentLayerPlans.add(layerPlan);
                }
            }
        }
        if (dependentLayerPlans.size === 0) {
            throw new Error(`Nothing depends on ${step}?!`);
        }
        if (dependentLayerPlans.has(step.layerPlan)) {
            throw new Error(`GrafastInternalError<c5cefdbc-9aa4-4895-8966-71171d8c0b36>: This should already have been caught`);
        }
        const paths = [];
        let minPathLength = Infinity;
        for (const dependentLayerPlan of dependentLayerPlans) {
            let lp = dependentLayerPlan;
            const path = [lp];
            while (lp.parentLayerPlan != step.layerPlan) {
                const parent = lp.parentLayerPlan;
                if (!parent) {
                    throw new Error(`GrafastInternalError<64c07427-4fe2-43c4-9858-272d33bee0b8>: invalid layer plan heirarchy`);
                }
                lp = parent;
                path.push(lp);
            }
            paths.push(path);
            minPathLength = Math.min(path.length, minPathLength);
        }
        const dependentLayerPlanCount = dependentLayerPlans.size;
        let deepest = step.layerPlan;
        outerloop: for (let i = 0; i < minPathLength; i++) {
            const expected = paths[0][i];
            if (expected.reason.type === "polymorphic") {
                // PERF: reconsider
                // Let's not pass polymorphic boundaries for now
                break;
            }
            if (expected.reason.type === "subroutine") {
                // PERF: reconsider
                // Let's not pass subroutine boundaries for now
                break;
            }
            if (expected.reason.type === "mutationField") {
                // Let's not pass mutationField boundaries for now
                break;
            }
            for (let j = 1; j < dependentLayerPlanCount; j++) {
                const actual = paths[j][i];
                if (expected != actual) {
                    break outerloop;
                }
            }
            deepest = expected;
        }
        if (deepest === step.layerPlan) {
            return step;
        }
        // All our checks passed, shove it down!
        // 1: no need to adjust polymorphicPaths, since we don't cross polymorphic boundary
        // const targetPolymorphicPaths = deepest.polymorphicPaths;
        // if (!targetPolymorphicPaths.has([...step.polymorphicPaths][0])) {
        //   throw new Error(
        //     `GrafastInternalError<53907e56-940a-4173-979d-bc620e4f1ff8>: polymorphic assumption doesn't hold. Mine = ${[
        //       ...step.polymorphicPaths,
        //     ]}; theirs = ${[...deepest.polymorphicPaths]}`,
        //   );
        // }
        // 2: move it to target layer
        this.stepTracker.moveStepToLayerPlan(step, deepest);
        return step;
    }
    _deduplicateInnerLogic(step) {
        if (step instanceof index_js_1.__ItemStep) {
            // __ItemStep cannot be deduplicated
            return null;
        }
        const peers = this.getPeers(step);
        // Even if there are no peers, we must still deduplicate because
        // `deduplicate` is called to indicate that the field is done being
        // planned, which the step class may want to acknowledge by locking certain
        // facets of its functionality (such as adding filters). We'll simplify its
        // work though by giving it an empty array to filter.
        const wasLocked = index_js_1.isDev && (0, lock_js_1.unlock)(step);
        const equivalentSteps = step.deduplicate(peers);
        if (wasLocked)
            (0, lock_js_1.lock)(step);
        if (equivalentSteps.length === 0) {
            // No other equivalents
            return null;
        }
        if (index_js_1.isDev) {
            if (!equivalentSteps.every((replacementStep) => peers.includes(replacementStep))) {
                throw new Error(`deduplicatePlan error: '${step}.deduplicate' may only return steps from its peers peers (peers = ${peers}), but it returned ${equivalentSteps}. This is currently forbidden because it could cause confusion during the optimization process, instead apply this change in 'optimize', or make sure that any child selections aren't applied until the optimize/finalize phase so that no mapping is required during deduplicate.`);
            }
        }
        // Prefer the step that's closest to the root LayerPlan; failing that, prefer the step with the lowest id.
        let minDepth = step.layerPlan.depth;
        let stepsAtMinDepth = [step];
        for (const step of equivalentSteps) {
            const depth = step.layerPlan.depth;
            if (depth < minDepth) {
                minDepth = depth;
                stepsAtMinDepth = [step];
            }
            else if (depth === minDepth) {
                stepsAtMinDepth.push(step);
            }
        }
        stepsAtMinDepth.sort((a, z) => a.id - z.id);
        return { stepsAtMinDepth, equivalentSteps };
    }
    deduplicateStep(step) {
        // Conditions applied to this step are now finalized, though we may still
        // tell the step to do more stuff (like fetch extra data), it can no longer
        // change its order, conditions, etc.
        step.isArgumentsFinalized = true;
        // If a step is unary at this point, it must always remain unary.
        if (step._isUnary) {
            step._isUnaryLocked = true;
        }
        if (step.deduplicate == null)
            return step;
        const result = this._deduplicateInnerLogic(step);
        if (result == null) {
            return step;
        }
        const { stepsAtMinDepth, equivalentSteps } = result;
        // Hooray, one winning layer! Find the first one by id.
        const winner = stepsAtMinDepth[0];
        if (winner.polymorphicPaths !== null) {
            const polymorphicPaths = new Set();
            for (const s of stepsAtMinDepth) {
                for (const p of s.polymorphicPaths) {
                    polymorphicPaths.add(p);
                }
            }
            winner.polymorphicPaths = polymorphicPaths;
        }
        // Equivalent steps cannot be streaming; so we can no longer stream either.
        if (equivalentSteps.length > 0) {
            winner._stepOptions.stream = null;
        }
        // Give the steps a chance to pass their responsibilities to the winner.
        if (winner !== step) {
            const wasLocked = index_js_1.isDev && (0, lock_js_1.unlock)(step);
            step.deduplicatedWith?.(winner);
            if (wasLocked)
                (0, lock_js_1.lock)(step);
            this.stepTracker.replaceStep(step, winner);
        }
        for (const target of equivalentSteps) {
            if (winner !== target) {
                const wasLocked = index_js_1.isDev && (0, lock_js_1.unlock)(target);
                target.deduplicatedWith?.(winner);
                if (wasLocked)
                    (0, lock_js_1.lock)(target);
                this.stepTracker.replaceStep(target, winner);
            }
        }
        return winner;
    }
    /*
     * PERF: calculation if peers for deduplicate is too expensive, and shouldn't
     * be done in an expensive loop. Alternative:
     *
     * 1. build a `list` of the steps to deduplicate
     * 2. sort this `list` into "dependencies first" order
     * 3. for each step in this `list`:
     *    1. calculate the list of "compatible" LayerPlans for this step (using
     *       cache of results of this step where possible)
     *    2. find all the "peer" steps within these LayerPlans
     *    3. calculate the equivalents for this step
     *    4. pick the winning equivalent, replace all other instances with this
     *    5. remove the replaced (and winning) steps from the `list`
     *
     * "compatible" layer plans are calculated by walking up the layer plan tree,
     * however:
     *   - do not pass the LayerPlan of one of the dependencies
     *   - do not pass a "deferred" layer plan
     *
     * "Pick the winning equivalent" is challenging, here's current thought:
     *
     * 1. find the shallowest LayerPlans (logic already written above)
     * 2. if just one shallowest LayerPlan, winner is lowest-id plan from this LayerPlan
     * 3. otherwise, if all shallowest LayerPlans are polymorphic... ARGH!
     *
     * ARGH! WHAT DOES THIS MEAN FOR BRANCHING/NON-BRANCHING PLANS. We can
     * guarantee that the dependencies must be at least a layer up (otherwise how
     * can these be peers with the same dependencies?). For non-branching
     * non-deferred plans, push it a layer up.
     */
    deduplicateStepsProcess(processed, start, step) {
        processed.add(step);
        for (const dep of (0, utils_js_1.sudo)(step).dependencies) {
            if (dep.id >= start && !processed.has(dep)) {
                this.deduplicateStepsProcess(processed, start, dep);
            }
        }
        (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(step.layerPlan, step.polymorphicPaths, this.phase === "plan" ? this.deduplicateStep : this.hoistAndDeduplicate, this, step);
    }
    /**
     * Gives us a chance to replace nearly-duplicate plans with other existing
     * plans (and adding the necessary transforms); this means that by the time
     * we come to optimize the plan tree should already be simpler. For example
     * if you have two plans at the same level that both request row data from
     * the same database table with the same identifiers, `WHERE`, `LIMIT`,
     * `OFFSET` and `ORDER BY`, but different `SELECT`s we could merge the two
     * plans together by replacing the latter with the former and having the
     * former SELECT additional fields, then transform the results back to what
     * our child plans would be expecting.
     */
    deduplicateSteps(depth = 0) {
        const start = this.stepTracker.nextStepIdToDeduplicate;
        const end = this.stepTracker.stepCount;
        if (end === start) {
            return;
        }
        const processed = new Set();
        for (let i = start; i < end; i++) {
            const step = this.stepTracker.stepById[i];
            if (!step || step.id !== i || processed.has(step))
                continue;
            this.deduplicateStepsProcess(processed, start, step);
        }
        this.stepTracker.nextStepIdToDeduplicate = end;
        if (this.stepTracker.stepCount > end) {
            // More steps were created during deduplicate; let's deduplicate those!
            const MAX_DEPTH = 5;
            if (depth > MAX_DEPTH) {
                const newSteps = [];
                for (let i = end, l = this.stepTracker.stepCount; i < l; i++) {
                    newSteps.push(this.stepTracker.stepById[i]);
                }
                throw new Error(`Whilst deduplicating steps, more steps were created; whilst deduplicating those, even more steps were created. This happened ${MAX_DEPTH} times, which suggests this might go on infinitely. Please check the deduplicate/deduplicatedWith methods on ${newSteps
                    .map((s) => String(s))
                    .join(", ")}.`);
            }
            return this.deduplicateSteps(depth + 1);
        }
    }
    hoistAndDeduplicate(step) {
        this.hoistStep(step);
        // Even if step wasn't hoisted, its deps may have been so we should still
        // re-deduplicate it.
        return step.deduplicate ? this.deduplicateStep(step) : step;
    }
    hoistSteps() {
        this.processSteps("hoist", "dependencies-first", false, this.hoistAndDeduplicate);
    }
    pushDownSteps() {
        this.processSteps("pushDown", "dependents-first", false, this.pushDown);
    }
    /**
     * Calls the 'optimize' method on a plan, which may cause the plan to
     * communicate with its (deep) dependencies, and even to replace itself with
     * a different plan.
     */
    optimizeStep(inStep) {
        const step = inStep.allowMultipleOptimizations && inStep.deduplicate
            ? this.deduplicateStep(inStep)
            : inStep;
        if (!step.optimize) {
            step.isOptimized = true;
            return step;
        }
        if (step.isOptimized && !step.allowMultipleOptimizations) {
            return step;
        }
        // We know if it's streaming or not based on the LayerPlan it's contained within.
        // const stepOptions = step._stepOptions;
        let meta;
        if (step.optimizeMetaKey !== undefined) {
            meta = this.optimizeMeta.get(step.optimizeMetaKey);
            if (!meta) {
                meta = Object.create(null);
                this.optimizeMeta.set(step.optimizeMetaKey, meta);
            }
        }
        const wasLocked = index_js_1.isDev && (0, lock_js_1.unlock)(step);
        const replacementStep = step.optimize({
            stream: step._stepOptions.stream
                ? {
                // We could add more details here, but for now we don't really need them?
                }
                : null,
            meta,
        });
        if (wasLocked)
            (0, lock_js_1.lock)(step);
        if (!replacementStep) {
            throw new Error(`Bug in ${step}'s class: the 'optimize' method must return a step. Hint: did you forget 'return this;'?`);
        }
        step.isOptimized = true;
        return replacementStep;
    }
    /**
     * Note that we work through dependents first so we can make sure that we
     * know all our dependent's needs before we optimise ourself.
     */
    optimizeSteps() {
        const thirdAndFutureLoopReplacedPlans = [];
        for (let loops = 0; loops < MAX_OPTIMIZATION_LOOPS; loops++) {
            let replacedPlan = false;
            this.processSteps("optimize", "dependents-first", false, loops === 0
                ? (step) => {
                    const newStep = this.optimizeStep(step);
                    if (newStep !== step) {
                        replacedPlan = true;
                    }
                    return newStep;
                }
                : (step) => {
                    if (step.allowMultipleOptimizations) {
                        const replacement = this.optimizeStep(step);
                        if (replacement !== step) {
                            replacedPlan = true;
                            if (loops >= 3) {
                                thirdAndFutureLoopReplacedPlans.push(step);
                            }
                        }
                        return replacement;
                    }
                    else {
                        return step;
                    }
                });
            if (!replacedPlan) {
                return;
            }
        }
        console.warn(`Optimize steps looped ${MAX_OPTIMIZATION_LOOPS} times, and was still replacing steps at the end - this could indicate a very complex plan, or badly behaved steps. Here are some of the steps that were replaced after the second loop: ${thirdAndFutureLoopReplacedPlans
            .slice(0, 10)
            .join(", ")}`);
    }
    inlineSteps() {
        flagLoop: for (const $flag of this.stepTracker.activeSteps) {
            if ($flag instanceof index_js_1.__FlagStep) {
                // We can only inline it if it's not used by an output plan or layer plan
                {
                    const usages = this.stepTracker.outputPlansByRootStep.get($flag);
                    if (usages?.size) {
                        continue;
                    }
                }
                {
                    const usages = this.stepTracker.layerPlansByRootStep.get($flag);
                    if (usages?.size) {
                        continue;
                    }
                }
                {
                    const usages = this.stepTracker.layerPlansByParentStep.get($flag);
                    if (usages?.size) {
                        continue;
                    }
                }
                // We're only going to inline one if we can inline all.
                const toInline = [];
                for (const dependent of $flag.dependents) {
                    const { step, dependencyIndex } = dependent;
                    const $dependent = (0, utils_js_1.sudo)(step);
                    const inlineDetails = $flag.inline($dependent.getDepOptions(dependencyIndex));
                    if (inlineDetails === null) {
                        continue flagLoop;
                    }
                    toInline.push({
                        $dependent,
                        dependencyIndex,
                        inlineDetails,
                        dependent,
                    });
                }
                // All of them pass the check, let's inline them
                for (const todo of toInline) {
                    const { $dependent, dependencyIndex, inlineDetails: { onReject, acceptFlags = interfaces_js_1.DEFAULT_ACCEPT_FLAGS }, } = todo;
                    (0, utils_js_1.writeableArray)($dependent.dependencyOnReject)[dependencyIndex] =
                        onReject;
                    (0, utils_js_1.writeableArray)($dependent.dependencyForbiddenFlags)[dependencyIndex] =
                        interfaces_js_1.ALL_FLAGS & ~acceptFlags;
                }
                const $flagDep = (0, utils_js_1.sudo)($flag).dependencies[0];
                this.stepTracker.replaceStep($flag, $flagDep);
            }
        }
    }
    /** Finalizes each step */
    finalizeSteps() {
        const initialStepCount = this.stepTracker.stepCount;
        for (const step of this.stepTracker.activeSteps) {
            const wasLocked = index_js_1.isDev && (0, lock_js_1.unlock)(step);
            step.finalize();
            if (wasLocked)
                (0, lock_js_1.lock)(step);
            (0, step_js_1.assertFinalized)(step);
            if (index_js_1.isDev && this.stepTracker.stepCount !== initialStepCount) {
                throw new Error(`When calling ${step}.finalize() a new plan was created; this is forbidden!`);
            }
        }
    }
    finalizeLayerPlans() {
        /**
         * Adds the `dep` plan to the `copyPlanIds` for `layerPlan` and any
         * ancestor layers until we hit the layerPlan that `dep` is from.
         */
        const ensurePlanAvailableInLayer = (dep, layerPlan) => {
            let currentLayerPlan = layerPlan;
            while (dep.layerPlan !== currentLayerPlan) {
                if (currentLayerPlan.copyStepIds.includes(dep.id)) {
                    break;
                }
                const targetStep = this.stepTracker.getStepById(dep.id);
                if (index_js_1.isDev && targetStep !== dep) {
                    throw new Error(`GrafastInternalError<b291b110-396a-4c9c-814a-5466af3c50e8>: Plan mismatch; are we using a replaced step? Step ID: ${dep.id}; step: ${dep}; stepById: ${this.stepTracker.getStepById(dep.id)}`);
                }
                if (targetStep._isUnary) {
                    targetStep._isUnaryLocked = true;
                }
                currentLayerPlan.copyStepIds.push(dep.id);
                currentLayerPlan = currentLayerPlan.parentLayerPlan;
                if (!currentLayerPlan) {
                    throw new Error(`GrafastInternalError<8c1640b9-fa3c-440d-99e5-7693d0d7e5d1>: could not find layer plan for '${dep}' in chain from layer plan ${layerPlan}`);
                }
            }
        };
        for (const layerPlan of this.stepTracker.layerPlans) {
            if (!layerPlan) {
                continue;
            }
            layerPlan.steps = [];
        }
        for (const step of this.stepTracker.activeSteps) {
            step.layerPlan.steps.push(step);
        }
        for (const layerPlan of this.stepTracker.layerPlans) {
            if (!layerPlan) {
                continue;
            }
            layerPlan.pendingSteps = layerPlan.steps.filter((s) => !(step_js_1.$$noExec in s));
            const sideEffectSteps = layerPlan.pendingSteps.filter((s) => s.hasSideEffects);
            const pending = new Set(layerPlan.pendingSteps);
            const processed = new Set();
            const latestSideEffectStepByPolymorphicPath = new Map();
            function getLatestSideEffectStepFor(step) {
                const polymorphicPaths = [...(step.polymorphicPaths ?? [""])];
                const latestSideEffectStep = latestSideEffectStepByPolymorphicPath.get(polymorphicPaths[0]);
                for (let i = 1, l = polymorphicPaths.length; i < l; i++) {
                    const se = latestSideEffectStepByPolymorphicPath.get(polymorphicPaths[i]);
                    if (se !== latestSideEffectStep) {
                        throw new Error(`You shouldn't have side effects in polymorphic positions; ${step} exists in ${polymorphicPaths} but these positions have mixed side effects`);
                    }
                }
                return latestSideEffectStep;
            }
            function setLatestSideEffectStep(step) {
                const polymorphicPaths = [...(step.polymorphicPaths ?? [""])];
                // Store this side effect for use from now on
                for (let i = 0, l = polymorphicPaths.length; i < l; i++) {
                    latestSideEffectStepByPolymorphicPath.set(polymorphicPaths[i], step);
                }
            }
            const processSideEffectPlan = (step) => {
                if (processed.has(step) || isPrepopulatedStep(step)) {
                    return;
                }
                const sstep = (0, utils_js_1.sudo)(step);
                processed.add(step);
                pending.delete(step);
                const sideEffectDeps = [];
                const rest = [];
                for (const dep of sstep.dependencies) {
                    if (dep.layerPlan !== layerPlan) {
                        continue;
                    }
                    if (processed.has(dep)) {
                        continue;
                    }
                    if (dep.hasSideEffects) {
                        sideEffectDeps.push(dep);
                    }
                    else {
                        rest.push(dep);
                    }
                }
                // Call any side effects we're dependent on
                for (const sideEffectDep of sideEffectDeps) {
                    processSideEffectPlan(sideEffectDep);
                }
                // PERF: this is silly, we should be able to group them together and
                // run them in parallel, and they don't even have side effects!
                for (const dep of rest) {
                    processSideEffectPlan(dep);
                }
                const latestSideEffectStep = getLatestSideEffectStepFor(step);
                if (latestSideEffectStep !== undefined &&
                    !(0, utils_js_1.stepADependsOnStepB)(sstep, latestSideEffectStep)) {
                    sstep.implicitSideEffectStep = latestSideEffectStep;
                }
                if (step.hasSideEffects) {
                    setLatestSideEffectStep(step);
                }
                const phase = /*#__INLINE__*/ newLayerPlanPhase();
                phase.checkTimeout = true;
                phase.normalSteps = [{ step }];
                phase._allSteps.push(step);
                layerPlan.phases.push(phase);
            };
            for (const sideEffectStep of sideEffectSteps) {
                processSideEffectPlan(sideEffectStep);
            }
            const readyToExecute = (step) => {
                for (const dep of (0, utils_js_1.sudo)(step).dependencies) {
                    if (dep.layerPlan === layerPlan && pending.has(dep)) {
                        return false;
                    }
                }
                return true;
            };
            while (pending.size > 0) {
                const nextSteps = [];
                for (const step of pending) {
                    if (readyToExecute(step)) {
                        nextSteps.push(step);
                    }
                }
                if (nextSteps.length === 0) {
                    throw new Error(`GrafastInternalError<2904ebbf-6344-4f2b-9305-8db9c1ff29c5>: Could not compute execution order?! Remaining: ${[
                        ...pending,
                    ]} (processed: ${[...processed]}; all: ${layerPlan.pendingSteps})`);
                }
                // Do not add to processed until whole layer is known
                const phase = /*#__INLINE__*/ newLayerPlanPhase();
                for (const step of nextSteps) {
                    processed.add(step);
                    pending.delete(step);
                    const sstep = (0, utils_js_1.sudo)(step);
                    const latestSideEffectStep = getLatestSideEffectStepFor(step);
                    if (latestSideEffectStep !== undefined &&
                        !(0, utils_js_1.stepADependsOnStepB)(sstep, latestSideEffectStep)) {
                        sstep.implicitSideEffectStep = latestSideEffectStep;
                    }
                    if (step.isSyncAndSafe && (0, step_js_1.isUnbatchedStep)(step)) {
                        if (phase.unbatchedSyncAndSafeSteps !== undefined) {
                            phase.unbatchedSyncAndSafeSteps.push({
                                step,
                                scratchpad: undefined,
                            });
                        }
                        else {
                            phase.unbatchedSyncAndSafeSteps = [
                                { step, scratchpad: undefined },
                            ];
                        }
                    }
                    else {
                        if (!step.isSyncAndSafe || step.hasSideEffects) {
                            phase.checkTimeout = true;
                        }
                        if (phase.normalSteps !== undefined) {
                            phase.normalSteps.push({ step });
                        }
                        else {
                            phase.normalSteps = [{ step }];
                        }
                    }
                }
                // Add more isSyncAndSafe unbatched steps if possible
                let foundOne = false;
                do {
                    foundOne = false;
                    for (const step of pending) {
                        if (step.isSyncAndSafe && (0, step_js_1.isUnbatchedStep)(step)) {
                            if (readyToExecute(step)) {
                                processed.add(step);
                                pending.delete(step);
                                const sstep = (0, utils_js_1.sudo)(step);
                                const latestSideEffectStep = getLatestSideEffectStepFor(step);
                                if (latestSideEffectStep !== undefined &&
                                    !(0, utils_js_1.stepADependsOnStepB)(sstep, latestSideEffectStep)) {
                                    sstep.implicitSideEffectStep = latestSideEffectStep;
                                }
                                foundOne = true;
                                if (phase.unbatchedSyncAndSafeSteps !== undefined) {
                                    phase.unbatchedSyncAndSafeSteps.push({
                                        step,
                                        scratchpad: undefined,
                                    });
                                }
                                else {
                                    phase.unbatchedSyncAndSafeSteps = [
                                        { step, scratchpad: undefined },
                                    ];
                                }
                            }
                        }
                    }
                } while (foundOne);
                if (phase.normalSteps !== undefined) {
                    for (const { step } of phase.normalSteps) {
                        phase._allSteps.push(step);
                    }
                }
                if (phase.unbatchedSyncAndSafeSteps !== undefined) {
                    for (const { step } of phase.unbatchedSyncAndSafeSteps) {
                        phase._allSteps.push(step);
                    }
                }
                layerPlan.phases.push(phase);
            }
            // PERF: this could probably be faster.
            // Populate copyPlanIds for each step
            for (const step of layerPlan.steps) {
                // Items shouldn't have their "list" copied in.
                if (step_js_1.$$noExec in step) {
                    continue;
                }
                for (const dep of (0, utils_js_1.sudo)(step).dependencies) {
                    ensurePlanAvailableInLayer(dep, layerPlan);
                }
                if (step.implicitSideEffectStep) {
                    ensurePlanAvailableInLayer(step.implicitSideEffectStep, layerPlan);
                }
            }
            const $root = layerPlan.rootStep;
            if ($root) {
                ensurePlanAvailableInLayer($root, layerPlan);
                // If $root explicitly dependends on `layerPlan.parentSideEffectStep`
                // then we should remove the implicit layerPlan dependency (e.g. so
                // that if you `trap()` the error it does not interfere).
                if (layerPlan.parentSideEffectStep) {
                    if (layerPlan.parentSideEffectStep === $root ||
                        layerPlan.parentSideEffectStep === $root.implicitSideEffectStep ||
                        (0, utils_js_1.stepADependsOnStepB)($root, layerPlan.parentSideEffectStep)) {
                        layerPlan.parentSideEffectStep = null;
                    }
                }
            }
            const $sideEffect = layerPlan.parentSideEffectStep;
            if ($sideEffect) {
                // We read it from the parent layer plan at newBucket time, but we
                // don't need to actually scale it up/down.
                //
                // If parentSideEffectStep exists then parentLayerPlan must exist.
                ensurePlanAvailableInLayer($sideEffect, layerPlan.parentLayerPlan);
            }
            // Copy polymorphic parentStepId
            if (layerPlan.reason.type === "polymorphic") {
                const parentStep = layerPlan.reason.parentStep;
                ensurePlanAvailableInLayer(parentStep, layerPlan);
            }
            // Ensure list is accessible in parent layerPlan
            if (layerPlan.reason.type === "listItem") {
                const parentStep = layerPlan.reason.parentStep;
                ensurePlanAvailableInLayer(parentStep, layerPlan.parentLayerPlan);
                const stream = layerPlan.reason.stream;
                if (stream != null) {
                    if (stream.initialCountStepId) {
                        ensurePlanAvailableInLayer(this.stepTracker.getStepById(stream.initialCountStepId), layerPlan.parentLayerPlan);
                    }
                    if (stream.ifStepId) {
                        ensurePlanAvailableInLayer(this.stepTracker.getStepById(stream.ifStepId), layerPlan.parentLayerPlan);
                    }
                    if (stream.labelStepId) {
                        ensurePlanAvailableInLayer(this.stepTracker.getStepById(stream.labelStepId), layerPlan.parentLayerPlan);
                    }
                }
            }
        }
        // Populate copyPlanIds for output plans' rootStepId
        this.stepTracker.allOutputPlans.forEach((outputPlan) => {
            ensurePlanAvailableInLayer(outputPlan.rootStep, outputPlan.layerPlan);
        });
        for (const layerPlan of this.stepTracker.layerPlans) {
            if (layerPlan !== null) {
                layerPlan.finalize();
            }
        }
    }
    /** Optimizes each output plan */
    optimizeOutputPlans() {
        this.stepTracker.allOutputPlans.forEach((outputPlan) => outputPlan.optimize());
    }
    /** Finalizes each output plan */
    finalizeOutputPlans() {
        this.stepTracker.allOutputPlans.forEach((outputPlan) => outputPlan.finalize());
    }
    walkOutputPlans(outputPlan, callback) {
        callback(outputPlan);
        if (outputPlan.child !== null) {
            this.walkOutputPlans(outputPlan.child, callback);
        }
        if (outputPlan.childByTypeName !== undefined) {
            Object.values(outputPlan.childByTypeName).forEach((childOutputPlan) => {
                this.walkOutputPlans(childOutputPlan, callback);
            });
        }
        for (const spec of Object.values(outputPlan.keys)) {
            if (spec.type === "outputPlan") {
                this.walkOutputPlans(spec.outputPlan, callback);
            }
        }
        for (const defer of outputPlan.deferredOutputPlans) {
            this.walkOutputPlans(defer, callback);
        }
    }
    generatePlanJSON() {
        function printStep(step) {
            const metaString = step.toStringMeta();
            const sstep = (0, utils_js_1.sudo)(step);
            return {
                id: step.id,
                stepClass: step.constructor.name,
                metaString: metaString ? (0, index_js_1.stripAnsi)(metaString) : metaString,
                isUnary: step._isUnary,
                bucketId: step.layerPlan.id,
                implicitSideEffectStepId: step.implicitSideEffectStep?.id ?? null,
                dependencyIds: sstep.dependencies.map((d) => d.id),
                dependencyForbiddenFlags: sstep.dependencyForbiddenFlags.slice(),
                dependencyOnReject: sstep.dependencyOnReject.map((or) => or ? String(or) : or),
                polymorphicPaths: step.polymorphicPaths
                    ? [...step.polymorphicPaths]
                    : undefined,
                isSyncAndSafe: step.isSyncAndSafe || undefined,
                supportsUnbatched: typeof step.unbatchedExecute === "function" || undefined,
                hasSideEffects: step.hasSideEffects || undefined,
                stream: step._stepOptions.stream
                    ? { initialCountStepId: step._stepOptions.stream.initialCountStepId }
                    : undefined,
                extra: step.planJSONExtra(),
            };
        }
        function printPhase(phase) {
            return {
                normalStepIds: phase.normalSteps?.map((s) => s.step.id),
                unbatchedStepIds: phase.unbatchedSyncAndSafeSteps?.map((s) => s.step.id),
            };
        }
        function printBucketReason(reason) {
            switch (reason.type) {
                case "root": {
                    const { type } = reason;
                    return { type };
                }
                case "nullableBoundary": {
                    const { type, parentStep } = reason;
                    return { type, parentStepId: parentStep.id };
                }
                case "listItem": {
                    const { type, parentStep, stream } = reason;
                    return { type, parentStepId: parentStep.id, stream };
                }
                case "subscription": {
                    const { type } = reason;
                    return { type };
                }
                case "mutationField": {
                    const { type, mutationIndex } = reason;
                    return { type, mutationIndex };
                }
                case "defer": {
                    const { type, label } = reason;
                    return { type, label };
                }
                case "polymorphic": {
                    const { type, typeNames, parentStep, polymorphicPaths } = reason;
                    return {
                        type,
                        typeNames,
                        parentStepId: parentStep.id,
                        polymorphicPaths: [...polymorphicPaths],
                    };
                }
                case "subroutine": {
                    const { type, parentStep } = reason;
                    return { type, parentStepId: parentStep.id };
                }
                default: {
                    const never = reason;
                    throw new Error(`Failed to process layer plan reason ${(0, inspect_js_1.inspect)(never)}`);
                }
            }
        }
        function printBucket(lp) {
            lp.reason;
            return {
                id: lp.id,
                reason: printBucketReason(lp.reason),
                parentSideEffectStepId: lp.parentSideEffectStep?.id ?? null,
                copyStepIds: lp.copyStepIds,
                phases: lp.phases.map(printPhase),
                steps: lp.steps.map(printStep),
                children: lp.children.map(printBucket),
                rootStepId: lp.rootStep ? lp.rootStep.id : null,
            };
        }
        return {
            version: "v1",
            rootBucket: printBucket(this.rootLayerPlan),
        };
    }
    finishSubroutine(subroutineStep, layerPlan) {
        // Now find anything that these plans are dependent on and make ourself
        // dependent on them.
        const process = (lp, known) => {
            for (const step of this.stepTracker.activeSteps) {
                if (step.layerPlan === lp) {
                    for (const dep of (0, utils_js_1.sudo)(step).dependencies) {
                        if (!known.includes(dep.layerPlan)) {
                            // Naughty naughty
                            subroutineStep.addDependency(dep);
                        }
                    }
                }
            }
            for (const child of lp.children) {
                process(child, [...known, child]);
            }
        };
        process(layerPlan, [layerPlan]);
    }
    /**
     * HIGHLY EXPERIMENTAL!
     *
     * @internal
     */
    deleteLayerPlan(layerPlan) {
        this.stepTracker.deleteLayerPlan(layerPlan);
    }
    getStepsByMetaKey(metaKey) {
        const matches = [];
        for (const step of this.stepTracker.activeSteps) {
            if (step.metaKey === metaKey) {
                matches.push(step);
            }
        }
        return matches;
    }
    getStepsByStepClass(klass) {
        const matches = [];
        for (const step of this.stepTracker.activeSteps) {
            if (step instanceof klass) {
                matches.push(step);
            }
        }
        return matches;
    }
    /**
     * Cache a generated step by a given identifier (cacheKey) such that we don't
     * need to regenerate it on future calls, significantly reducing the load on
     * deduplication later.
     *
     * Note: automatically extends the cached step into other (relevant)
     * polymorphic paths; if this shouldn't be the case then don't use cacheStep
     * and instead rely on deduplication as usual.
     *
     * @experimental
     */
    cacheStep(ownerStep, actionKey, cacheKey, cb) {
        const layerPlan = (0, withGlobalLayerPlan_js_1.currentLayerPlan)();
        const paths = (0, withGlobalLayerPlan_js_1.currentPolymorphicPaths)();
        const cache = (this._cacheStepStoreByLayerPlanAndActionKey[`${actionKey}|${layerPlan.id}|${ownerStep.id}`] ??= new Map());
        const cacheIt = () => {
            const stepToCache = cb();
            if (!(stepToCache instanceof index_js_1.Step)) {
                throw new Error(`The callback passed to cacheStep must always return an ExecutableStep; but this call from ${ownerStep} returned instead ${(0, inspect_js_1.inspect)(stepToCache)}`);
            }
            cache.set(cacheKey, stepToCache.id);
            return stepToCache;
        };
        if (!cache.has(cacheKey)) {
            return cacheIt();
        }
        const cachedStepId = cache.get(cacheKey);
        const cachedStep = this.stepTracker.stepById[cachedStepId];
        if (cachedStep) {
            // Fix poly paths
            if (paths && cachedStep.polymorphicPaths) {
                const polymorphicPaths = new Set([
                    ...cachedStep.polymorphicPaths,
                    ...paths,
                ]);
                cachedStep.polymorphicPaths = polymorphicPaths;
            }
            return cachedStep;
        }
        else {
            return cacheIt();
        }
    }
    /**
     * Clears the cache, typically due to side effects having taken place. Called
     * from setting hasSideEffects on an ExecutableStep, among other places.
     */
    resetCache() {
        this._cacheStepStoreByLayerPlanAndActionKey = Object.create(null);
    }
    withRootLayerPlan(cb) {
        return (0, withGlobalLayerPlan_js_1.withGlobalLayerPlan)(this.rootLayerPlan, exports.POLYMORPHIC_ROOT_PATHS, cb);
    }
}
exports.OperationPlan = OperationPlan;
function makeMetaByMetaKeysFactory(allMetaKeysList) {
    const l = allMetaKeysList.length;
    // Optimize the common cases
    if (l === 0) {
        return makeMetaByMetaKeys0;
    }
    else if (l === 1) {
        return makeMetaByMetaKeys1Factory(allMetaKeysList[0]);
    }
    else if (l === 2) {
        return makeMetaByMetaKeys2Factory(allMetaKeysList[0], allMetaKeysList[1]);
    }
    else if (l === 3) {
        return makeMetaByMetaKeys3Factory(allMetaKeysList[0], allMetaKeysList[1], allMetaKeysList[2]);
    }
    else if (l === 4) {
        return makeMetaByMetaKeys4Factory(allMetaKeysList[0], allMetaKeysList[1], allMetaKeysList[2], allMetaKeysList[3]);
    }
    else if (l === 5) {
        return makeMetaByMetaKeys5Factory(allMetaKeysList[0], allMetaKeysList[1], allMetaKeysList[2], allMetaKeysList[3], allMetaKeysList[4]);
    }
    else if (l === 6) {
        return makeMetaByMetaKeys6Factory(allMetaKeysList[0], allMetaKeysList[1], allMetaKeysList[2], allMetaKeysList[3], allMetaKeysList[4], allMetaKeysList[5]);
    }
    return function makeMetaByMetaKey() {
        const metaByMetaKey = Object.create(null);
        for (let i = 0; i < l; i++) {
            metaByMetaKey[allMetaKeysList[i]] = Object.create(null);
        }
        return metaByMetaKey;
    };
}
const EMPTY_OBJECT = Object.freeze(Object.create(null));
function makeMetaByMetaKeys0() {
    return EMPTY_OBJECT;
}
function makeMetaByMetaKeys1Factory(key1) {
    return function makeMetaByMetaKeys1() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        return obj;
    };
}
function makeMetaByMetaKeys2Factory(key1, key2) {
    return function makeMetaByMetaKeys2() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        obj[key2] = Object.create(null);
        return obj;
    };
}
function makeMetaByMetaKeys3Factory(key1, key2, key3) {
    return function makeMetaByMetaKeys3() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        obj[key2] = Object.create(null);
        obj[key3] = Object.create(null);
        return obj;
    };
}
function makeMetaByMetaKeys4Factory(key1, key2, key3, key4) {
    return function makeMetaByMetaKeys4() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        obj[key2] = Object.create(null);
        obj[key3] = Object.create(null);
        obj[key4] = Object.create(null);
        return obj;
    };
}
function makeMetaByMetaKeys5Factory(key1, key2, key3, key4, key5) {
    return function makeMetaByMetaKeys5() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        obj[key2] = Object.create(null);
        obj[key3] = Object.create(null);
        obj[key4] = Object.create(null);
        obj[key5] = Object.create(null);
        return obj;
    };
}
function makeMetaByMetaKeys6Factory(key1, key2, key3, key4, key5, key6) {
    return function makeMetaByMetaKeys6() {
        const obj = Object.create(null);
        obj[key1] = Object.create(null);
        obj[key2] = Object.create(null);
        obj[key3] = Object.create(null);
        obj[key4] = Object.create(null);
        obj[key5] = Object.create(null);
        obj[key6] = Object.create(null);
        return obj;
    };
}
function newLayerPlanPhase() {
    return {
        checkTimeout: false,
        normalSteps: undefined,
        unbatchedSyncAndSafeSteps: undefined,
        _allSteps: [],
    };
}
function throwNoNewStepsError(operationPlan, actionDescription, step, previousStepCount, message) {
    const newSteps = [];
    for (let i = previousStepCount, l = operationPlan.stepTracker.stepCount; i < l; i++) {
        newSteps.push(operationPlan.stepTracker.stepById[i]);
    }
    throw new Error(`${message}; whilst performing ${actionDescription} of ${step} the following new steps were created: ${newSteps
        .map((s) => String(s))
        .join(", ")}`);
}
//# sourceMappingURL=OperationPlan.js.map