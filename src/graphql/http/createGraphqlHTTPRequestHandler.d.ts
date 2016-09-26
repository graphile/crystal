import { IncomingMessage, ServerResponse } from 'http'
import { Inventory } from '../../interface'
import { SchemaOptions } from '../schema/createGraphqlSchema'

/**
 * Options used to create our request handler. Includes all of the options
 * necessary to create our schema.
 */
type HTTPRequestHandlerOptions = SchemaOptions & {
  // The exact (and only) route our request handler will respond to.
  route?: string,
  graphiql?: boolean,
}

/**
 * A request handler for one of many different `http` frameworks.
 */
interface HTTPRequestHandler {
  (req: IncomingMessage, res: ServerResponse, next?: (error?: any) => void): void
  (ctx: { req: IncomingMessage, res: ServerResponse }, next: () => void): Promise<void>
}

/**
 * Creates a GraphQL request handler that can support many different `http` frameworks, including:
 *
 * - Native Node.js `http`.
 * - `connect`.
 * - `express`.
 * - `koa` (2.0).
 */
export default function createGraphqlHTTPRequestHandler (
  inventory: Inventory,
  options?: HTTPRequestHandlerOptions,
): HTTPRequestHandler
