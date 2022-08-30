const core = require("./core");

// WARNING: this function is not guaranteed to be SQL injection safe.
const offerViewComment = comment => pgClient =>
  pgClient.query(
    `comment on view smart_comment_relations.offer_view is E'${comment.replace(
      /'/g,
      "''"
    )}';`
  );

test(
  "referencing hidden table (ignored)",
  core.test(
    __filename,
    ["smart_comment_relations"],
    {},
    offerViewComment(`@name offers
@primaryKey id
@foreignKey (post_id) references post`),
    schema => {
      const Offer = schema.getType("Offer");
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
    }
  )
);
