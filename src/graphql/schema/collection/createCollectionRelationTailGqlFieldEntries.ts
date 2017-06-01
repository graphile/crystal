import { GraphQLFieldConfig } from 'graphql'
import { Collection, Relation, NullableType } from '../../../interface'
import { formatName, scrib } from '../../utils'
import BuildToken from '../BuildToken'
import getGqlOutputType from '../type/getGqlOutputType'

/**
 * Creates the fields for which the collection argument is the tail.
 * These fields will fetch a value from the head collection.
 */
// TODO: test
export default function createCollectionRelationTailGqlFieldEntries <TSource, TValue>(
  buildToken: BuildToken,
  collection: Collection<TValue>,
  options: {
    getCollectionValue: (source: TSource) => TValue,
    getFieldName?: (relation: Relation<TValue, mixed, mixed>, collection: Collection<mixed>) => string,
  },
): Array<[string, GraphQLFieldConfig<TSource, mixed>]> {
  const { inventory } = buildToken

  // Some tests may choose to not include the inventory. If this is the case,
  // just return an empty array.
  if (!inventory) return []

  const { gqlType: collectionGqlType } = getGqlOutputType(buildToken, collection.type)
  return (
    // Add all of our many-to-one relations (aka tail relations).
    inventory.getRelations()
      // We only want the relations for which this collection is the tail
      // collection and whose `headCollectionKey` have a `read`
      // implementation.
      .filter(relation =>
        relation.tailCollection === collection &&
        relation.headCollectionKey.read != null,
      )
      // Transform the relation into a field entry.
      .map(<THeadValue, THeadKey>(relation: Relation<TValue, THeadValue, THeadKey>): [string, GraphQLFieldConfig<TSource, mixed>] => {
        const headCollectionKey = relation.headCollectionKey
        const headCollection = headCollectionKey.collection
        const { gqlType: headCollectionGqlType, intoGqlOutput } = getGqlOutputType(buildToken, new NullableType(headCollection.type))

        return [
          options.getFieldName
            ? options.getFieldName(relation, collection)
            : formatName.field(`${headCollection.type.name}-by-${relation.name}`),
          {
            description: `Reads a single ${scrib.type(headCollectionGqlType)} that is related to this ${scrib.type(collectionGqlType)}.`,
            externalFieldNameDependencies: relation._tailFieldNames, // 🔥 Needs to account for classicIds
            type: headCollectionGqlType,
            async resolve (source: TSource, _args: {}, context: mixed, resolveInfo: mixed): Promise<mixed> {
              const value = options.getCollectionValue(source)
              const key = relation.getHeadKeyFromTailValue(value)
              const headValue = await headCollectionKey.read!(context, key, resolveInfo, headCollectionGqlType)

              if (headValue == null)
                return

              return intoGqlOutput(headValue)
            },
          },
        ]
      })
  )
}
