const core = require("./core");

test(
  "simple collection for relation",
  core.test(
    __filename,
    "simple_collections",
    {
      simpleCollections: "omit",
      setofFunctionsContainNulls: false,
    },
    pgClient =>
      pgClient.query(`
        comment on constraint pets_owner_id_fkey on simple_collections.pets is E'@simpleCollections only';
      `)
  )
);
