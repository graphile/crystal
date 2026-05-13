/* eslint-disable graphile-export/export-methods, graphile-export/export-plans */
import { execute, grafast } from "grafast";

import type { GraphQLClient } from "../../dist/index.js";
import { githubSchema } from "./githubSchema.ts";
import { schema } from "./schema.ts";

const githubClient: GraphQLClient = {
  async execute(args) {
    console.log("Executing...");
    try {
      return await execute({
        ...args,
        schema: githubSchema,
      });
    } finally {
      console.log("...Executed");
    }
  },
};

async function main() {
  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      query Q {
        currentUser {
          ...User
        }
        githubUserByUsername(username: "jemgillam") {
          username
        }
      }
      fragment User on User {
        id
        name
        githubRepositories {
          name
          issueCount
          owner {
            username
          }
        }
      }
    `,
    contextValue: {
      currentUserId: "benjie",
      githubClient,
    },
  });
  console.dir(result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
