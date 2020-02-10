declare module "pg-connection-string" {
  import { ClientConfig } from "pg";
  export function parse(connectionString: string): ClientConfig;
}
