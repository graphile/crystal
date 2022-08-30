const core = require("./core");

test(
  "view with fake unique constraint",
  core.test(
    __filename,
    ["smart_comment_relations"],
    {},
    pgClient =>
      pgClient.query(
        `
comment on view smart_comment_relations.post_view is E'@name posts
@unique id'; -- NOT primary key!

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
      expect(queryFields.postById).toBeTruthy();
    }
  )
);
