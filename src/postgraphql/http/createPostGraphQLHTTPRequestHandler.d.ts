import { IncomingMessage, ServerResponse } from 'http'
import { GraphQLSchema } from 'graphql'
import { Pool } from 'pg'

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
export default function createPostGraphQLHTTPRequestHandler (config: {
  // The actual GraphQL schema we will use.
  graphqlSchema: GraphQLSchema,

  // A Postgres client pool we use to connect Postgres clients.
  pgPool: Pool,

  // The exact (and only) route our request handler will respond to.
  graphqlRoute?: string,

  // Whether or not we should show GraphiQL when the user asks for an HTML
  // representation. Note that his overrides `graphiqlRoute`. If not
  // `graphiqlRoute` is defined, the default route is `/graphiql`.
  graphiql?: boolean,

  // Allows the user to customize what route GraphiQL is served on.
  //
  // We seperate GraphiQL and our main GraphQL route so that we can evolve
  // GraphiQL as an app seperately and do not have to depend on its HTTP
  // functionality.
  graphiqlRoute?: string,

  // Specifies whether or not we should show an error’s stack trace. If the
  // value is `json` then the stack will be formatted in a way that is readble
  // in JSON. Helpful for debugging.
  showErrorStack?: boolean | 'json',

  // Enables some CORS rules. When enabled there may be some pre-flight
  // requests with negative performance impacts.
  enableCORS?: boolean,
}): HTTPRequestHandler
