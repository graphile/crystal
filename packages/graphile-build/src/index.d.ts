import { GraphQLSchema, GraphQLResolveInfo, GraphQLType } from "graphql";
import { ResolveTree } from "graphql-parse-resolve-info";

type CaseChangeFunction = (str: string) => string;
export const constantCaseAll: CaseChangeFunction;
export const formatInsideUnderscores: ((
  fn: CaseChangeFunction
) => CaseChangeFunction);
export const upperFirst: CaseChangeFunction;
export const camelCase: CaseChangeFunction;
export const constantCase: CaseChangeFunction;
export const upperCamelCase: CaseChangeFunction;
export const pluralize: CaseChangeFunction;
export const singularize: CaseChangeFunction;

import SchemaBuilder, {
  Plugin,
  Options,
  Build,
  DataForType,
} from "./SchemaBuilder";

export * from "./SchemaBuilder";
export * from "./Live";
export { SchemaBuilder };

export const getBuilder: (
  plugins: Array<Plugin>,
  options: Options
) => Promise<SchemaBuilder>;

export const buildSchema: (
  plugins: Array<Plugin>,
  options: Options
) => Promise<GraphQLSchema>;

export const defaultPlugins: Array<Plugin>;

export const StandardTypesPlugin: Plugin;
export const NodePlugin: Plugin;
export const QueryPlugin: Plugin;
export const MutationPlugin: Plugin;
export const SubscriptionPlugin: Plugin;
export const ClientMutationIdDescriptionPlugin: Plugin;
export const MutationPayloadQueryPlugin: Plugin;

// EXPERIMENTAL, API might change!
export const resolveNode: (
  nodeId: string,
  build: Build,
  helpers: {
    getDataFromParsedResolveInfoFragment: (
      parsedResolveInfoFragment: ResolveTree,
      Type: GraphQLType
    ) => DataForType;
  },
  data: any,
  context: any,
  resolveInfo: GraphQLResolveInfo
) => Promise<null | any>;
