import { grafast } from "grafast";

import { createWithPgClient } from "../../adaptors/pg";
import { schema } from "./schema";

const withPgClient = createWithPgClient({
  connectionString: "postgres:///dataplanpg-example",
});

async function main() {
  const result = await grafast({
    schema,
    source: /* GraphQL */ `
      {
        users {
          id
          username
          createdAt
          posts {
            id
            body
          }
        }
        posts {
          id
          body
          createdAt
          author {
            id
            username
          }
        }
      }
    `,
    contextValue: {
      withPgClient,
      pgSettings: {},
    },
  });

  console.log(JSON.stringify(result, null, 2));
  await withPgClient.release?.();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
