// TODO: Refactor this module, it has code smell…
import { mixed } from '../../interfaces';
import { ClientBase, PoolClient } from 'pg';

export const $$pgClient = 'pgClient';

/**
 * Retrieves a Postgres client from a context, throwing an error if such a
 * client does not exist.
 */
export default function getPgClientFromContext(context: mixed): PoolClient {
  if (context == null || typeof context !== 'object') throw new Error('Context must be an object.');

  const client = context[$$pgClient];

  if (client == null) throw new Error('Postgres client does not exist on the context.');

  if (!(client instanceof ClientBase))
    throw new Error('Postgres client on context is of the incorrect type.');

  return client as PoolClient;
}
