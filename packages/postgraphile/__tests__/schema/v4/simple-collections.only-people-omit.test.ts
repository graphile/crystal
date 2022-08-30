const core = require("./core");

test(
  "schema with simple collections by default, but relay for people",
  core.test(
    __filename,
    "simple_collections",
    {
      simpleCollections: "only",
      setofFunctionsContainNulls: false,
    },
    pgClient =>
      pgClient.query(`
        comment on table simple_collections.people is E'@simpleCollections omit';
      `)
  )
);
