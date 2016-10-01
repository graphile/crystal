import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID, GraphQLOutputType } from 'graphql'
import { Context, Collection, ObjectType, Relation } from '../../../interface'
import { memoize2, formatName, buildObject, idSerde, scrib } from '../../utils'
import getNodeInterfaceType from '../node/getNodeInterfaceType'
import getType from '../getType'
import createConnectionField from '../connection/createConnectionField'
import BuildToken from '../BuildToken'

// Private implementation of `getCollectionType`, types aren’t that great.
const _getCollectionType = memoize2(createCollectionType)

/**
 * Creates the output object type for a collection. This type will include all
 * of the fields in the object, as well as an id field, computed columns, and
 * relations (head and tail).
 */
function getCollectionType <TValue>(buildToken: BuildToken, collection: Collection): GraphQLObjectType<ObjectType.Value> {
  return _getCollectionType(buildToken, collection)
}

export default getCollectionType

/**
 * The private non-memoized implementation of `getCollectionType`.
 *
 * @private
 */
function createCollectionType (buildToken: BuildToken, collection: Collection): GraphQLObjectType<ObjectType.Value> {
  const { options, inventory } = buildToken
  const { type, primaryKey } = collection
  const collectionTypeName = formatName.type(type.name)

  return new GraphQLObjectType<ObjectType.Value>({
    name: collectionTypeName,
    description: collection.description,

    isTypeOf: value => type.isTypeOf(value),

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
            type: getType(buildToken, field.type, false) as GraphQLOutputType<TFieldValue>,
            resolve: value =>
              // Since we get `mixed` back here from the map, we’re just going
              // to assume the type is ok instead of running an `isTypeOf`
              // check. Generally `isTypeOf` isn’t super efficient so we only
              // use it on user input.
              value.get(fieldName) as any,
          }]
        ),

      // TODO: Computed fields

      // Add all of our many-to-one relations (aka tail relations).
      inventory.getRelations()
        // We only want the relations for which this collection is the tail
        // collection and whose `headCollectionKey` have a `read`
        // implementation.
        .filter(relation =>
          relation.tailCollection === collection &&
          relation.headCollectionKey.read != null
        )
        // Transform the relation into a field entry.
        .map(<THeadValue, TKey>(relation: Relation<TKey>): [string, GraphQLFieldConfig<ObjectType.Value, ObjectType.Value>] => {
          const headCollectionKey = relation.headCollectionKey
          const headCollection = headCollectionKey.collection
          const headCollectionType = getCollectionType(buildToken, headCollection)

          return [formatName.field(`${headCollection.type.name}-by-${relation.name}`), {
            description: `Reads a single ${scrib.type(headCollectionType)} that is related to this \`${collectionTypeName}\`.`,

            type: headCollectionType,

            async resolve (value, args, context): Promise<ObjectType.Value | undefined> {
              if (!(context instanceof Context))
                throw new Error('GraphQL context must be an instance of `Context`.')

              const key = relation.getHeadKeyFromTailValue(value)
              const headValue = await headCollectionKey.read!(context, key)

              if (!headValue)
                return

              return headValue
            },
          }]
        }),

      // // Add all of our one-to-many relations (aka head relations).
      // inventory.getRelations()
      //   // We only want the relations for which this collection is the head
      //   // collection.
      //   .filter(relation => relation.getHeadCollectionKey().getCollection() === collection)
      //   // Transform the relation into a field entry.
      //   .map(<TTailValue, TKey>(relation: Relation<TTailValue, TValue, TKey>): [string, GraphQLFieldConfig<TValue, any>] | undefined => {
      //     const tailCollection = relation.getTailCollection()
      //     const tailPaginator = relation.getTailPaginator()

      //     // TODO: This shouldn’t be optional?
      //     if (!tailPaginator) return undefined

      //     return [
      //       formatName.field(`${tailCollection.getName()}-by-${relation.getName()}`),
      //       createConnectionField(buildToken, tailPaginator, {
      //         // We use the config when creating a connection field to inject
      //         // a condition that limits what we select from the paginator.
      //         getCondition: (headValue: TValue) => relation.getTailConditionFromHeadValue(headValue),
      //       }),
      //     ]
      //   }),
    ),
  })
}
