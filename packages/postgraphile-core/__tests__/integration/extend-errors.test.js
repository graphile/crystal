const { withPgClient } = require("../helpers");
const { createPostGraphileSchema } = require("../..");
// eslint-disable-next-line no-unused-vars
const { printSchema } = require("graphql");

function check(description, sql) {
  test(description, async () => {
    let error;
    // eslint-disable-next-line no-unused-vars
    let schema;
    await withPgClient(async pgClient => {
      await pgClient.query(sql);
      try {
        schema = await createPostGraphileSchema(pgClient, ["a", "b", "c"], {
          graphileBuildOptions: {
            dontSwallowErrors: true,
          },
          simpleCollections: "both",
          appendPlugins: [
            function DummySubPlugin(builder) {
              builder.hook(
                "GraphQLObjectType:fields",
                (fields, build, context) => {
                  if (!context.scope.isRootSubscription) {
                    return fields;
                  }
                  return build.extend(fields, {
                    mySub: {
                      type: build.graphql.GraphQLInt,
                    },
                  });
                }
              );
            },
          ],
        });
      } catch (e) {
        error = e;
      }
    });
    // Debugging
    if (!error) {
      // eslint-disable-next-line no-console
      // console.error(printSchema(schema));
    }
    expect(error).toBeTruthy();
    expect(error).toMatchSnapshot();
  });
}

check(
  "simple collections naming clash",
  `
    comment on constraint post_author_id_fkey on a.post is E'@foreignFieldName clash\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - direct",
  `
    comment on table a.post is E'@name person\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - condition",
  `
    comment on table a.post is E'@name person_condition\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - order",
  `
    comment on table a.post is E'@name people_order_by\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - query",
  `
    comment on table a.post is E'@name query\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - mutation",
  `
    comment on table a.post is E'@name mutation\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "table naming clash - subscription",
  `
    comment on table a.post is E'@name subscription\nRest of existing ''comment'' \nhere.';
  `
);

check(
  "function naming clash - payload",
  `
    comment on table a.post is E'@name q_edge\nRest of existing ''comment'' \nhere.';
    comment on function c.int_set_query(int, int, int) is E'@name q\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "function naming clash - nodeId",
  `
    comment on function c.int_set_query(int, int, int) is E'@name nodeId\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "function naming clash - createPost",
  `
    comment on function a.mutation_text_array() is E'@name createPost\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "function naming clash - updatePost",
  `
    comment on function a.mutation_text_array() is E'@name updatePost\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "function naming clash - deletePost",
  `
    comment on function a.mutation_text_array() is E'@name deletePost\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "function naming clash - computed",
  `
    comment on function c.edge_case_computed(c.edge_case) is E'@fieldName rowId\nRest of existing ''comment'' \nhere.';
  `
);
check(
  "column naming clash - rename",
  `
    comment on column c.edge_case.row_id is E'@name wontCastEasy\nRest of existing ''comment'' \nhere.';
  `
);
