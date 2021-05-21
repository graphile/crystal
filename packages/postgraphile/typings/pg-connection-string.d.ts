declare module "pg-connection-string" {
  import type { ClientConfig } from "pg";
  export function parse(connectionString: string): ClientConfig;
}
