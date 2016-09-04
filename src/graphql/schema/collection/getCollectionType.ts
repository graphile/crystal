import { GraphQLObjectType, GraphQLFieldConfig, GraphQLNonNull, GraphQLID } from 'graphql'
import { Catalog, Collection, ObjectField, Relation } from '../../../catalog'
import { memoize2, formatName, buildObject, idSerde } from '../../utils'
import getType from '../type/getType'
import getNodeInterfaceType from '../node/getNodeInterfaceType'
import createConnectionField from '../connection/createConnectionField'
import Context from '../Context'

// Private implementation of `getCollectionType`, types aren’t that great.
const _getCollectionType = memoize2(createCollectionType)

/**
 * Creates the output object type for a collection. This type will include all
 * of the fields in the object, as well as an id field, computed columns, and
 * relations (head and tail).
 */
function getCollectionType <TValue>(context: Context, collection: Collection<TValue>): GraphQLObjectType<TValue> {
  return _getCollectionType(context, collection)
}

export default getCollectionType

/**
 * The private non-memoized implementation of `getCollectionType`.
 *
 * @private
 */
function createCollectionType <TValue>(context: Context, collection: Collection<TValue>): GraphQLObjectType<TValue> {
  const { options, catalog } = context
  const type = collection.getType()
  const primaryKey = collection.getPrimaryKey()

  return new GraphQLObjectType<TValue>({
    name: formatName.type(type.getName()),
    description: type.getDescription(),

    isTypeOf: value => type.isTypeOf(value),

    // If there is a primary key, this is a node.
    interfaces: primaryKey ? [getNodeInterfaceType(context)] : [],

    // We make `fields` here a thunk because we don’t want to eagerly create
    // types for collections used in this type.
    fields: () => buildObject<GraphQLFieldConfig<TValue, mixed>>(
      // Our id field. It is powered by the collection’s primary key. If we
      // have no primary key, we have no id field.
      [
        primaryKey && [options.nodeIdFieldName, {
          // TODO: description
          type: new GraphQLNonNull(GraphQLID),
          resolve: value =>
            idSerde.serialize({
              name: collection.getName(),
              key: primaryKey.getKeyForValue(value),
            }),
        }],
      ],

      // Add all of the basic fields to our type.
      type.getFields().map((field: ObjectField<TValue, mixed>): [string, GraphQLFieldConfig<TValue, mixed>] =>
        [formatName.field(field.getName()), {
          description: field.getDescription(),
          type: getType(context, field.getType(), false),
          resolve: value => field.getFieldValueFromObject(value),
        }]
      ),

      // TODO: Computed fields

      // Add all of our many-to-one relations (aka tail relations).
      catalog.getRelations()
        // We only want the relations for which this collection is the tail
        // collection.
        .filter(relation => relation.getTailCollection() === collection)
        // Transform the relation into a field entry.
        .map(<THeadValue, TKey>(relation: Relation<TValue, THeadValue, TKey>): [string, GraphQLFieldConfig<TValue, THeadValue>] => {
          const headCollectionKey = relation.getHeadCollectionKey()
          const headCollection = headCollectionKey.getCollection()

          return [formatName.field(`${headCollection.getType().getName()}-by-${relation.getName()}`), {
            // TODO: description
            type: getCollectionType(context, headCollection),
            resolve: source => {
              const key = relation.getHeadKeyFromTailValue(source)
              return headCollectionKey.read(key)
            },
          }]
        }),

      // Add all of our one-to-many relations (aka head relations).
      catalog.getRelations()
        // We only want the relations for which this collection is the head
        // collection.
        .filter(relation => relation.getHeadCollectionKey().getCollection() === collection)
        // Transform the relation into a field entry.
        .map(<TTailValue, TKey>(relation: Relation<TTailValue, TValue, TKey>): [string, GraphQLFieldConfig<TValue, any>] | undefined => {
          const tailCollection = relation.getTailCollection()
          const tailPaginator = relation.getTailPaginator()

          if (!tailPaginator) return undefined

          return [
            formatName.field(`${tailCollection.getName()}-by-${relation.getName()}`),
            createConnectionField(context, tailPaginator, {
              // We use the config when creating a connection field to inject
              // a condition that limits what we select from the paginator.
              getCondition: (headValue: TValue) => relation.getTailConditionFromHeadValue(headValue),
            }),
          ]
        }),
    ),
  })
}
