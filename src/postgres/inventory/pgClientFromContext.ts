// TODO: Refactor this module, it has code smell…

import { PoolConfig, Pool, Client } from 'pg'

export const $$pgClient = Symbol('postgres/client')

/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
export default function getPGClientFromContext (context: Map<Symbol, mixed>): Client {
  const client = context.get($$pgClient)

  if (client == null || !(client instanceof Client))
    throw new Error('Postgres client not found in the context.')

  return client
}
