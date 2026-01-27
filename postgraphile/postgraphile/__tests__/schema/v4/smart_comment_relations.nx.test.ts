import type { PoolClient } from "pg";

import * as core from "./core.ts";

// WARNING: this function is not guaranteed to be SQL injection safe.
const offerViewComment = (comment: string) => (pgClient: PoolClient) =>
  pgClient.query(
    `comment on view smart_comment_relations.offer_view is E'${comment.replace(
      /'/g,
      "''",
    )}';`,
  );

test("referencing non-existent table (throws error)", async () => {
  let error: any;
  try {
    await core.test(
      __filename,
      ["smart_comment_relations"],
      {},
      offerViewComment(`@name offers
@primaryKey id
@foreignKey (post_id) references posts`),
    )();
  } catch (e) {
    error = e;
  }
  expect(error).toBeTruthy();
  expect(error).toMatchInlineSnapshot(
    `[Error: Invalid @foreignKey on 'smart_comment_relations.offer_view'; referenced non-existent table/view 'smart_comment_relations.posts'. Note that this reference must use *database names* (i.e. it does not respect @name). ((post_id) references posts)]`,
  );
});
