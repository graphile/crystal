import { PoolConfig, Pool, Client } from 'pg'
import { Context } from '../../interface'

const $$pgClient = Symbol('postgres/client')

/**
 * Creates a function that will assign a Postgres client to a context variable.
 * The config passed in will be used to create a pool which will connect
 * clients.
 */
export function createPGContextAssignment (config: PoolConfig) {
  const pool = new Pool(config)

  return async (context: Context) => {
    const client = await pool.connect()

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
