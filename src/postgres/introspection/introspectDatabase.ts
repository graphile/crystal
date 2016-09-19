import * as path from 'path'
import { readFile } from 'fs'
import { Client } from 'pg'
import minify = require('pg-minify')
import PGCatalog from './PGCatalog'

/**
 * The introspection query SQL string. We read this from it’s SQL file
 * synchronously at runtime. It’s just like requiring a file, except that file
 * is SQL.
 */
const introspectionQuery = new Promise<string>((resolve, reject) => {
  readFile(path.resolve(__dirname, '../../../queries/introspection.sql'), (error, data) => {
    if (error) reject(error)
    else resolve(minify(data.toString()))
  })
})

/**
 * Takes a PostgreSQL client and introspects it, returning an instance of
 * `PGObjects` which can then be consumed. Note that some translation is done
 * from the raw PostgreSQL catalog to the friendlier `PGObjects` interface.
 */
export default async function introspectDatabase (client: Client, schemas: string[]): Promise<PGCatalog> {
  // Run our single introspection query in the database.
  const result = await client.query({
    name: 'introspectionQuery',
    text: await introspectionQuery,
    values: [schemas],
  })

  // Extract out the objects from the query.
  const objects = new PGCatalog(result.rows.map(({ object }) => object))

  return objects
}
