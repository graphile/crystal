import { isObjectType } from "grafast/graphql";
import type { PoolClient } from "pg";

import * as core from "./core.js";

// WARNING: this function is not guaranteed to be SQL injection safe.
const offerViewComment = (comment: string) => (pgClient: PoolClient) =>
  pgClient.query(
    `comment on view smart_comment_relations.offer_view is E'${comment.replace(
      /'/g,
      "''",
    )}';`,
  );

test(
  "referencing other view (no attributes)",
  core.test(
    __filename,
    ["smart_comment_relations"],
    {},
    offerViewComment(
      `@name offers
@primaryKey id
@foreignKey (post_id) references post_view`,
    ),
    (schema) => {
      const Offer = schema.getType("Offer");
      if (!isObjectType(Offer)) {
        throw new Error("Expected Offer to be an object type");
      }
      const fields = Offer.getFields();
      expect(fields.nodeId).toBeTruthy();
      expect(fields.postByPostId).toBeTruthy();
    },
  ),
);
