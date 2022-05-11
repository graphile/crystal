import "graphile-config";

import type { GraphQLSchema } from "graphql";

export type ContextCallback = (
  graphqlRequestContext: GraphileConfig.GraphQLRequestContext,
) => object;

// TODO: rename this!
export interface SchemaResult {
  schema: GraphQLSchema;
  config: GraphileConfig.ResolvedPreset;
  contextCallback: ContextCallback;
}

export interface ServerOptions {
  /** Port number to listen on */
  port?: number;

  /** The path at which GraphQL will be available; usually /graphql */
  graphqlPath?: string;
  /** The path at which the GraphQL event stream would be made available; usually /graphql/stream */
  eventStreamRoute?: string;

  graphiql?: boolean;
  /** If true, then we will render GraphiQL on GET requests to the /graphql endpoint */
  graphiqlOnGraphQLGET?: boolean;
  /** The path at which GraphiQL will be available; usually / */
  graphiqlPath?: string;

  exposePlan?: boolean;
  /** The path at which the latest plan will be visible; usually /plan */
  planPath?: string;

  /** Set true to enable watch mode */
  watch?: boolean;
}

declare global {
  namespace GraphileConfig {
    interface Preset {
      server?: ServerOptions;
    }
  }
}
