import {
  Collection,
  NullableType,
  ObjectType,
  BasicObjectType,
  BasicObjectField,
} from '../../../interface'

import pluralize = require('pluralize')
import DataLoader = require('dataloader')
import { Client } from 'pg'
import { memoize1, sql } from '../../utils'
import { PGCatalog, PGCatalogClass, PGCatalogNamespace, PGCatalogAttribute } from '../../introspection'
import isPGContext from '../isPGContext'
import typeFromPGType from '../typeFromPGType'
import PGCollectionType from './PGCollectionType'

/**
 * Creates a collection object for Postgres that can be used to access the
 * data. A collection aligns fairly well with a Postgres “class” that is
 * selectable. Non-selectable classes are generally compound types.
 */
export default function createPGCollection (
  pgCatalog: PGCatalog,
  pgClass: PGCatalogClass,
): Collection<PGCollectionType.Value> {
  const pgNamespace = pgCatalog.assertGetNamespace(pgClass.namespaceId)
  const pgAttributes = pgCatalog.getClassAttributes(pgClass.id)

  const getInsertLoader = memoize1(createInsertLoader)

  const type = new PGCollectionType(pgCatalog, pgClass)

  return {
    name: pluralize(pgClass.name),
    description: pgClass.description,
    type,
    keys: new Set(),
    primaryKey: null,
    paginator: null,

    // If we can’t insert into this class, there should be no `create`
    // function.
    create: !pgClass.isInsertable
      ? null
      : (context: mixed, value: PGCollectionType.Value): Promise<PGCollectionType.Value> => {
        if (!isPGContext(context)) throw isPGContext.error()
        return getInsertLoader(context.client).load(value)
      },
  }

  /**
   * Create’s a loader for inserting rows into the database. We create a
   * memoized version of this function to ensure we get consistent data
   * loaders.
   *
   * @private
   */
  function createInsertLoader (client: Client): DataLoader<PGCollectionType.Value, PGCollectionType.Value> {
    return new DataLoader<PGCollectionType.Value, PGCollectionType.Value>(
      async (values: Array<PGCollectionType.Value>): Promise<Array<PGCollectionType.Value>> => {
        // Create our insert query.
        const query = sql.compile(sql.query`
          -- Start by defining our header which will be the class we are
          -- inserting into (prefixed by namespace of course).
          insert into ${sql.identifier(pgNamespace.name, pgClass.name)}

          -- Next, add all of our value tuples.
          values ${sql.join(values.map(value => {
            const row = type.toRow(value)
            // Make sure we have one value for every attribute in the class,
            // if there was no such value defined, we should just use
            // `default` and use the database’s default value.
            return sql.query`(${sql.join(pgAttributes.map(({ name }) =>
              row.hasOwnProperty(name) ? sql.value(row[name]) : sql.raw('default')
            ), ', ')})`
          }), ', ')}

          -- Finally, return everything.
          -- TODO: This shouldn’t return *…
          returning *
        `)()

        const { rows } = await client.query(query)
        return rows.map(row => type.fromRow(row))
      }
    )
  }
}
