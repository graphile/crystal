import type { WithPgClient } from "@dataplan/pg";
import type { PromiseOrDirect } from "grafast";

export interface PgAdaptor<
  TAdaptor extends
    keyof GraphileConfig.PgDatabaseAdaptorOptions = keyof GraphileConfig.PgDatabaseAdaptorOptions,
> {
  createWithPgClient: (
    adaptorSettings: GraphileConfig.PgServiceConfiguration<TAdaptor>["adaptorSettings"],
    variant?: "SUPERUSER" | null,
  ) => PromiseOrDirect<WithPgClient>;
}
