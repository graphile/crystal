import { GraphQLInputObjectType, GraphQLInputFieldConfig, GraphQLType } from 'graphql'
import { Condition, conditionHelpers, NullableType, ObjectType, jsonType } from '../../../interface'
import { formatName, buildObject, memoize2 } from '../../utils'
import BuildToken from '../BuildToken'
import getGqlType from '../getGqlType'
import transformGqlInputValue from '../transformGqlInputValue'

export default memoize2(<TSource>(buildToken: BuildToken, type: ObjectType): {
  gqlType: GraphQLInputObjectType<TSource> | GraphQLType<mixed>,
  fromGqlInput: (condition?: { [key: string]: mixed } | mixed) => Condition,
} => {
  if (buildToken.options) {
    const { pgRowMatcher } = buildToken.options

    // In case custom row matching is used, the condition field becomes a JSON.
    if (pgRowMatcher != null) {
      return {
        gqlType: getGqlType(buildToken, new NullableType(jsonType), true),
        fromGqlInput: (condition?: string): Condition =>
          condition ? conditionHelpers.customMatches(pgRowMatcher, condition) : true,
      }
    }
  }

  // Creates the field entries for our paginator condition type.
  const gqlConditionFieldEntries =
    Array.from(type.fields).map<[string, GraphQLInputFieldConfig<mixed> & { internalName: string }]>(([fieldName, field]) =>
      [formatName.field(fieldName), {
        description: `Checks for equality with the object’s \`${formatName.field(fieldName)}\` field.`,
        // Get the type for this field, but always make sure that it is
        // nullable. We don’t want to require conditions.
        type: getGqlType(buildToken, new NullableType(field.type), true),
        // We include this internal name so that we can resolve the arguments
        // back into actual values.
        internalName: fieldName,
      }],
    )

  // Creates our GraphQL condition type.
  const gqlType = new GraphQLInputObjectType<TSource>({
    name: formatName.type(`${type.name}-condition`),
    description: `A condition to be used against \`${formatName.type(type.name)}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
    fields: buildObject<GraphQLInputFieldConfig<mixed>>(gqlConditionFieldEntries),
  })

  const fromGqlInput = (condition?: { [key: string]: mixed }): Condition =>
    condition ? (
      conditionHelpers.and(
        ...gqlConditionFieldEntries.map(([fieldName, field]) =>
          typeof condition![fieldName] !== 'undefined'
            // If the argument exists, create a condition and transform the
            // input value.
            ? conditionHelpers.fieldEquals(field.internalName, transformGqlInputValue(field.type, condition![fieldName]))
            // If the argument does not exist, this condition should just be
            // true (which will get filtered out by `conditionHelpers.and`).
            : true,
        ),
      )
    ) : true

  return {gqlType, fromGqlInput}
})
