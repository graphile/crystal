const core = require("./core");

test(
  "simple collection for computed column",
  core.test(
    __filename,
    "simple_collections",
    {
      simpleCollections: "omit",
      setofFunctionsContainNulls: false,
    },
    pgClient =>
      pgClient.query(`
        comment on function simple_collections.people_odd_pets(simple_collections.people) is E'@simpleCollections only';
      `)
  )
);
