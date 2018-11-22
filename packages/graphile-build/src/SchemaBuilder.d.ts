import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLInputObjectType,
  GraphQLEnumType,
  GraphQLOutputType,
  GraphQLFieldResolver,
  GraphQLFieldConfigArgumentMap,
  GraphQLFieldConfigMap,
  GraphQLFieldConfig,
  GraphQLEnumValueConfigMap,
  GraphQLEnumValueConfig,
  GraphQLInputFieldConfigMap,
  GraphQLInputFieldConfig,
} from "graphql";
import { EventEmitter } from "events";

type mixed = {} | string | number | boolean | undefined | null;

export interface Options {
  [str: string]: mixed;
}

export interface Plugin {
  (builder: SchemaBuilder, options: Options): Promise<void> | void;
  displayName?: string;
}

export type TriggerChangeType = () => void;
export type WatchUnwatch = (triggerChange: TriggerChangeType) => void;

export type SchemaListener = (newSchema: GraphQLSchema) => void;
export type DataForType = {
  [str: string]: Array<mixed>;
};

export type InitObject = never;

export interface Build {
  [str: string]: any;
}
export interface Inflection {
  [str: string]: any;
}
export interface Scope<Type> {
  [str: string]: any;
}
export interface Context<Type> {
  scope: Scope<Type>;
  [str: string]: any;
}

export type Hook<Type> = (
  input: Type,
  build: Build,
  context: Context<Type>
) => Type;

export default class SchemaBuilder extends EventEmitter {
  hook(hookName: "build", fn: Hook<Build>): void;
  hook(hookName: "inflection", fn: Hook<Inflection>): void;
  hook(hookName: "init", fn: Hook<InitObject>): void;
  hook(hookName: "GraphQLSchema", fn: Hook<GraphQLSchema>): void;
  hook(hookName: "GraphQLObjectType", fn: Hook<GraphQLObjectType>): void;
  hook(
    hookName: "GraphQLObjectType:interfaces",
    fn: Hook<Array<GraphQLInterfaceType>>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields",
    fn: Hook<GraphQLFieldConfigMap<TSource, TContext>>
  ): void;
  hook<TSource, TContext>(
    hookName: "GraphQLObjectType:fields:field",
    fn: Hook<GraphQLFieldConfig<TSource, TContext>>
  ): void;
  hook(
    hookName: "GraphQLObjectType:fields:field:args",
    fn: Hook<GraphQLFieldConfigArgumentMap>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType",
    fn: Hook<GraphQLInputObjectType>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields",
    fn: Hook<GraphQLInputFieldConfigMap>
  ): void;
  hook(
    hookName: "GraphQLInputObjectType:fields:field",
    fn: Hook<GraphQLInputFieldConfig>
  ): void;
  hook(hookName: "GraphQLEnumType", fn: Hook<GraphQLEnumType>): void;
  hook(
    hookName: "GraphQLEnumType:values",
    fn: Hook<GraphQLEnumValueConfigMap>
  ): void;
  hook(
    hookName: "GraphQLEnumType:values:value",
    fn: Hook<GraphQLEnumValueConfig>
  ): void;
  hook(hookName: "finalize", fn: Hook<GraphQLSchema>): void;

  /*
  applyHooks(
    build: Build,
    hookName: "build",
    input: Build,
    context: Context<Build>,
    debugStr?: string
  ): Build;
  applyHooks(
    build: Build,
    hookName: "inflection",
    input: Inflection,
    context: Context<Inflection>,
    debugStr?: string
  ): Inflection;
  applyHooks(
    build: Build,
    hookName: "init",
    input: InitObject,
    context: Context<InitObject>,
    debugStr?: string
  ): InitObject;
  applyHooks(
    build: Build,
    hookName: "GraphQLSchema",
    input: GraphQLSchema,
    context: Context<GraphQLSchema>,
    debugStr?: string
  ): GraphQLSchema;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType",
    input: GraphQLObjectType,
    context: Context<GraphQLObjectType>,
    debugStr?: string
  ): GraphQLObjectType;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:interfaces",
    input: Array<GraphQLInterfaceType>,
    context: Context<Array<GraphQLInterfaceType>>,
    debugStr?: string
  ): Array<GraphQLInterfaceType>;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields",
    input: GraphQLFieldConfigMap,
    context: Context<GraphQLFieldConfigMap>,
    debugStr?: string
  ): GraphQLFieldConfigMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields:field",
    input: GraphQLFieldConfig,
    context: Context<GraphQLFieldConfig>,
    debugStr?: string
  ): GraphQLFieldConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLObjectType:fields:field:args",
    input: GraphQLFieldConfigArgumentMap,
    context: Context<GraphQLFieldConfigArgumentMap>,
    debugStr?: string
  ): GraphQLFieldConfigArgumentMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType",
    input: GraphQLInputObjectType,
    context: Context<GraphQLInputObjectType>,
    debugStr?: string
  ): GraphQLInputObjectType;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType:fields",
    input: GraphQLInputObjectConfigFieldMap,
    context: Context<GraphQLInputObjectConfigFieldMap>,
    debugStr?: string
  ): GraphQLInputObjectConfigFieldMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLInputObjectType:fields:field",
    input: GraphQLInputObjectFieldConfig,
    context: Context<GraphQLInputObjectFieldConfig>,
    debugStr?: string
  ): GraphQLInputObjectFieldConfig;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType",
    input: GraphQLEnumType,
    context: Context<GraphQLEnumType>,
    debugStr?: string
  ): GraphQLEnumType;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType:values",
    input: GraphQLEnumValueConfigMap,
    context: Context<GraphQLEnumValueConfigMap>,
    debugStr?: string
  ): GraphQLEnumValueConfigMap;
  applyHooks(
    build: Build,
    hookName: "GraphQLEnumType:values:value",
    input: GraphQLEnumValueConfig,
    context: Context<GraphQLEnumValueConfig>,
    debugStr?: string
  ): GraphQLEnumValueConfig;
  */

  registerWatcher(listen: WatchUnwatch, unlisten: WatchUnwatch): void;

  createBuild(): Build;

  buildSchema(): GraphQLSchema;

  watchSchema(listener?: SchemaListener): Promise<void>;

  unwatchSchema(): Promise<void>;
}
