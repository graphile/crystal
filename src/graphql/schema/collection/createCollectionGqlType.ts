import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLOutputType } from 'graphql'
import { Collection, Condition, ObjectType, Relation, conditionHelpers } from '../../../interface'
import { memoize2, formatName, buildObject, idSerde } from '../../utils'
import getNodeInterfaceType from '../node/getNodeInterfaceType'
import getGqlType from '../getGqlType'
import createConnectionGqlField from '../connection/createConnectionGqlField'
import BuildToken from '../BuildToken'
import createCollectionRelationTailGqlFieldEntries from './createCollectionRelationTailGqlFieldEntries'
import getConditionGqlType from './getConditionGqlType'

/**
 * Creates the output object type for a collection. This type will include all
 * of the fields in the object, as well as an id field, computed columns, and
 * relations (head and tail).
 */
export default function createCollectionGqlType (buildToken: BuildToken, collection: Collection): GraphQLObjectType {
  const { options, inventory } = buildToken
  const { type, primaryKey } = collection
  const collectionTypeName = formatName.type(type.name)

  return new GraphQLObjectType({
    name: collectionTypeName,
    description: collection.description,

    // If there is a primary key, this is a node.
    interfaces: primaryKey ? [getNodeInterfaceType(buildToken)] : [],

    // We make `fields` here a thunk because we don’t want to eagerly create
    // types for collections used in this type.
    fields: () => buildObject<GraphQLFieldConfig<ObjectType.Value, mixed>>(
      // Our id field. It is powered by the collection’s primary key. If we
      // have no primary key, we have no id field.
      [
        primaryKey && [options.nodeIdFieldName, {
          description: 'A globally unique identifier. Can be used in various places throughout the system to identify this single value.',
          type: new GraphQLNonNull(GraphQLID),
          resolve: value => idSerde.serialize(collection, value),
        }],
      ],

      // Add all of the basic fields to our type.
      Array.from(type.fields.entries())
        .map(<TFieldValue>([fieldName, field]: [string, ObjectType.Field<TFieldValue>]): [string, GraphQLFieldConfig<ObjectType.Value, TFieldValue>] =>
          [formatName.field(fieldName), {
            description: field.description,
            type: getGqlType(buildToken, field.type, false) as GraphQLOutputType<TFieldValue>,
            resolve: value =>
              // Since we get `mixed` back here from the map, we’re just going
              // to assume the type is ok instead of running an `isTypeOf`
              // check. Generally `isTypeOf` isn’t super efficient so we only
              // use it on user input.
              // tslint:disable-next-line no-any
              value.get(fieldName) as any,
          }],
        ),

      // Add extra fields that may exist in our hooks.
      buildToken._hooks.objectTypeFieldEntries
        ? buildToken._hooks.objectTypeFieldEntries(type, buildToken)
        : [],

      // Add fields from relations where this collection is the tail.
      createCollectionRelationTailGqlFieldEntries(buildToken, collection),

      // Add all of our one-to-many relations (aka head relations).
      inventory.getRelations()
        // We only want the relations for which this collection is the head
        // collection.
        .filter(relation => relation.headCollectionKey.collection === collection)
        // Transform the relation into a field entry.
        .map(<THeadKey>(relation: Relation<THeadKey>): [string, GraphQLFieldConfig<ObjectType.Value, mixed>] | null => {
          const tailCollection = relation.tailCollection
          const tailPaginator = tailCollection.paginator

          // If there is no tail paginator, or the relation cannot get a
          // condition for that paginator we can’t provide this field so
          // return null.
          if (!tailPaginator || !relation.getTailConditionFromHeadValue)
            return null

          const { gqlType: gqlConditionType, fromGqlInput: conditionFromGqlInput } = getConditionGqlType(buildToken, tailCollection.type)
          return [
            formatName.field(`${tailCollection.name}-by-${relation.name}`),
            createConnectionGqlField<ObjectType.Value, Condition, ObjectType.Value>(buildToken, tailPaginator, {
              // The one input arg we have for this connection is the `condition` arg.
              inputArgEntries: [
                ['condition', {
                  description: 'A condition to be used in determining which values should be returned by the collection.',
                  type: gqlConditionType,
                }],
              ],
              // We use the config when creating a connection field to inject
              // a condition that limits what we select from the paginator.
              getPaginatorInput: (headValue: ObjectType.Value, args: { condition?: { [key: string]: mixed } }) =>
                conditionHelpers.and(
                  relation.getTailConditionFromHeadValue!(headValue),
                  conditionFromGqlInput(args.condition),
                ),
            }),
          ]
        }),
    ),
  })
}
