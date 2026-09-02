import { inspect } from "node:util";

import type {
  FieldArgs,
  FieldInfo,
  FieldPlanResolver,
  GrafastFieldConfig,
} from "grafast";

type ToOptional<T> = { [K in keyof T]+?: T[K] };

type SmartFieldPlanResolver = (
  ...args: ToOptional<Parameters<FieldPlanResolver<any, any, any>>>
) => ReturnType<FieldPlanResolver<any, any, any>>;

export type PlanWrapperFn = (
  plan: SmartFieldPlanResolver,
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  $source: import("grafast").ExecutableStep,
  fieldArgs: FieldArgs,
  info: FieldInfo,
) => any;

export interface PlanWrapperRule {
  autoApplyFieldArgs?: boolean;
  plan?: PlanWrapperFn;
  // subscribePlan?: PlanWrapperFn;
}

export interface PlanWrapperRules {
  [typeName: string]: {
    [fieldName: string]: PlanWrapperRule | PlanWrapperFn;
  };
}

export type PlanWrapperRulesGenerator<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
> = (build: GraphileBuild.ScopedBuild<TScope>) => PlanWrapperRules;

export type PlanWrapperFilter<
  T,
  TScope extends keyof GraphileBuild.PluginScopes = "default",
> = (
  context: GraphileBuild.ContextObjectFieldsField,
  build: GraphileBuild.ScopedBuild<TScope>,
  field: GrafastFieldConfig<any, any, any>,
) => T | null;

export type PlanWrapperFilterRule<T> = (
  match: T,
) => PlanWrapperRule | PlanWrapperFn;

export interface WrapPlansOptions<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
> {
  /**
   * The generated-types scope used to infer scoped types. This has no runtime
   * effect.
   */
  scope?: TScope;
  /** The name to give this plugin, to make debugging easier */
  name?: string;
  /** Optional version of the plugin */
  version?: string;
  /** Optional description of the plugin, to make debugging easier */
  description?: string;

  /**
   * Set this `true` if you know that the given plans will never be called in
   * the context of resolver emulation, and thus wrapping `defaultPlanResolver`
   * will not cause issues.
   *
   * @see {@link https://err.red/pwpr}
   *
   */
  disableResolverEmulationWarnings?: boolean;
}

let counter = 0;
const EMPTY_OPTIONS: WrapPlansOptions<never> = Object.freeze({});

interface PlanWrapperState<T, TScope extends keyof GraphileBuild.PluginScopes> {
  rules: PlanWrapperRules | null;
  filter: PlanWrapperFilter<T, TScope> | null;
}

export function wrapPlans<
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(
  rulesOrGenerator: PlanWrapperRules | PlanWrapperRulesGenerator<TScope>,
  options?: WrapPlansOptions<TScope>,
): GraphileConfig.Plugin;
export function wrapPlans<
  T,
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(
  filter: PlanWrapperFilter<T, TScope>,
  rule: PlanWrapperFilterRule<T>,
  options?: WrapPlansOptions<TScope>,
): GraphileConfig.Plugin;
export function wrapPlans<
  T,
  TScope extends keyof GraphileBuild.PluginScopes = "default",
>(
  rulesOrGeneratorOrFilter:
    | PlanWrapperRules
    | PlanWrapperRulesGenerator<TScope>
    | PlanWrapperFilter<T, TScope>,
  ruleOrOptions?: PlanWrapperFilterRule<T> | WrapPlansOptions<TScope>,
  maybeOptions?: WrapPlansOptions<TScope>,
): GraphileConfig.Plugin {
  // Parse out the overloaded signature
  const [rule, options = EMPTY_OPTIONS, forbidden] =
    typeof ruleOrOptions === "function" || ruleOrOptions == null
      ? [ruleOrOptions, maybeOptions, undefined]
      : [undefined, ruleOrOptions, maybeOptions];
  if (forbidden !== undefined) {
    throw new Error(
      "Invalid call signature for wrapPlans, expected second argument to be a function",
    );
  }

  const {
    name = `WrapPlansPlugin_${++counter}`,
    description,
    version = "0.0.0",
    disableResolverEmulationWarnings = false,
  } = options;
  const symbol = Symbol(name);

  const resolverEmulationWarningCoordinates = new Set<string>();
  let timeout: ReturnType<typeof setTimeout> | null = null;
  const queueResolverEmulationWarning = (coordinate: string) => {
    if (disableResolverEmulationWarnings) return;
    resolverEmulationWarningCoordinates.add(coordinate);
    if (timeout != null) {
      return;
    }
    timeout = setTimeout(() => {
      const coordinates = [...resolverEmulationWarningCoordinates].sort();
      resolverEmulationWarningCoordinates.clear();
      timeout = null;
      if (coordinates.length === 0) {
        return;
      }
      const plural = coordinates.length > 1;
      console.log(
        `[WARNING]: \`wrapPlans(...)\` plugin ${name} has wrapped the default plan resolver at field ${
          plural ? "coordinates" : "coordinate"
        } ${coordinates.join(
          ", ",
        )}. If this is an impure schema (one that mixes traditional resolvers with Grafast's plan resolvers) then this may result in hard to track down issues - hence this warning. See https://err.red/pwpr for full explanation and proposed solutions.`,
      );
    }, 0);
  };

  return {
    name,
    provides: ["wrapPlans"],
    description,
    version,
    schema: {
      hooks: {
        build(build) {
          (build as any)[symbol] = {
            rules: null,
            filter: null,
          };
          return build;
        },
        init(_, build) {
          // Disambiguate first argument
          const rulesOrGenerator:
            | PlanWrapperRules
            | PlanWrapperRulesGenerator<TScope>
            | null = rule ? null : (rulesOrGeneratorOrFilter as any);
          const filter: PlanWrapperFilter<T, TScope> | null = rule
            ? (rulesOrGeneratorOrFilter as any)
            : null;

          const rules: PlanWrapperRules | null =
            typeof rulesOrGenerator === "function"
              ? rulesOrGenerator(build as GraphileBuild.ScopedBuild<TScope>)
              : rulesOrGenerator;
          const state: PlanWrapperState<T, TScope> = { rules, filter };
          Object.assign((build as any)[symbol], state);
          return _;
        },
        GraphQLObjectType_fields_field(field, build, context) {
          const state = (build as any)[symbol] as PlanWrapperState<T, TScope>;
          const { rules, filter } = state;
          const {
            EXPORTABLE,
            grafast: { ExecutableStep, isStep, defaultPlanResolver },
          } = build;
          const {
            Self,
            scope: { fieldName },
          } = context;
          let planWrapperOrSpec;
          if (filter) {
            const filterResult: any = filter(
              context,
              build as GraphileBuild.ScopedBuild<TScope>,
              field,
            );
            if (!filterResult) {
              if (filterResult !== null) {
                // eslint-disable-next-line no-console
                console.error(
                  `Filter should return either a truthy value, or 'null', instead received: '${filterResult}'`,
                );
              }
              return field;
            }
            planWrapperOrSpec = rule!(filterResult);
          } else if (rules) {
            const typeRules = rules[Self.name];
            if (!typeRules) {
              return field;
            }
            planWrapperOrSpec = typeRules[fieldName];
          } else {
            // Should not happen
            throw new Error("Bad call signature for function wrapPlans");
          }
          if (!planWrapperOrSpec) {
            return field;
          }
          const ruleObject: PlanWrapperRule =
            typeof planWrapperOrSpec === "function"
              ? { plan: planWrapperOrSpec }
              : planWrapperOrSpec;
          const { plan: planWrapper, autoApplyFieldArgs = true } = ruleObject;
          if (!planWrapper) {
            return field;
          }
          const {
            plan: oldPlan = defaultPlanResolver,
            resolve,
            subscribe,
          } = field;

          if (oldPlan === defaultPlanResolver) {
            if (resolve) {
              console.warn(
                `[WARNING]: \`wrapPlans(...)\` refusing to wrap ${Self.name}.${fieldName} since it has no plan and it has a resolver.`,
              );
              return field;
            } else if (subscribe) {
              console.warn(
                `[WARNING]: \`wrapPlans(...)\` refusing to wrap ${Self.name}.${fieldName} since it has no plan and it has a subscription resolver.`,
              );
              return field;
            } else if (Self.extensions?.grafast?.assertStep) {
              // It's fine; we know we must be running in step (not resolver
              // emulation) context due to assertStep
            } else if (
              context.scope.isConnectionEdgeType ||
              context.scope.isPageInfo ||
              context.scope.isPgRangeType ||
              context.scope.isPgRangeBoundType ||
              context.scope.isPgPointType
            ) {
              // These all expect to use the default plan resolver.
              // TODO: when we have diagnostics we should point out wrapping
              // these adds overhead where there needn't be any.
            } else {
              queueResolverEmulationWarning(`${Self.name}.${fieldName}`);
            }
          }

          const typeName = Self.name;
          return {
            ...field,
            plan: EXPORTABLE(
              (
                ExecutableStep,
                autoApplyFieldArgs,
                fieldName,
                inspect,
                isStep,
                oldPlan,
                planWrapper,
                typeName,
              ) =>
                function wrappedPlan(this: any, ...planParams) {
                  // A replacement for `oldPlan` that automatically passes through arguments that weren't replaced
                  const smartPlan = (...overrideParams: Array<any>) => {
                    const args = [
                      ...overrideParams.concat(
                        planParams.slice(overrideParams.length),
                      ),
                    ] as typeof planParams;
                    const $prev = oldPlan.apply(this, args);
                    if (!($prev instanceof ExecutableStep)) {
                      console.error(
                        `Wrapped a plan function at ${typeName}.${fieldName}, but that function did not return a step!\n${String(
                          oldPlan,
                        )}`,
                      );

                      throw new Error(
                        "Wrapped a plan function, but that function did not return a step!",
                      );
                    }
                    if (autoApplyFieldArgs) {
                      args[1].autoApply($prev);
                    }
                    return $prev;
                  };
                  const [$source, fieldArgs, info] = planParams;
                  const $newPlan = planWrapper(
                    smartPlan,
                    $source,
                    fieldArgs,
                    info,
                  );
                  if ($newPlan === undefined) {
                    throw new Error(
                      "Your plan wrapper didn't return anything; it must return a step or null!",
                    );
                  }
                  if ($newPlan !== null && !isStep($newPlan)) {
                    throw new Error(
                      `Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect(
                        $newPlan,
                      )})`,
                    );
                  }
                  return $newPlan;
                },
              [
                ExecutableStep,
                autoApplyFieldArgs,
                fieldName,
                inspect,
                isStep,
                oldPlan,
                planWrapper,
                typeName,
              ],
            ),
          };
        },
      },
    },
  };
}

/** @deprecated Renamed to wrapPlans */
export const makeWrapPlansPlugin = wrapPlans;
