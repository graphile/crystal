import { Catalog } from '../catalog'
import SchemaForge from './forge/SchemaForge'

type Config = {
  nodeIdFieldName?: string,
}

/**
 * Creates a new GraphQL schema from the given catalog.
 */
// This is actually just a nice wrapper around `SchemaForge` so users don’t
// need to worry about scary OO patterns.
export default function createSchema (catalog: Catalog, config: Config = {}) {
  const {
    nodeIdFieldName = '__id',
  } = config

  const options = {
    nodeIdFieldName,
  }

  return new SchemaForge(options, catalog).create()
}
