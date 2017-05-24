import { IncomingMessage, ServerResponse } from 'http'
import { GraphQLSchema } from 'graphql'
import { Pool } from 'pg'
import { EventEmitter } from 'events'

/**
 * A request handler for one of many different `http` frameworks.
 */
export interface HttpRequestHandler {
  (req: IncomingMessage, res: ServerResponse, next?: (error?: mixed) => void): void
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
export default function createPostGraphQLHttpRequestHandler (config: {
  // The actual GraphQL schema we will use.
  getGqlSchema: () => Promise<GraphQLSchema>,

  // A Postgres client pool we use to connect Postgres clients.
  pgPool: Pool,

  _emitter: EventEmitter,

  // The exact (and only) route our request handler will respond to.
  graphqlRoute?: string,

  // Whether or not we should show GraphiQL when the user asks for an HTML
  // representation. Note that his overrides `graphiqlRoute`. If not
  // `graphiqlRoute` is defined, the default route is `/graphiql`.
  graphiql?: boolean,

  // Allows the user to customize what route GraphiQL is served on.
  //
  // We seperate GraphiQL and our main GraphQL route so that we can evolve
  // GraphiQL as an app seperately and do not have to depend on its Http
  // functionality.
  graphiqlRoute?: string,

  // The secret to use when decoding JWT tokens from request authorization
  // headers. Make sure to keep this private, never let anyone else know its
  // value.
  jwtSecret?: string,

  // The audiences to use when verifing the JWT token. If not set the default
  // audience will be ['postgraphql'].
  jwtAudiences?: Array<string>,

  // Whether or not we are watching the PostGraphQL schema for changes. Should
  // be associated with `_emitter`.
  watchPg?: boolean,

  // The default Postgres role to use if no role is provided in a provided JWT
  // token. Also known as the “anonymous” role.
  pgDefaultRole?: string,

  // Specifies whether or not we should show an error’s stack trace. If the
  // value is `json` then the stack will be formatted in a way that is readble
  // in JSON. Helpful for debugging.
  showErrorStack?: boolean | 'json',

  // Disables the query log. Whenever a GraphQL query is about to be executed, it
  // will first be logged to the console.
  disableQueryLog?: boolean,

  // Enables some CORS rules. When enabled there may be some pre-flight
  // requests with negative performance impacts.
  enableCors?: boolean,

  // Set the maximum size of JSON bodies that can be parsed (default 100kB).
  // The size can be given as a human-readable string, such as '200kB' or '5MB'
  // (case insensitive).
  bodySizeLimit?: string,

  // Allows the definition of custom postgres settings which get injected in
  // each transaction via set_config. They can then be used via current_setting
  // in postgres functions.
  pgSettings?: { [key: string]: mixed },
}): HttpRequestHandler
