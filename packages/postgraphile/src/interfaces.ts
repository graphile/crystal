import type { ResolvedPreset } from "graphile-plugin";
import type { GraphQLSchema } from "graphql";

export type ContextCallback = () => object;

export interface SchemaResult {
  schema: GraphQLSchema;
  config: ResolvedPreset;
  contextCallback: ContextCallback;
}

export interface ServerOptions {
  /** Port number to listen on */
  port?: number;
}

declare module "graphile-plugin" {
  interface Preset {
    server?: ServerOptions;
  }
}
