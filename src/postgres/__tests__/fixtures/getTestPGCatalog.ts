import { PGCatalog, introspectDatabase } from '../../introspection'
import createKitchenSinkPGSchema from './createKitchenSinkPGSchema'
import getTestPGClient from './getTestPGClient'

beforeAll(createKitchenSinkPGSchema)

let catalogPromise: Promise<PGCatalog> | null = null

/**
 * Gets the Postgres forum example catalog as is defined by our forum example
 * schema.
 */
export default function getTestPGCatalog (): Promise<PGCatalog> {
  if (!catalogPromise) {
    catalogPromise = (async () => {
      const client = await getTestPGClient()
      const catalog = await introspectDatabase(client, ['a', 'b', 'c'])
      return catalog
    })()
  }

  return catalogPromise!
}
