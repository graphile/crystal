import {
  GraphQLOutputType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLObjectType,
  getNullableType as getNullableGqlType,
  isOutputType as isOutputGqlType,
} from 'graphql'

import {
  switchType,
  Type,
  ObjectType,
} from '../../../interface'

import { formatName, memoize2, buildObject } from '../../utils'
import BuildToken from '../BuildToken'
import getGqlInputType from './getGqlInputType'

const createGqlOutputType = (buildToken: BuildToken, _type: Type<mixed>): GraphQLOutputType =>
  switchType<GraphQLOutputType>(_type, {
    nullable: type => getNullableGqlType(getGqlOutputType(buildToken, type.nonNullType)),
    list: type => new GraphQLNonNull(new GraphQLList(getGqlOutputType(buildToken, type.itemType))),
    alias: type => getGqlInputTypeAsOutputType(buildToken, type),
    enum: type => getGqlInputTypeAsOutputType(buildToken, type),
    object: <TValue>(type: ObjectType<TValue>): GraphQLOutputType =>
      new GraphQLObjectType({
        name: formatName.type(type.name),
        description: type.description,
        fields: buildObject(Array.from(type.fields).map(
          <TFieldValue>([fieldName, field]: [string, ObjectType.Field<TValue, TFieldValue>]) => ({
            key: formatName.field(fieldName),
            value: {
              description: field.description,
              type: getGqlOutputType(buildToken, type),
              resolve: (value: TValue): TFieldValue => field.getValue(value),
            },
          }))
        ),
      }),
  })

function getGqlInputTypeAsOutputType (buildToken: BuildToken, type: Type<mixed>): GraphQLOutputType {
  const { gqlType: gqlInputType } = getGqlInputType(buildToken, type)

  if (isOutputGqlType(gqlInputType))
    return gqlInputType

  // Should be unreachable if we use this function wisely.
  throw new Error(`Expected GraphQL input type '${gqlInputType.toString()}' to also be an output type.`)
}

const _getGqlOutputType = memoize2(createGqlOutputType)

export default function getGqlOutputType (buildToken: BuildToken, type: Type<mixed>): GraphQLOutputType {
  return _getGqlOutputType(buildToken, type)
}
