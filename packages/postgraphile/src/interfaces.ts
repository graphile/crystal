import type { ResolvedPreset } from "graphile-plugin";
import type { GraphQLSchema } from "graphql";
import type { IncomingMessage } from "http";

export type ContextCallback = (req: IncomingMessage) => object;

export interface SchemaResult {
  schema: GraphQLSchema;
  config: ResolvedPreset;
  contextCallback: ContextCallback;
}

export interface ServerOptions {
  /** Port number to listen on */
  port?: number;

  /** Return settings to set in the session */
  pgSettings?: (req: IncomingMessage) => object;
}

declare module "graphile-plugin" {
  interface Preset {
    server?: ServerOptions;
  }
}
