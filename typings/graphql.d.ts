declare module 'graphql' {
  import {
    GraphQLScalarType,
    GraphQLObjectType,
    GraphQLInterfaceType,
    GraphQLEnumType,
    GraphQLInputObjectType,
    GraphQLList,
    GraphQLNonNull,
  } from 'graphql'

  export type GraphQLType =
    GraphQLScalarType |
    GraphQLObjectType |
    GraphQLInterfaceType |
    GraphQLEnumType |
    GraphQLInputObjectType |
    GraphQLList<any> |
    GraphQLNonNull<any>

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
}
