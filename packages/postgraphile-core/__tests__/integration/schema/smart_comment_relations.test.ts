import * as core from "./core";
import { GraphQLObjectType } from "graphql";
import { PoolClient } from "pg";

// WARNING: this function is not guaranteed to be SQL injection safe.
const offerViewComment = (comment: string) => (pgClient: PoolClient) =>
  pgClient.query(
    `comment on view smart_comment_relations.offer_view is E'${comment.replace(
      /'/g,
      "''",
    )}';`,
  );

test(
  "prints a schema for smart_comment_relations",
  core.test(["smart_comment_relations"], {}),
);

test("referencing non-existent table (throws error)", async () => {
  let error;
  try {
    await core.test(
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
    `[Error: @foreignKey smart comment referenced non-existent table/view 'smart_comment_relations'.'posts'. Note that this reference must use *database names* (i.e. it does not respect @name). ((post_id) references posts)]`,
  );
});

test(
  "referencing hidden table (ignored)",
  core.test(
    ["smart_comment_relations"],
    {},
    offerViewComment(`@name offers
@primaryKey id
@foreignKey (post_id) references post`),
    (schema) => {
      const Offer = schema.getType("Offer") as GraphQLObjectType;
      const fields = Offer.getFields();
      expect(fields.nodeId).toBeTruthy();
      expect(fields.postsByPostId).toBeFalsy();
      expect(Object.keys(fields)).toMatchInlineSnapshot(`
        Array [
          "nodeId",
          "id",
          "postId",
        ]
      `);
    },
  ),
);
test(
  "referencing other view (no columns)",
  core.test(
    ["smart_comment_relations"],
    {},
    offerViewComment(
      `@name offers
@primaryKey id
@foreignKey (post_id) references post_view`,
    ),
    (schema) => {
      const Offer = schema.getType("Offer") as GraphQLObjectType;
      const fields = Offer.getFields();
      expect(fields.nodeId).toBeTruthy();
      expect(fields.postByPostId).toBeTruthy();
    },
  ),
);

test(
  "referencing other view (specifying columns, no PK)",
  core.test(
    ["smart_comment_relations"],
    {},
    (pgClient) =>
      pgClient.query(
        `
comment on view smart_comment_relations.post_view is E'@name posts
@uniqueKey id'; -- NOT primary key!

comment on view smart_comment_relations.offer_view is E'@name offers
@primaryKey id
@foreignKey (post_id) references post_view(id)';`,
      ),
    (schema) => {
      const Offer = schema.getType("Offer") as GraphQLObjectType;
      const fields = Offer.getFields();
      expect(fields.nodeId).toBeTruthy();
      expect(fields.postByPostId).toBeTruthy();
    },
  ),
);
