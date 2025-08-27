// @ts-check
import { loadOneWithPgClient, PgSelectSingleStep } from "@dataplan/pg";
import {} from "graphile-config";
import { extendSchema } from "graphile-utils";

const plugin = extendSchema((build) => {
  const executor = build.input.pgRegistry.pgExecutors.main;
  return {
    typeDefs: /* GraphQL */ `
      extend type User {
        lifetimeOrderTotal: Int
      }
    `,
    plans: {
      User: {
        lifetimeOrderTotal($user: PgSelectSingleStep) {
          const $id = $user.get("id");
          return loadOneWithPgClient(
            executor,
            $id,
            (ids, { shared: { pgClient } }) => {
              return ids;
            },
          );
        },
      },
    },
  };
});

export const preset: GraphileConfig.Preset = {
  plugins: [plugin],
};
