import { GraphQLFieldConfig, GraphQLInputObjectType, GraphQLInputFieldConfig } from 'graphql'
import { Collection, Condition, conditionHelpers, NullableType, ObjectType, Paginator, Relation } from '../../../interface'
import { formatName, buildObject, memoize2 } from '../../utils'
import BuildToken from '../BuildToken'
import getGqlType from '../getGqlType'
import createConnectionGqlField from '../connection/createConnectionGqlField'
import transformGqlInputValue from '../transformGqlInputValue'

const getConditionGqlTypeAndConditionFieldEntries = memoize2((buildToken: BuildToken, type: ObjectType) => {
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
  const gqlConditionType = new GraphQLInputObjectType({
    name: formatName.type(`${type.name}-condition`),
    description: `A condition to be used against \`${formatName.type(type.name)}\` object types. All fields are tested for equality and combined with a logical ‘and.’`,
    fields: buildObject<GraphQLInputFieldConfig<mixed>>(gqlConditionFieldEntries),
  })

  return {gqlConditionType, gqlConditionFieldEntries}
})

type Nullable<T> = T | null

export default function createConnectionFieldFromPaginator <TSource, TItemValue, THeadKey>(
  buildToken: BuildToken,
  paginator: Paginator<Condition, TItemValue>,
  collection: Collection,
  relation: Nullable<Relation<THeadKey>>,
): [string, GraphQLFieldConfig<mixed, mixed>] {
  const type = collection.type

  const {gqlConditionType, gqlConditionFieldEntries} = getConditionGqlTypeAndConditionFieldEntries(buildToken, type)

  // Gets the condition input for our paginator by looking through the
  // arguments object and adding a field condition for all the values we
  // find.
  const getPaginatorInput = (source: ObjectType.Value, args: { condition?: { [key: string]: mixed } }): Condition =>
    conditionHelpers.and(
      // If this is a reverse relation, add the relation condition
      relation
        ? relation.getTailConditionFromHeadValue!(source)
        : true,
      // For all of our field condition entries, let us add an actual
      // condition to test equality with a given field.
      ...(
        args.condition
          ? gqlConditionFieldEntries.map(([fieldName, field]) =>
            typeof args.condition![fieldName] !== 'undefined'
              // If the argument exists, create a condition and transform the
              // input value.
              ? conditionHelpers.fieldEquals(field.internalName, transformGqlInputValue(field.type, args.condition![fieldName]))
              // If the argument does not exist, this condition should just be
              // true (which will get filtered out by `conditionHelpers.and`).
              : true
          )
          : []
      )
    )

  const fieldName =
    relation
      ? formatName.field(`${collection.name}-by-${relation.name}`)
      : formatName.field(`all-${collection.name}`)

  return [
    fieldName,
    createConnectionGqlField(buildToken, paginator, {
      // The one input arg we have for this connection is the `condition` arg.
      inputArgEntries: [
        ['condition', {
          description: 'A condition to be used in determining which values should be returned by the collection.',
          type: gqlConditionType,
        }],
      ],
      getPaginatorInput,
    }),
  ]
}
