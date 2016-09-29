// TODO: Refactor this module, it has code smell…

import createDebugger = require('debug')
import { PoolConfig, Pool, Client } from 'pg'
import { Context } from '../../interface'

const debugQuery = createDebugger('postgraphql:postgres:query')

const $$pgClient = Symbol('postgres/client')

/**
 * Creates a function that will assign a Postgres client to a context variable.
 * The config passed in will be used to create a pool which will connect
 * clients.
 */
export function createPGContextAssignment (pool: Pool) {
  return async (context: Context) => {
    const client = await pool.connect()

    // If the client query debugger is enabled, log all of our Postgres
    // queries.
    if (debugQuery.enabled) {
      const originalQuery = client.query
      client.query = function debuggingQuery (...args: Array<any>) {
        // If possible we never want to log the variables. Only the query text.
        // If we logged variables we may log a password in plaintext.
        if (typeof args[0] === 'string') debugQuery(args[0])
        else if (typeof args[0] === 'object') debugQuery(args[0].text)

        return originalQuery.apply(this, args)
      }
    }

    context.addCleanupFunction(() => client.release())
    context.addDependency($$pgClient, client)
  }
}

/**
 * Creates a new context and adds the Postgres client. This function is mainly
 * used for testing.
 */
export function createPGContext (client: Client): Context {
  const context = new Context()
  context.addDependency($$pgClient, client)
  return context
}

/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
export function pgClientFromContext (context: Context): Client {
  const client = context.getDependency($$pgClient)

  if (client == null || !(client instanceof Client))
    throw new Error('Must pass add a Postgres client as a dependency of the context.')

  return client
}
