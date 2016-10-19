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
}
