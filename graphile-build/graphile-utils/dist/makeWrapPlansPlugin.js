"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeWrapPlansPlugin = makeWrapPlansPlugin;
const node_util_1 = require("node:util");
let counter = 0;
function makeWrapPlansPlugin(rulesOrGeneratorOrFilter, rule) {
    if (rule && typeof rule !== "function") {
        throw new Error("Invalid call signature for makeWrapPlansPlugin, expected second argument to be a function");
    }
    const name = `WrapPlansPlugin_${++counter}`;
    const symbol = Symbol(name);
    return {
        name,
        version: "0.0.0",
        schema: {
            hooks: {
                build(build) {
                    // Disambiguate first argument
                    const rulesOrGenerator = rule ? null : rulesOrGeneratorOrFilter;
                    const filter = rule
                        ? rulesOrGeneratorOrFilter
                        : null;
                    const rules = typeof rulesOrGenerator === "function"
                        ? rulesOrGenerator(build)
                        : rulesOrGenerator;
                    build[symbol] = {
                        rules,
                        filter,
                    };
                    return build;
                },
                GraphQLObjectType_fields_field(field, build, context) {
                    const rules = build[symbol].rules;
                    const { EXPORTABLE, grafast: { ExecutableStep, isExecutableStep, defaultPlanResolver }, } = build;
                    const filter = build[symbol]
                        .filter;
                    const { Self, scope: { fieldName }, } = context;
                    let planWrapperOrSpec;
                    if (filter) {
                        const filterResult = filter(context, build, field);
                        if (!filterResult) {
                            if (filterResult !== null) {
                                // eslint-disable-next-line no-console
                                console.error(`Filter should return either a truthy value, or 'null', instead received: '${filterResult}'`);
                            }
                            return field;
                        }
                        planWrapperOrSpec = rule(filterResult);
                    }
                    else if (rules) {
                        const typeRules = rules[Self.name];
                        if (!typeRules) {
                            return field;
                        }
                        planWrapperOrSpec = typeRules[fieldName];
                    }
                    else {
                        // Should not happen
                        throw new Error("Bad call signature for function makeWrapPlansPlugin");
                    }
                    if (!planWrapperOrSpec) {
                        return field;
                    }
                    const planWrapper = typeof planWrapperOrSpec === "function"
                        ? planWrapperOrSpec
                        : planWrapperOrSpec.plan;
                    if (!planWrapper) {
                        return field;
                    }
                    const { plan: oldPlan = defaultPlanResolver } = field;
                    const typeName = Self.name;
                    return {
                        ...field,
                        plan: EXPORTABLE((ExecutableStep, fieldName, inspect, isExecutableStep, oldPlan, planWrapper, typeName) => (...planParams) => {
                            // A replacement for `oldPlan` that automatically passes through arguments that weren't replaced
                            const smartPlan = (...overrideParams) => {
                                const $prev = oldPlan(
                                // @ts-ignore We're calling it dynamically, allowing the parent to override args.
                                ...overrideParams.concat(planParams.slice(overrideParams.length)));
                                if (!($prev instanceof ExecutableStep)) {
                                    console.error(`Wrapped a plan function at ${typeName}.${fieldName}, but that function did not return a step!\n${String(oldPlan)}`);
                                    throw new Error("Wrapped a plan function, but that function did not return a step!");
                                }
                                return $prev;
                            };
                            const [$source, fieldArgs, info] = planParams;
                            const $newPlan = planWrapper(smartPlan, $source, fieldArgs, info);
                            if ($newPlan === undefined) {
                                throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
                            }
                            if ($newPlan !== null && !isExecutableStep($newPlan)) {
                                throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
                            }
                            return $newPlan;
                        }, [
                            ExecutableStep,
                            fieldName,
                            node_util_1.inspect,
                            isExecutableStep,
                            oldPlan,
                            planWrapper,
                            typeName,
                        ]),
                    };
                },
            },
        },
    };
}
//# sourceMappingURL=makeWrapPlansPlugin.js.map