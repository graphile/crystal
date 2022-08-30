const core = require("./core");

test(
  "omit create, update and delete on table",
  core.test(
    __filename,
    ["d"],
    {},
    `
comment on table d.films is E'@omit create,update,delete';
`
  )
);
