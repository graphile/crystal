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

export interface WrapPlansOptions {
  warnOnResolverEmulation?: boolean;
}

export type PlanWrapperRulesGenerator = (
  build: Partial<GraphileBuild.Build> & GraphileBuild.BuildBase,
) => PlanWrapperRules;

export type PlanWrapperFilter<T> = (
  context: GraphileBuild.ContextObjectFieldsField,
  build: GraphileBuild.Build,
  field: GrafastFieldConfig<any, any, any>,
) => T | null;

export type PlanWrapperFilterRule<T> = (
  match: T,
) => PlanWrapperRule | PlanWrapperFn;

let counter = 0;
const resolverEmulationWarningCoordinates = new Set<string>();
let resolverEmulationWarningTimeout: ReturnType<typeof setTimeout> | null =
  null;

const queueResolverEmulationWarning = (coordinate: string) => {
  resolverEmulationWarningCoordinates.add(coordinate);
  if (resolverEmulationWarningTimeout) {
    return;
  }
  resolverEmulationWarningTimeout = setTimeout(() => {
    const coordinates = [...resolverEmulationWarningCoordinates].sort();
    resolverEmulationWarningCoordinates.clear();
    resolverEmulationWarningTimeout = null;
    if (coordinates.length === 0) {
      return;
    }
    const plural = coordinates.length > 1;
    console.log(
      `[WARNING]: \`wrapPlans(...)\` wrapping default plan resolver for ${
        plural ? "coordinates" : "coordinate"
      } ${coordinates.join(
        ", ",
      )}; if resolver emulation is in use then things may go awry. See https://err.red/pwpr`,
    );
  }, 0);
};

export function wrapPlans(
  rulesOrGenerator: PlanWrapperRules | PlanWrapperRulesGenerator,
  options?: WrapPlansOptions,
): GraphileConfig.Plugin;
export function wrapPlans<T>(
  filter: PlanWrapperFilter<T>,
  rule: PlanWrapperFilterRule<T>,
  options?: WrapPlansOptions,
): GraphileConfig.Plugin;
export function wrapPlans<T>(
  rulesOrGeneratorOrFilter:
    | PlanWrapperRules
    | PlanWrapperRulesGenerator
    | PlanWrapperFilter<T>,
  ruleOrOptions?: PlanWrapperFilterRule<T> | WrapPlansOptions,
  maybeOptions?: WrapPlansOptions,
): GraphileConfig.Plugin {
  const rule =
    typeof ruleOrOptions === "function" ? ruleOrOptions : undefined;
  const options =
    typeof ruleOrOptions === "function" ? maybeOptions : ruleOrOptions;
  if (ruleOrOptions && typeof ruleOrOptions !== "function" && maybeOptions) {
    throw new Error(
      "Invalid call signature for wrapPlans, expected second argument to be a function",
    );
  }
  const warnOnResolverEmulation = options?.warnOnResolverEmulation ?? true;
  const name = `WrapPlansPlugin_${++counter}`;
  const symbol = Symbol(name);
  return {
    name,
    version: "0.0.0",
    schema: {
      hooks: {
        build(build) {
          // Disambiguate first argument
          const rulesOrGenerator:
            | PlanWrapperRules
            | PlanWrapperRulesGenerator
            | null = rule ? null : (rulesOrGeneratorOrFilter as any);
          const filter: PlanWrapperFilter<T> | null = rule
            ? (rulesOrGeneratorOrFilter as any)
            : null;

          const rules: PlanWrapperRules | null =
            typeof rulesOrGenerator === "function"
              ? rulesOrGenerator(build)
              : rulesOrGenerator;
          (build as any)[symbol] = {
            rules,
            filter,
          };
          return build;
        },
        GraphQLObjectType_fields_field(field, build, context) {
          const rules = (build as any)[symbol].rules as PlanWrapperRules | null;
          const {
            EXPORTABLE,
            grafast: { ExecutableStep, isExecutableStep, defaultPlanResolver },
          } = build;
          const filter = (build as any)[symbol]
            .filter as PlanWrapperFilter<T> | null;
          const {
            Self,
            scope: { fieldName },
          } = context;
          let planWrapperOrSpec;
          if (filter) {
            const filterResult: any = filter(context, build, field);
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
          const { plan: oldPlan, resolve, subscribe } = field;

          if (!oldPlan) {
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
            } else if (
              warnOnResolverEmulation &&
              !Self.extensions?.grafast?.assertStep
            ) {
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
                defaultPlanResolver,
                fieldName,
                inspect,
                isExecutableStep,
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
                    const $prev = (oldPlan ?? defaultPlanResolver).apply(
                      this,
                      args,
                    );
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
                  if ($newPlan !== null && !isExecutableStep($newPlan)) {
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
                defaultPlanResolver,
                fieldName,
                inspect,
                isExecutableStep,
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
