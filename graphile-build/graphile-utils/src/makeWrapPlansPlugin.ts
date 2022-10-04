import type {
  FieldArgs,
  FieldPlanResolver,
  GraphileFieldConfig,
} from "grafast";
import { access, ExecutableStep } from "grafast";
import { inspect } from "util";

type PlanWrapperFn = (
  plan: FieldPlanResolver<any, any, any>,
  $source: ExecutableStep,
  args: FieldArgs,
) => any;

interface PlanWrapperRule {
  plan?: PlanWrapperFn;
  // subscribePlan?: PlanWrapperFn;
}

interface PlanWrapperRules {
  [typeName: string]: {
    [fieldName: string]: PlanWrapperRule | PlanWrapperFn;
  };
}

type PlanWrapperRulesGenerator = (
  options: GraphileBuild.GraphileBuildSchemaOptions,
) => PlanWrapperRules;

type ResolverWrapperFilter<T> = (
  context: GraphileBuild.ContextObject,
  build: GraphileBuild.Build,
  field: GraphileFieldConfig<any, any, any, any, any>,
  options: GraphileBuild.GraphileBuildSchemaOptions,
) => T | null;

type ResolverWrapperFilterRule<T> = (
  match: T,
) => PlanWrapperRule | PlanWrapperFn;

let counter = 0;

export function makeWrapPlansPlugin(
  rulesOrGenerator: PlanWrapperRules | PlanWrapperRulesGenerator,
): GraphileConfig.Plugin;
export function makeWrapPlansPlugin<T>(
  filter: ResolverWrapperFilter<T>,
  rule: ResolverWrapperFilterRule<T>,
): GraphileConfig.Plugin;
export function makeWrapPlansPlugin<T>(
  rulesOrGeneratorOrFilter:
    | PlanWrapperRules
    | PlanWrapperRulesGenerator
    | ResolverWrapperFilter<T>,
  rule?: ResolverWrapperFilterRule<T>,
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
          const filter: ResolverWrapperFilter<T> | null = rule
            ? (rulesOrGeneratorOrFilter as any)
            : null;

          const rules: PlanWrapperRules | null =
            typeof rulesOrGenerator === "function"
              ? rulesOrGenerator(build.options)
              : rulesOrGenerator;
          build[symbol] = {
            rules,
            filter,
          };
          return build;
        },
        GraphQLObjectType_fields_field(field, build, context) {
          const rules = build[symbol].rules as PlanWrapperRules | null;
          const filter = build[symbol]
            .filter as ResolverWrapperFilter<T> | null;
          const {
            Self,
            scope: { fieldName },
          } = context;
          let planWrapperOrSpec;
          if (filter) {
            const filterResult: any = filter(
              context,
              build,
              field,
              build.options,
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
          const {
            plan: oldPlan = ($obj: ExecutableStep) => access($obj, fieldName),
          } = field;
          return {
            ...field,
            plan(...planParams) {
              const smartResolve = (...overrideParams: Array<any>) => {
                const $prev = oldPlan(
                  // @ts-ignore We're calling it dynamically, allowing the parent to override args.
                  ...overrideParams.concat(
                    planParams.slice(overrideParams.length),
                  ),
                );
                if (!($prev instanceof ExecutableStep)) {
                  console.error(
                    `Wrapped a plan function, but that function did not return a step!\n${String(
                      oldPlan,
                    )}\n${inspect(field)}`,
                  );

                  throw new Error(
                    "Wrapped a plan function, but that function did not return a step!",
                  );
                }
                return $prev;
              };
              const [$source, fieldArgs] = planParams;
              return planWrapper(smartResolve, $source, fieldArgs);
            },
          };
        },
      },
    },
  };
}
