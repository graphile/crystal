import { printSchema } from "graphql";

import { createPostGraphileSchema } from "../../..";
import { withPgClient } from "../../helpers.js";
import { snapshot } from "../../helpers-v5.js";

test("Simple schema print (no ordering)", () =>
  withPgClient(async (client) => {
    const schema = await createPostGraphileSchema(client, ["a", "b", "c"], {
      subscriptions: true,
    });
    const filePath = `${__filename.replace(/\.test\.[jt]s$/, "")}.graphql`;
    return snapshot(printSchema(schema), filePath);
  }));
