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
  plan?: PlanWrapperFn;
  // subscribePlan?: PlanWrapperFn;
}

export interface PlanWrapperRules {
  [typeName: string]: {
    [fieldName: string]: PlanWrapperRule | PlanWrapperFn;
  };
}

export type PlanWrapperRulesGenerator = (
  build: Partial<GraphileBuild.Build> & GraphileBuild.BuildBase,
) => PlanWrapperRules;

export type PlanWrapperFilter<T> = (
  context: GraphileBuild.ContextObjectFieldsField,
  build: GraphileBuild.Build,
  field: GrafastFieldConfig<any, any, any, any>,
) => T | null;

export type PlanWrapperFilterRule<T> = (
  match: T,
) => PlanWrapperRule | PlanWrapperFn;

let counter = 0;

export function makeWrapPlansPlugin(
  rulesOrGenerator: PlanWrapperRules | PlanWrapperRulesGenerator,
): GraphileConfig.Plugin;
export function makeWrapPlansPlugin<T>(
  filter: PlanWrapperFilter<T>,
  rule: PlanWrapperFilterRule<T>,
): GraphileConfig.Plugin;
export function makeWrapPlansPlugin<T>(
  rulesOrGeneratorOrFilter:
    | PlanWrapperRules
    | PlanWrapperRulesGenerator
    | PlanWrapperFilter<T>,
  rule?: PlanWrapperFilterRule<T>,
): GraphileConfig.Plugin {
  if (rule && typeof rule !== "function") {
    throw new Error(
      "Invalid call signature for makeWrapPlansPlugin, expected second argument to be a function",
    );
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
            throw new Error(
              "Bad call signature for function makeWrapPlansPlugin",
            );
          }
          if (!planWrapperOrSpec) {
            return field;
          }
          const planWrapper: PlanWrapperFn | undefined =
            typeof planWrapperOrSpec === "function"
              ? planWrapperOrSpec
              : planWrapperOrSpec.plan;
          if (!planWrapper) {
            return field;
          }
          const { plan: oldPlan = defaultPlanResolver } = field;
          const typeName = Self.name;
          return {
            ...field,
            plan: EXPORTABLE(
              (
                ExecutableStep,
                fieldName,
                inspect,
                isExecutableStep,
                oldPlan,
                planWrapper,
                typeName,
              ) =>
                (...planParams) => {
                  // A replacement for `oldPlan` that automatically passes through arguments that weren't replaced
                  const smartPlan = (...overrideParams: Array<any>) => {
                    const $prev = oldPlan(
                      // @ts-ignore We're calling it dynamically, allowing the parent to override args.
                      ...overrideParams.concat(
                        planParams.slice(overrideParams.length),
                      ),
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
