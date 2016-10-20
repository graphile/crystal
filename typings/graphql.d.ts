declare module 'graphql' {
  import {
    GraphQLType,
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLInterfaceType,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLUnionType,
  } from 'graphql'

  export type GraphQLType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList<any> |
    GraphQLNonNull<any> |
    GraphQLUnionType

  export type GraphQLInputType =
    GraphQLScalarType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList<any> |
    GraphQLNonNull<
      GraphQLScalarType |
      GraphQLEnumType |
      GraphQLInputObjectType |
      GraphQLList<any>
    >

  export type GraphQLOutputType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLUnionType |
    GraphQLEnumType |
    GraphQLList<any> |
    GraphQLNonNull<
      GraphQLScalarType |
      GraphQLObjectType |
      GraphQLInterfaceType |
      GraphQLUnionType |
      GraphQLEnumType |
      GraphQLList<any>
    >;

  export function isOutputType (type: GraphQLType): type is GraphQLOutputType
  export function isInputType (type: GraphQLType): type is GraphQLInputType

  export interface GraphQLFieldConfig<TSource> {
    type: GraphQLOutputType;
    args?: GraphQLFieldConfigArgumentMap;
    resolve?: GraphQLFieldResolveFn<TSource>;
    deprecationReason?: string;
    description?: string;
  }

  export type GraphQLFieldResolveFn<TSource> = (
    source: TSource,
    args: { [argName: string]: any },
    context: any,
    info: GraphQLResolveInfo
  ) => any;

  export interface GraphQLResolveInfo {
    fieldName: string;
    // fieldASTs: Array<Field>;
    returnType: GraphQLOutputType;
    // parentType: GraphQLCompositeType;
    path: Array<string | number>;
    // schema: GraphQLSchema;
    // fragments: { [fragmentName: string]: FragmentDefinition };
    rootValue: any;
    // operation: OperationDefinition;
    variableValues: { [variableName: string]: any };
  }

  export interface GraphQLFieldConfigArgumentMap {
    [argName: string]: GraphQLArgumentConfig;
  }

  export interface GraphQLArgumentConfig {
    type: GraphQLInputType;
    defaultValue?: any;
    description?: string;
  }
}
