import { SchemaBuilder, Options, Plugin } from "graphile-build";
import { GraphQLFieldResolver, GraphQLResolveInfo } from "graphql";
import {
  makeFieldHelpers,
  requireChildColumn,
  requireSiblingColumn,
} from "./fieldHelpers";

type ResolverWrapperFn<
  TSource = any,
  TContext = any,
  TArgs = { [argName: string]: any }
> = (
  resolve: GraphQLFieldResolver<TSource, TContext, TArgs>,
  source: TSource,
  args: TArgs,
  context: TContext,
  resolveInfo: GraphQLResolveInfo
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

type ResolverWrapperRulesGenerator = (options: Options) => ResolverWrapperRules;

export default function makeWrapResolversPlugin(
  rulesOrGenerator: ResolverWrapperRules | ResolverWrapperRulesGenerator
): Plugin {
  return (builder: SchemaBuilder, options: Options) => {
    const rules: ResolverWrapperRules =
      typeof rulesOrGenerator === "function"
        ? rulesOrGenerator(options)
        : rulesOrGenerator;
    builder.hook("GraphQLObjectType:fields:field", (field, build, context) => {
      const {
        Self,
        scope: { fieldName },
      } = context;
      const typeRules = rules[Self.name];
      if (!typeRules) {
        return field;
      }
      const resolveWrapperOrSpec = typeRules[fieldName];
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
            }
          );
        }
        if (resolveWrapperRequirements.siblingColumns) {
          resolveWrapperRequirements.siblingColumns.forEach(
            ({ column, alias }) => {
              requireSiblingColumn(build, context, column, alias);
            }
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
            // @ts-ignore We're calling it dynamically, allowing the parent to override args.
            oldResolve(
              ...overrideParams.concat(
                resolveParams.slice(overrideParams.length)
              )
            );
          const [source, args, graphqlContext, resolveInfo] = resolveParams;
          const resolveInfoWithHelpers = {
            ...resolveInfo,
            graphile: makeFieldHelpers(
              build,
              context,
              graphqlContext,
              resolveInfo
            ),
          };
          return resolveWrapper(
            smartResolve,
            source,
            args,
            graphqlContext,
            resolveInfoWithHelpers
          );
        },
      };
    });
  };
}
