import { GraphQLFieldConfig } from 'graphql'
import { ObjectType, Collection, Relation } from '../../../interface'
import { formatName, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import getCollectionGqlType from './getCollectionGqlType'

/**
 * Creates the fields for which the collection argument is the tail.
 * These fields will fetch a value from the head collection.
 */
// TODO: test
export default function createCollectionRelationTailGqlFieldEntries (
  buildToken: BuildToken,
  collection: Collection,
  options: {
    getCollectionValue?: (source: mixed) => ObjectType.Value,
    getFieldName?: <TKey>(relation: Relation<TKey>, collection: Collection) => string,
  } = {},
): Array<[string, GraphQLFieldConfig<mixed, ObjectType.Value>]> {
  const { inventory } = buildToken

  // Some tests may choose to not include the inventory. If this is the case,
  // just return an empty array.
  if (!inventory) return []

  const collectionGqlType = getCollectionGqlType(buildToken, collection)
  return (
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
        const headCollectionGqlType = getCollectionGqlType(buildToken, headCollection)

        return [
          options.getFieldName
            ? options.getFieldName(relation, collection)
            : formatName.field(`${headCollection.type.name}-by-${relation.name}`),
          {
            description: `Reads a single ${scrib.type(headCollectionGqlType)} that is related to this \`${collectionGqlType}\`.`,
            type: headCollectionGqlType,
            async resolve (source, args, context): Promise<ObjectType.Value | undefined> {
              const value = options.getCollectionValue ? options.getCollectionValue(source) : source
              const key = relation.getHeadKeyFromTailValue(value)
              const headValue = await headCollectionKey.read!(context, key)

              if (headValue == null)
                return

              return headValue
            },
          },
        ]
      })
  )
}
