import * as core from "./core.js";

test(
  "simple collection for computed attribute",
  core.test(
    __filename,
    "simple_collections",
    {
      simpleCollections: "omit",
      setofFunctionsContainNulls: false,
    },
    (pgClient) =>
      pgClient.query(`
        comment on function simple_collections.people_odd_pets(simple_collections.people) is E'@simpleCollections only';
      `),
  ),
);
