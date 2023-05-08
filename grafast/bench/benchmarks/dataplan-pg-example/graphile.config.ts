import "graphile-config";
import "../../src/index.js";
import { createWithPgClient } from "@dataplan/pg/adaptors/pg";

export const withPgClient = createWithPgClient({
  connectionString: "postgres:///pggql_test",
});

declare module "../../src/interfaces.js" {
  interface GrafastBenchSetupResult {
    withPgClient: ReturnType<typeof createWithPgClient>;
  }
}

const preset: GraphileConfig.Preset = {
  bench: {
    schema: `${__dirname}/../../../dataplan-pg/scripts/exampleSchemaExport.mjs`,
    operations: `${__dirname}/../../../dataplan-pg/__tests__/queries/*/*.test.graphql`,
    // operations: `${__dirname}/../../../dataplan-pg/__tests__/queries/interfaces-relational/nested-more-fragments.test.graphql`,
    setup() {
      const withPgClient = createWithPgClient({
        connectionString: "postgres:///pggql_test",
      });
      return { withPgClient };
    },
    teardown(setupResult) {
      setupResult.withPgClient.release?.();
    },
    contextFactory(_operation, setupResult) {
      const { withPgClient } = setupResult;
      return {
        withPgClient,
      };
    },
  },
};

export default preset;
