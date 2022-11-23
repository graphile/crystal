import "graphile-config";

import type { GraphQLSchema } from "graphql";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";

export type ContextCallback = (
  graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
) => object;

export interface ServerParams {
  schema: GraphQLSchema;
  resolvedPreset: GraphileConfig.ResolvedPreset;
}

export interface ServerOptions {
  /** Port number to listen on */
  port?: number;
  /** Host to listen on */
  host?: string;

  /** The path at which GraphQL will be available; usually /graphql */
  graphqlPath?: string;
  /** The path at which the GraphQL event stream would be made available; usually /graphql/stream */
  eventStreamRoute?: string;

  graphiql?: boolean;
  /** If true, then we will render GraphiQL on GET requests to the /graphql endpoint */
  graphiqlOnGraphQLGET?: boolean;
  /** The path at which GraphiQL will be available; usually / */
  graphiqlPath?: string;

  /** Set true to enable watch mode */
  watch?: boolean;

  /** The length, in bytes, for the largest request body that the server will accept */
  maxRequestLength?: number;
}

declare global {
  namespace GraphileConfig {
    /**
     * Details about the incoming GraphQL request - e.g. if it was sent over an
     * HTTP request, the request itself so headers can be interrogated.
     *
     * It's anticipated this will be expanded via declaration merging, e.g. if
     * your server is Koa then a `koaCtx` might be added.
     */
    interface GraphQLRequestContext {
      // TODO: add things like operationName, operation, etc?
      httpRequest?: IncomingMessage;
      socket?: Socket;
    }
    interface Preset {
      server?: ServerOptions;
    }
  }
}
