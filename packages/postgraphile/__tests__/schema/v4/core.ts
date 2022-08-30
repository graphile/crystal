import type { PromiseOrDirect } from "dataplanner";
import type { GraphQLSchema } from "graphql";
import { lexicographicSortSchema, printSchema } from "graphql";
import type { PoolClient } from "pg";

import { createPostGraphileSchema } from "../../..";
import { withPgClient } from "../../helpers";
import { snapshot } from "../../helpers-v5";

let countByPath = Object.create(null);

export const test =
  (
    testPath: string,
    schemas: string | string[],
    options?: object,
    setup?: string | ((pgClient: PoolClient) => PromiseOrDirect<unknown>),
    finalCheck?: (schema: GraphQLSchema) => PromiseOrDirect<unknown>,
  ) =>
  () =>
    withPgClient(async (client) => {
      if (setup) {
        if (typeof setup === "function") {
          await setup(client);
        } else {
          await client.query(setup);
        }
      }
      const schema = await createPostGraphileSchema(client, schemas, options);
      const i = testPath in countByPath ? countByPath[testPath] + 1 : 1;
      countByPath[testPath] = i;
      const sorted = lexicographicSortSchema(schema);
      const printed = printSchema(sorted);
      const filePath = `${testPath.replace(/\.test\.[jt]s$/, "")}.${i}.graphql`;
      await snapshot(printed, filePath);
      if (finalCheck) {
        await finalCheck(schema);
      }
    });
