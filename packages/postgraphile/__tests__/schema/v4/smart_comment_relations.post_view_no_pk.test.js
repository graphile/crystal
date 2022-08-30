const core = require("./core");

test(
  "referencing other view (specifying columns, no PK)",
  core.test(
    __filename,
    ["smart_comment_relations"],
    {},
    pgClient =>
      pgClient.query(
        `
comment on view smart_comment_relations.post_view is E'@name posts
@uniqueKey id'; -- NOT primary key!

comment on view smart_comment_relations.offer_view is E'@name offers
@primaryKey id
@foreignKey (post_id) references post_view(id)';`
      ),
    schema => {
      const Offer = schema.getType("Offer");
      const fields = Offer.getFields();
      expect(fields.nodeId).toBeTruthy();
      expect(fields.postByPostId).toBeTruthy();
      const Query = schema.getType("Query");
      const queryFields = Query.getFields();
      // `@uniqueKey` does not add root level fields; use `@unique` for that.
      expect(queryFields.postById).toBeFalsy();
    }
  )
);
