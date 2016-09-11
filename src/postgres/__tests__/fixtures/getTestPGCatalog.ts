import { resolve } from 'path'
import { readFileSync } from 'fs'
import { PGCatalog, introspectDatabase } from '../../introspection'
import getTestPGClient from './getTestPGClient'

const forumExampleSchema = readFileSync(resolve(__dirname, '../../../../examples/forum/schema.sql')).toString()

let catalogPromise: Promise<PGCatalog> | null = null

/**
 * Gets the Postgres forum example catalog as is defined by our forum example
 * schema.
 */
export default function getTestPGCatalog (): Promise<PGCatalog> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const client = await getTestPGClient()

      await client.query('drop schema if exists forum_example, forum_example_utils cascade;')
      await client.query(forumExampleSchema)

      const catalog = await introspectDatabase(client, ['forum_example'])

      client.release()

      return catalog
    })()
  }

  return catalogPromise!
}
