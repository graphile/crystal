import { SchemaBuilder } from "graphile-build";
import {
  makeFieldHelpers,
  requireChildColumn,
  requireSiblingColumn,
} from "./fieldHelpers";

export type ResolverWrapperFn<
  TSource = any,
  TContext = any,
  TArgs = { [argName: string]: any }
> = (
  //resolve: import("graphql").GraphQLFieldResolver<TSource, TContext, TArgs>,
  resolve: (
    parent?: any,
    args?: { [key: string]: any },
    context?: GraphileEngine.GraphileResolverContext,
    info?: import("graphql").GraphQLResolveInfo,
  ) => any,
  source: TSource,
  args: TArgs,
  context: TContext,
  resolveInfo: import("graphql").GraphQLResolveInfo,
) => any;
interface ResolverWrapperRequirements {
  childColumns?: Array<{ column: string; alias: string }>;
  siblingColumns?: Array<{ column: string; alias: string }>;
}

interface ResolverWrapperRule {
  requires?: ResolverWrapperRequirements;
  resolve?: ResolverWrapperFn;
  // subscribe?: ResolverWrapperFn;
}

interface ResolverWrapperRules {
  [typeName: string]: {
    [fieldName: string]: ResolverWrapperRule | ResolverWrapperFn;
  };
}

type ResolverWrapperRulesGenerator = (
  options: GraphileEngine.GraphileBuildOptions,
) => ResolverWrapperRules;

type ResolverWrapperFilter<T> = (
  context: GraphileEngine.ContextGraphQLObjectTypeFieldsField,
  build: GraphileEngine.Build,
  field: import("graphql").GraphQLFieldConfig<any, any>,
  options: GraphileEngine.GraphileBuildOptions,
) => T | null;

export type ResolverWrapperFilterRule<T> = (
  match: T,
) => ResolverWrapperRule | ResolverWrapperFn;

export default function makeWrapResolversPlugin(
  rulesOrGenerator: ResolverWrapperRules | ResolverWrapperRulesGenerator,
): GraphileEngine.Plugin;
export default function makeWrapResolversPlugin<T>(
  filter: ResolverWrapperFilter<T>,
  rule: ResolverWrapperFilterRule<T>,
): GraphileEngine.Plugin;
export default function makeWrapResolversPlugin<T>(
  rulesOrGeneratorOrFilter:
    | ResolverWrapperRules
    | ResolverWrapperRulesGenerator
    | ResolverWrapperFilter<T>,
  rule?: ResolverWrapperFilterRule<T>,
): GraphileEngine.Plugin {
  if (rule && typeof rule !== "function") {
    throw new Error(
      "Invalid call signature for makeWrapResolversPlugin, expected second argument to be a function",
    );
  }
  return (
    builder: SchemaBuilder,
    options: GraphileEngine.GraphileBuildOptions,
  ) => {
    // Disambiguate first argument
    const rulesOrGenerator:
      | ResolverWrapperRules
      | ResolverWrapperRulesGenerator
      | null = rule ? null : (rulesOrGeneratorOrFilter as any);
    const filter: ResolverWrapperFilter<T> | null = rule
      ? (rulesOrGeneratorOrFilter as any)
      : null;

    const rules: ResolverWrapperRules | null =
      typeof rulesOrGenerator === "function"
        ? rulesOrGenerator(options)
        : rulesOrGenerator;
    builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
      const {
        Self,
        scope: { fieldName },
      } = context;
      let resolveWrapperOrSpec;
      if (filter) {
        const filterResult: any = filter(context, build, field, options);
        if (!filterResult) {
          if (filterResult !== null) {
            // eslint-disable-next-line no-console
            console.error(
              `Filter should return either a truthy value, or 'null', instead received: '${filterResult}'`,
            );
          }
          return field;
        }
        resolveWrapperOrSpec = rule!(filterResult);
      } else if (rules) {
        const typeRules = rules[Self.name];
        if (!typeRules) {
          return field;
        }
        resolveWrapperOrSpec = typeRules[fieldName];
      } else {
        // Should not happen
        throw new Error(
          "Bad call signature for function makeWrapResolversPlugin",
        );
      }
      if (!resolveWrapperOrSpec) {
        return field;
      }
      const resolveWrapper: ResolverWrapperFn | undefined =
        typeof resolveWrapperOrSpec === "function"
          ? resolveWrapperOrSpec
          : resolveWrapperOrSpec.resolve;
      const resolveWrapperRequirements:
        | ResolverWrapperRequirements
        | undefined =
        typeof resolveWrapperOrSpec === "function"
          ? undefined
          : resolveWrapperOrSpec.requires;
      if (resolveWrapperRequirements) {
        // Perform requirements
        if (resolveWrapperRequirements.childColumns) {
          resolveWrapperRequirements.childColumns.forEach(
            ({ column, alias }) => {
              requireChildColumn(build, context, column, alias);
            },
          );
        }
        if (resolveWrapperRequirements.siblingColumns) {
          resolveWrapperRequirements.siblingColumns.forEach(
            ({ column, alias }) => {
              requireSiblingColumn(build, context, column, alias);
            },
          );
        }
      }
      if (!resolveWrapper) {
        return field;
      }
      const { resolve: oldResolve = (obj: object) => obj[fieldName] } = field;
      return {
        ...field,
        async resolve(...resolveParams) {
          const smartResolve = (...overrideParams: Array<any>) =>
            oldResolve(
              // @ts-ignore We're calling it dynamically, allowing the parent to override args.
              ...overrideParams.concat(
                resolveParams.slice(overrideParams.length),
              ),
            );
          const [source, args, graphqlContext, resolveInfo] = resolveParams;
          const resolveInfoWithHelpers = {
            ...resolveInfo,
            graphile: makeFieldHelpers(
              build,
              context,
              graphqlContext,
              resolveInfo,
            ),
          };
          return resolveWrapper(
            smartResolve,
            source,
            args,
            graphqlContext,
            resolveInfoWithHelpers,
          );
        },
      };
    });
  };
}
