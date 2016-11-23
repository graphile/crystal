import { resolve as resolvePath } from 'path'
import { readFile } from 'fs'
import { Client } from 'pg'
import minify = require('pg-minify')
import PgCatalog from './PgCatalog'

/**
 * The introspection query SQL string. We read this from it’s SQL file
 * synchronously at runtime. It’s just like requiring a file, except that file
 * is SQL.
 */
const introspectionQuery = new Promise<string>((resolve, reject) => {
  readFile(resolvePath(__dirname, '../../../resources/introspection-query.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(minify(data.toString()))
  })
})

/**
 * Takes a Postgres client and introspects it, returning an instance of
 * `PgObjects` which can then be consumed. Note that some translation is done
 * from the raw Postgres catalog to the friendlier `PgObjects` interface.
 */
export default async function introspectDatabase (client: Client, schemas: Array<string>): Promise<PgCatalog> {
  // Run our single introspection query in the database.
  const result = await client.query({
    name: 'introspectionQuery',
    text: await introspectionQuery,
    values: [schemas],
  })

  // Extract out the objects from the query.
  const objects = new PgCatalog(result.rows.map(({ object }) => object))

  return objects
}
