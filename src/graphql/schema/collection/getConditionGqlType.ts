import { GraphQLInputObjectType, GraphQLInputFieldConfig } from 'graphql'
import { Condition, conditionHelpers, NullableType, ObjectType } from '../../../interface'
import { buildObject, memoize2 } from '../../utils'
import getGqlInputType from '../type/getGqlInputType'
import BuildToken from '../BuildToken'

export default memoize2(createConditionGqlType)

function createConditionGqlType <TValue>(buildToken: BuildToken, type: ObjectType<TValue>): {
  gqlType: GraphQLInputObjectType,
  fromGqlInput: (condition?: { [key: string]: mixed }) => Condition,
} {
  const formatName = buildToken.options.formatName
  // Creates the field entries for our paginator condition type.
  const gqlConditionFieldEntries =
    Array.from(type.fields).map(
      <TFieldValue>([fieldName, field]: [string, ObjectType.Field<TValue, TFieldValue>]) => {
        const { gqlType, fromGqlInput } = getGqlInputType(buildToken, new NullableType(field.type))
        return {
          key: formatName.field(fieldName),
          value: {
            description: `Checks for equality with the object’s \`${formatName.field(fieldName)}\` field.`,
            // Get the type for this field, but always make sure that it is
            // nullable. We don’t want to require conditions.
            type: gqlType,
            // We include this internal name so that we can resolve the
            // arguments back into actual values.
            internalName: fieldName,
            // We also include the input transformer function so we can use it
            // later.
            fromGqlInput,
          },
        }
      })

  // Creates our GraphQL condition type.
  const gqlType = new GraphQLInputObjectType({
    name: formatName.queryAllConditionType(type.name),
    description: `A condition to be used against \`${formatName.type(type.name)}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
    fields: buildObject<GraphQLInputFieldConfig>(gqlConditionFieldEntries),
  })

  const fromGqlInput = (condition?: { [key: string]: mixed }): Condition =>
    condition ? (
      conditionHelpers.and(
        ...gqlConditionFieldEntries.map(({ key: fieldName, value: { internalName, fromGqlInput: fieldFromGqlInput } }) =>
          typeof condition![fieldName] !== 'undefined'
            // If the argument exists, create a condition and transform the
            // input value.
            ? conditionHelpers.fieldEquals(internalName, fieldFromGqlInput(condition![fieldName]))
            // If the argument does not exist, this condition should just be
            // true (which will get filtered out by `conditionHelpers.and`).
            : true,
        ),
      )
    ) : true

  return { gqlType, fromGqlInput }
}
